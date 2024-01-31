import { building } from "$app/environment";
import { db } from "$lib/server/db";
import { players } from "$lib/server/db/schema";
import { verifySessionToken } from "$lib/server/session";
import { isRedirect, redirect, type Handle } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Agent } from "undici";

if (!building) {
  // @ts-expect-error - this increases the keep-alive timeout for undici, since the SBHS API can be pretty slow sometimes
  globalThis[Symbol.for("undici.globalDispatcher.1")] = new Agent({
    keepAliveTimeout: 10e3,
  });
}

// This hook is run on every request - we use this for auth purposes.
export const handle = (async ({ event, resolve }) => {
  // Allow all auth activity
  if (event.url.pathname.startsWith("/auth")) return resolve(event);

  // Retrieve the user's session token, if any
  const sessionToken = event.cookies.get("Authorization");

  if (!sessionToken) {
    // No session token - user is not logged in
    event.locals.user = null;
    if (event.url.pathname.startsWith("/app")) redirect(302, "/");
    return resolve(event);
  }

  try {
    event.locals.user = verifySessionToken(sessionToken);
  } catch (e) {
    // Session token is invalid - session has expired
    event.cookies.delete("Authorization", { path: "/" });
    if (event.url.pathname.startsWith("/app"))
      redirect(302, "/?error=session_expired");
    return resolve(event);
  }

  // Allow full access if admin
  if (event.locals.user.admin) return resolve(event);

  try {
    // check for a registered player with the given id
    const player = await db.query.players.findFirst({
      where: eq(players.id, event.locals.user.id),
    });

    if (!player) {
      // player not registered
      event.cookies.delete("Authorization", { path: "/" });
      redirect(302, "/?error=not_registered");
    }
  } catch (e) {
    if (!isRedirect(e)) {
      // handle any other errors
      console.error("Error verifying student:", e);
      redirect(302, "/?error=internal_error");
    }

    // Throw the redirect so sveltekit can handle it
    throw e;
  }

  // Finally, allow access if the user passes all above checks
  return resolve(event);
}) satisfies Handle;
