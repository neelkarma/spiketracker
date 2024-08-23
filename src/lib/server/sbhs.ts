import { BASE_URL, CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

/** The redirect_uri for use during SBHS OAuth */
const REDIRECT_URI = BASE_URL + "/api/auth/login/sbhs/cb";

/** This provides the pubkeys used to verify SBHS OIDC tokens. */
const jwks = createRemoteJWKSet(
  new URL("https://auth.sbhs.net.au/discovery/keys"),
);

/**
 * Generates the OAuth authorization url using a given state.
 * @param state - The state parameter in OAuth.
 * @returns The OAuth authorization url.
 */
export function getAuthorizationUrl(state: string): string {
  const searchParams = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "openid profile",
    state,
  }).toString();

  return "https://auth.sbhs.net.au/authorize?" + searchParams;
}

/**
 * Refreshes OAuth access and refresh tokens.
 * @param fetchFn - The fetch function to use when making the refresh request.
 * @param refreshToken - The refresh token.
 * @returns the API response, containing the new access and refresh tokens.
 * @throws when the token refresh response from the SBHS API is not a 200.
 */
export async function refreshTokenSet(
  fetchFn: typeof fetch,
  refreshToken: string,
) {
  const searchParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: refreshToken,
  }).toString();

  const res = await fetch("https://auth.sbhs.net.au/token", {
    method: "POST",
    body: searchParams,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    throw "Refreshing token failed. API response: " + (await res.text());
  }

  return await res.json();
}

/**
 * Verifies a SBHS OIDC token.
 * @param idToken - the SBHS OIDC token.
 * @returns The payload of the token if valid.
 * @throws if the token is invalid.
 */
export async function verifyIdToken(
  idToken: string,
): Promise<JWTPayload & any> {
  const { payload } = await jwtVerify(idToken, jwks);
  return payload;
}
