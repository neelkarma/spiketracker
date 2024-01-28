import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { API_BASE, WEBSITE_URL } from "$lib/server/consts";
import { fetch } from "undici";

export const USER_INFO_URL = API_BASE + "/details/userinfo.json";
const REDIRECT_URI = WEBSITE_URL + "/auth/callback";

export interface TokenEndpointResponse {
  token_type: "Bearer";
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export const getAuthorizationUrl = (state: string) => {
  return (
    API_BASE +
    "/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "all-ro",
      state,
    }).toString()
  );
};

export const refreshTokenSet = async (
  refreshToken: string
): Promise<TokenEndpointResponse> => {
  const res = await fetch(API_BASE + "/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: refreshToken,
    }),
  });
  if (!res.ok)
    throw new Error(
      "Failed to refresh access token. API Response: " + (await res.text())
    );
  return (await res.json()) as TokenEndpointResponse;
};

export const getStudentId = async (accessToken: string) => {
  const res = await fetch(USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok)
    throw new Error(
      "Failed to get user info. API Response: " + (await res.text())
    );

  const { studentId } = (await res.json()) as any;

  return parseInt(studentId);
};
