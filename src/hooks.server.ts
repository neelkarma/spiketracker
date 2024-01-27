import { building } from "$app/environment";
import { db } from "$lib/server/db";
import { players } from "$lib/server/db/schema";
import { verifySessionToken } from "$lib/server/session";
import { isRedirect, redirect, type Handle } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { Agent } from "undici";

if (!building) {
  // @ts-expect-error - this increases the keep-alive timeout for undici
  globalThis[Symbol.for("undici.globalDispatcher.1")] = new Agent({
    keepAliveTimeout: 10e3,
  });
}

export const handle = (async ({ event, resolve }) => {
  // Allow all auth activity
  if (event.url.pathname.startsWith("/auth")) return resolve(event);

  const sessionToken = event.cookies.get("Authorization");
  if (!sessionToken) {
    event.locals.user = null;
    if (event.url.pathname.startsWith("/app")) redirect(302, "/");
    return resolve(event);
  }

  try {
    event.locals.user = verifySessionToken(sessionToken);
  } catch (e) {
    event.cookies.delete("Authorization", { path: "/" });
    if (event.url.pathname.startsWith("/app"))
      redirect(302, "/?error=session_expired");
  }

  if (!event.locals.user) throw new Error("unreachable");

  // Allow access if admin
  if (event.locals.user.admin) return resolve(event);

  try {
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

  return resolve(event);
}) satisfies Handle;
