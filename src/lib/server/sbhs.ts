import { CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { API_BASE, WEBSITE_URL } from "$lib/server/consts";
import { fetch } from "undici";

/** The SBHS API Endpoint for a student's user info (which includes student id) */
export const USER_INFO_URL = API_BASE + "/details/userinfo.json";
/** Our web app's OAuth redirect url. */
const REDIRECT_URI = WEBSITE_URL + "/auth/callback";

/** SBHS API token endpoint response, which provides access and refresh tokens */
export interface TokenEndpointResponse {
  token_type: "Bearer";
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

/**
 * Gets the SBHS OAuth authorization url to redirect the user to.
 * @param state State parameter to prevent CSRF attacks.
 * @returns The SBHS OAuth authorization url to redirect the user to
 */
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

/**
 * Refreshes the access and refresh tokens using a refresh token.
 * @param refreshToken The refresh token to use to get a new token set
 * @returns The new token set
 */
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

/**
 * Fetches a student's id from the SBHS API using their access token.
 * @param accessToken The access token to use to get the student id
 * @returns The student's id
 */
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
