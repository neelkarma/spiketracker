import { SESSION_SECRET } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { TokenSet } from "openid-client";

export interface StudentInfo {
  oauth: TokenSet;
  id: number;
}

export type JwtExtras = { admin: true } | ({ admin: false } & StudentInfo);

const signSessionToken = (studentInfo?: StudentInfo) => {
  if (studentInfo) {
    const { oauth, id } = studentInfo;
    return jwt.sign(
      { oauth: JSON.parse(JSON.stringify(oauth)), id, admin: false },
      SESSION_SECRET
    );
  } else return jwt.sign({ admin: true }, SESSION_SECRET, { expiresIn: "90d" });
};

const verifySessionToken = (token: string): (JwtPayload & JwtExtras) | null => {
  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    console.log("JWT Payload:", payload);
    if (typeof payload === "string") return null;

    if (payload.oauth) {
      return <JwtPayload & JwtExtras>{
        ...payload,
        oauth: new TokenSet(payload.oauth),
      };
    } else return <JwtPayload & JwtExtras>payload;
  } catch (err) {
    console.error("Error verifying session token:", err);
    return null;
  }
};

const getRawSessionToken = (cookies: Cookies) =>
  cookies.get("Authorization")?.split(" ")[1];

export const getJWT = (cookies: Cookies) => {
  const clientToken = getRawSessionToken(cookies);
  if (clientToken) return verifySessionToken(clientToken);
  return null;
};

export const storeJWT = (cookies: Cookies, studentInfo?: StudentInfo) => {
  const sessionToken = signSessionToken(studentInfo);
  cookies.set("Authorization", `Bearer ${sessionToken}`, {
    path: "/",
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60, // 90 days
  });
};
