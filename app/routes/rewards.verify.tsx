import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Button from "~/components/button";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { db } from "~/utils/db.server";
import { authenticate } from "~/utils/auth.server";
import { verifyMobileOtp } from "~/services/oneauth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  if (!user || (user.verifiedmobile !== null && user.verifiedmobile !== "")) {
    throw new Response("Document not found", { status: 404 });
  }
  return json({
    user,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // Allow only logged in user to submit the otp --------------------
  const user = await authenticate(request);

  if (!user || (user.verifiedmobile !== null && user.verifiedmobile !== "")) {
    throw new Response("Document not found", { status: 404 });
  }

  // Parse otp form data -------------------------------------------
  const formData = await request.formData();

  const FormDataSchema = z.object({
    otp: z.string(),
  });

  const parsedFormData = await FormDataSchema.safeParseAsync(
    Object.fromEntries(formData)
  );

  if (parsedFormData.success === false) {
    return json({
      errors: {
        otp: "Invalid OTP",
      },
    });
  }

  // Extract `contact` query string -------------------------------
  const url = new URL(request.url);
  const contact = url.searchParams.get("contact");
  const otpId = url.searchParams.get("id");

  if (!contact || !otpId) {
    throw new Response("Invalid request", { status: 400 });
  }

  // Verify OTP --------------------------------------------------
  try {
    await verifyMobileOtp(
      `+91-${contact}`,
      otpId,
      parsedFormData.data.otp,
      String(user.oneauth_id)
    );
    // update user to db --------------------------------------
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verifiedmobile: `+91-${contact}`,
        mobile: `+91-${contact}`,
      },
    });
  } catch (err: any) {
    console.log("error", err.response.data);
    if (err.response && err.response.data) {
      return json({
        errors: {
          otp: err.response.data.Details || err.response.data.message,
        },
      });
    }
    throw new Response("Unable to verify OTP", { status: 500 });
  }

  return redirect(`/rewards/success`);
};

export default function RewardsVerify() {
  const actionData = useActionData<typeof action>();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="space-y-8">
      <p className="font-cwc-india text-yellow-1 text-3xl text-center">
        Verify your contact number to claim rewards
      </p>
      <Form method="POST">
        <div className="flex justify-center">
          <input
            ref={inputRef}
            name="otp"
            className="focus:outline-none bg-white text-purple-1 font-cwc-india text-2xl text-center"
            placeholder="Enter OTP"
          />

          <Button
            clip={0}
            type="submit"
            disabled={
              navigation.state === "loading" ||
              navigation.state === "submitting"
            }
          >
            Verify OTP
          </Button>
        </div>
      </Form>
      <p className="text-center text-red-1 font-bold">
        {actionData && actionData.errors && actionData.errors.otp
          ? actionData.errors.otp
          : null}
      </p>
    </div>
  );
}
