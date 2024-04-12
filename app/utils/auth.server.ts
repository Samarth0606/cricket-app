import jsonwebtoken from "jsonwebtoken";
import { fileURLToPath } from "url";
import * as path from "path";
import fs from "fs";
import { parse as parseCookie } from "./cookie-parser.server";
import { db } from "./db.server";
import { type JwtPayload } from "types/jwt-payload";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicKey: string = fs.readFileSync(
  path.join(__dirname, "..", process.env.PUBLIC_KEY as string),
  "utf-8"
);

/**
 * Method to check if the user is authenticated or not.
 * If authenricated, return the `user`
 * If not return `null`
 */
const authenticate = async (req: Request) => {
  try {
    const token = req.headers.get("Cookie");

    if (token === null) {
      return null;
    }

    const cookie = parseCookie(token)["cb_auth"];

    if (cookie === undefined) {
      return null;
    }

    const payload = jsonwebtoken.verify(cookie, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    const existingUser = await db.user.findUnique({
      where: { oneauth_id: +payload.id },
    });

    if (existingUser) {
      return existingUser;
    } else {
      const newUser = await db.user.create({
        data: {
          oneauth_id: +payload.id,
          verifiedmobile: payload.verifiedmobile,
          firstname: payload.firstname || '',
          lastname: payload.lastname || '',
          email: payload.email,
          mobile: payload.mobile_number,
          photo: payload.photo,
        },
      });
      return newUser;
    }
  } catch (err: any) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return null;
    }
    throw new Error(err);
  }
};

export { authenticate };
