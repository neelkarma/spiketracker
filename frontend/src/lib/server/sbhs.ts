import { BASE_URL, CLIENT_ID, CLIENT_SECRET } from "$env/static/private";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const REDIRECT_URI = BASE_URL + "/api/auth/login/sbhs/cb";

const jwks = createRemoteJWKSet(
  new URL("https://auth.sbhs.net.au/discovery/keys"),
);

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

export async function verifyIdToken(
  idToken: string,
): Promise<JWTPayload & any> {
  const { payload } = await jwtVerify(idToken, jwks);
  return payload;
}
