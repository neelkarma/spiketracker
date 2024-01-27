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

  const refreshToken = url.searchParams.get("code");
  if (!refreshToken) error(403, "No auth code returned from auth server");

  const tokenSet = await refreshTokenSet(refreshToken);

  const payload = await sessionTokenPayloadFromOAuth(tokenSet);
  const sessionToken = signSessionToken(payload);
  cookies.set("Authorization", sessionToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  redirect(302, "/app");
}) satisfies RequestHandler;
