import { getAuthorizationUrl } from "$lib/server/sbhs";
import { redirect } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import type { PageServerLoad } from "./$types";
import { STATE_COOKIE } from "./common";

/** Login endpoint for players. Redirects to SBHS OAuth. */
export const load: PageServerLoad = async ({ cookies }) => {
  // we use nanoid to generate a cryptographically random state variable to protect against xss attacks
  // it's sent to both the sbhs api and the browser's cookies for later comparison
  const state = nanoid();
  cookies.set(STATE_COOKIE, state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60,
  });
  return redirect(302, getAuthorizationUrl(state));
};
