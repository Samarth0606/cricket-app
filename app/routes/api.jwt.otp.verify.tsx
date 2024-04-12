import { type ActionFunctionArgs } from "@remix-run/node";
import {
  verifyEmailOtp,
  verifyMobileOtpAndLogin,
} from "~/services/oneauth.server";
import cookie from "cookie";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { email, mobile, otp_id, otp } = await request.json();
  let response: any = null;
  if (email) {
    response = await verifyEmailOtp(email, otp_id, otp);
  } else if (mobile) {
    response = await verifyMobileOtpAndLogin("+91-" + mobile, otp_id, otp);
  }

  const cookies = response.headers["set-cookie"];
  const authCookie = cookies.filter(
    (c: any) => c.split("=")[0] === "cb_auth"
  )[0];

  const authCookieParams: any = {};
  authCookie.split("; ").forEach((p: any) => {
    const [key, val] = p.split("=");
    authCookieParams[key] = val;
  });

  const setCookie = cookie.serialize("cb_auth", authCookieParams["cb_auth"], {
    maxAge: 86400000,
    domain: authCookieParams["Domain"],
    secure: Object.keys(authCookieParams).includes("Secure") ? true : false,
    httpOnly: true,
    path: authCookieParams["Path"],
  });

  return new Response(null, {
    headers: {
      "Set-Cookie": setCookie,
    },
  });
};
