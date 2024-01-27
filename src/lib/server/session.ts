import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import { getStudentInfo, type TokenEndpointResponse } from "./sbhs";

export type SessionTokenPayload =
  | {
      admin: true;
    }
  | {
      admin: false;
      id: number;
      access_token: string;
      access_exp: number;
      refresh_token: string;
    };

export const sessionTokenPayloadFromOAuth = async (
  tokenSet: TokenEndpointResponse
): Promise<SessionTokenPayload> => {
  const { id } = await getStudentInfo(tokenSet.access_token);

  const payload: SessionTokenPayload = {
    admin: false,
    id,
    access_token: tokenSet.access_token,
    access_exp: Math.floor(Date.now() / 1000) + tokenSet.expires_in,
    refresh_token: tokenSet.refresh_token,
  };
  return payload;
};

export const sessionTokenPayloadFromAdmin = (): SessionTokenPayload => ({
  admin: true,
});

export const signSessionToken = (payload: SessionTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "90d" });
};

export const verifySessionToken = (
  sessionToken: string
): SessionTokenPayload => {
  return jwt.verify(sessionToken, JWT_SECRET) as SessionTokenPayload;
};
