import { SESSION_SECRET } from "$env/static/private";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(SESSION_SECRET);

export type SessionTokenPayload =
  | {
      admin: true;
      id: undefined;
    }
  | {
      admin: false;
      id: number;
    };

export function signSessionToken(
  payload: SessionTokenPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionTokenPayload & JWTPayload> {
  const { payload } = await jwtVerify<SessionTokenPayload>(token, secret);
  return payload;
}
