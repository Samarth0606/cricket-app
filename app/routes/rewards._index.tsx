import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Button from "~/components/button";
import validator from "validator";
import { z } from "zod";
import { useRef, useEffect } from "react";
import { authenticate } from "~/utils/auth.server";
import { forMobileVerify } from "~/services/oneauth.server";

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

  // Parse form data -------------------------
  const formData = await request.formData();

  const FormDataSchema = z.object({
    contact: z.string().refine(validator.isMobilePhone),
  });

  const parsedFormData = await FormDataSchema.safeParseAsync(
    Object.fromEntries(formData)
  );

  if (parsedFormData.success === false) {
    return json({
      errors: {
        contact: "Invalid contact number",
      },
    });
  }

  // send otp ----------------------------------
  let otpResponse: any = null;
  try {
    otpResponse = await forMobileVerify(
      `+91-${parsedFormData.data.contact}`,
      String(user.oneauth_id)
    );
  } catch (e: any) {
    if (e.response && e.response.data) {
      return json({
        errors: {
          contact: e.response.data.message || e.response.data.Details,
        },
      });
    }
  }

  return redirect(
    `verify?contact=${parsedFormData.data.contact}&id=${otpResponse.data.Details}`
  );
};

export default function RewardsIndex() {
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
            name="contact"
            className="focus:outline-none bg-white text-purple-1 font-cwc-india text-2xl text-center"
            placeholder="Your contact number"
          />
          <Button
            clip={0}
            type="submit"
            disabled={
              navigation.state === "loading" ||
              navigation.state === "submitting"
            }
          >
            Send OTP
          </Button>
        </div>
      </Form>
      <p className="text-center text-red-1 font-bold">
        {actionData && actionData.errors && actionData.errors.contact
          ? actionData.errors.contact
          : null}
      </p>
    </div>
  );
}
