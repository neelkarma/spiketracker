import { refreshTokenSet } from "$lib/server/sbhs";
import {
  sessionTokenPayloadFromOAuth,
  signSessionToken,
} from "$lib/server/session";
import { error, redirect } from "@sveltejs/kit";
import { STATE_COOKIE } from "../consts";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url, cookies }) => {
  // verify the state cookie - this protects against xss attacks
  const state = url.searchParams.get("state");
  if (state !== cookies.get(STATE_COOKIE)) error(403);
  cookies.delete(STATE_COOKIE, { path: "/" });

  // retrieve refresh token from url search params
  const refreshToken = url.searchParams.get("code");
  if (!refreshToken) error(403, "No auth code returned from auth server");

  // Get new token set (includes access token) using refresh token
  const tokenSet = await refreshTokenSet(refreshToken);

  // Generate and set the session token
  const payload = await sessionTokenPayloadFromOAuth(tokenSet);
  const sessionToken = signSessionToken(payload);
  cookies.set("Authorization", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 90, // 90 days - this is the refresh token's expiry
  });

  redirect(302, "/app");
}) satisfies RequestHandler;
