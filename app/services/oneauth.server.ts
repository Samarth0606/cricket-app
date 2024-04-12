import axios from "axios";

const ac = axios.create({
  baseURL: process.env.ONEAUTH_API_HOST + "/api",
});

const sendEmailOtp = (email: string) => {
  return ac.post(`/otp/email`, {
    client_id: process.env.ONEAUTH_CLIENT_ID,
    client_secret: process.env.ONEAUTH_CLIENT_SECRET,
    email,
  });
};
const sendMobileOtp = (mobile: string) => {
  return ac.post(`/otp/mobile`, {
    client_id: process.env.ONEAUTH_CLIENT_ID,
    client_secret: process.env.ONEAUTH_CLIENT_SECRET,
    mobile,
  });
};
const verifyEmailOtp = (email: string, otp_id: string, otp: string) => {
  return ac.post("/otp/email/verify", {
    client_id: process.env.ONEAUTH_CLIENT_ID,
    client_secret: process.env.ONEAUTH_CLIENT_SECRET,
    client_name: "cricket-quiz-iccwc23-codingblocks",
    email,
    otp_id,
    otp,
  });
};

const verifyMobileOtpAndLogin = (
  mobile: string,
  otp_id: string,
  otp: string
) => {
  return ac.post("/otp/mobile/verify-and-login", {
    client_id: process.env.ONEAUTH_CLIENT_ID,
    client_secret: process.env.ONEAUTH_CLIENT_SECRET,
    mobile,
    otp_id,
    otp,
  });
};
const forMobileVerify = (mobile: string, oneauthId: string) => {
  return ac.post<{
    Status: string;
    Details: string;
  }>("/otp/for-mobile-verify", {
    mobile,
    oneauth_id: oneauthId,
    client_id: process.env.ONEAUTH_CLIENT_ID,
    client_secret: process.env.ONEAUTH_CLIENT_SECRET,
  });
};

const verifyMobileOtp = (
  mobile: string,
  otpId: string,
  otp: string,
  oneauthId: string
) => {
  return ac.post<{ Status: string; Details: string } | "OK">(
    "/otp/mobile/verify",
    {
      mobile,
      otp_id: otpId,
      otp,
      oneauth_id: oneauthId,
      client_id: process.env.ONEAUTH_CLIENT_ID,
      client_secret: process.env.ONEAUTH_CLIENT_SECRET,
    }
  );
};

export {
  verifyEmailOtp,
  verifyMobileOtpAndLogin,
  sendMobileOtp,
  sendEmailOtp,
  forMobileVerify,
  verifyMobileOtp,
};
