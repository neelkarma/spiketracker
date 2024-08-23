import { SESSION_SECRET } from "$env/static/private";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";

/** The session secret encoded into a bytearray. */
const secret = new TextEncoder().encode(SESSION_SECRET);

/** The payload of the Session JWT in all user's cookies. */
export type SessionTokenPayload =
  | {
      admin: true;
      id: undefined;
    }
  | {
      admin: false;
      id: number;
    };

/**
 * Signs a session token.
 * @param payload - The payload to use in the token.
 * @returns the signed session token.
 */
export function signSessionToken(
  payload: SessionTokenPayload,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret);
}

/**
 * Verifies a session token.
 * @param token - The session token to verify.
 * @returns the payload of the token if valid.
 * @throws if the token is invalid.
 */
export async function verifySessionToken(
  token: string,
): Promise<SessionTokenPayload & JWTPayload> {
  const { payload } = await jwtVerify<SessionTokenPayload>(token, secret);
  return payload;
}
