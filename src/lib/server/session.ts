import { SESSION_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import { getStudentId, type TokenEndpointResponse } from "./sbhs";

/** The JWT payload of the session token. */
export type SessionTokenPayload =
  | {
      /** Whether the user is admin or not */
      admin: true;
    }
  | {
      /** Whether the user is admin or not */
      admin: false;
      /** The student's id */
      id: number;
      /** The student's OAuth access token */
      access_token: string;
      /** The student's OAuth access token expiry time, in unix epoch seconds */
      access_exp: number;
      /** The student's OAuth refresh token */
      refresh_token: string;
    };

/**
 * Generates a session token payload for a student given their OAuth token set.
 * @param tokenSet The token set to use to generate the session token payload
 * @returns The session token payload
 */
export const sessionTokenPayloadFromOAuth = async (
  tokenSet: TokenEndpointResponse
): Promise<SessionTokenPayload> => {
  const id = await getStudentId(tokenSet.access_token);

  const payload: SessionTokenPayload = {
    admin: false,
    id,
    access_token: tokenSet.access_token,
    access_exp: Math.floor(Date.now() / 1000) + tokenSet.expires_in,
    refresh_token: tokenSet.refresh_token,
  };
  return payload;
};

/**
 * Generates a session token payload for an admin.
 * @returns The session token payload
 */
export const sessionTokenPayloadFromAdmin = (): SessionTokenPayload => ({
  admin: true,
});

/**
 * Signs a session token.
 * @param payload The session token payload
 * @returns The signed session token
 */
export const signSessionToken = (payload: SessionTokenPayload): string => {
  return jwt.sign(payload, SESSION_SECRET, {
    expiresIn: "90d", // This is the refresh token's expiry
  });
};

/**
 * Verifies and extracts the payload from a session token
 * @param sessionToken The session token to verify
 * @returns The payload of the session token
 * @throws {jwt.JsonWebTokenError} if the session token is invalid
 */
export const verifySessionToken = (
  sessionToken: string
): SessionTokenPayload => {
  return jwt.verify(sessionToken, SESSION_SECRET) as SessionTokenPayload;
};
