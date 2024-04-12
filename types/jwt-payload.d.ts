type JwtPayload = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  photo: string;
  email: string;
  mobile_number: string;
  verifiedmobile: string | null;
};

export { JwtPayload };
