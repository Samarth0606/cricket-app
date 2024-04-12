import { type ActionFunctionArgs, json } from "@remix-run/node";
import { sendEmailOtp, sendMobileOtp } from "~/services/oneauth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { email, mobile } = await request.json();
  let response;
  if (email) {
    response = await sendEmailOtp(email as string);
  } else if (mobile) {
    response = await sendMobileOtp("+91-" + mobile);
  }
  return json({ ...response!.data }, { status: 200 });
};
