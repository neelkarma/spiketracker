import { verifySessionToken } from "$lib/server/session";
import { error, redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { fetch, cookies, locals, url } = event;

  // verify auth token in cookie
  locals.auth = null;
  const authCookie = cookies.get("Authorization");
  if (authCookie) {
    const splitAuthCookie = authCookie.split(" ");
    if (splitAuthCookie.length === 2) {
      try {
        const token = await verifySessionToken(splitAuthCookie[1]);
        locals.auth = token;
      } catch (e) {
        // ignore
      }
    }
  }

  // global api auth check
  if (url.pathname.startsWith("/api")) {
    if (url.pathname.startsWith("/api/auth") || locals.auth)
      return resolve(event);
    error(401, "Unauthorized");
  }

  // auth check for all other routes
  if (locals.auth && !event.url.pathname.startsWith("/app"))
    redirect(302, "/app");
  if (!locals.auth && event.url.pathname.startsWith("/app")) redirect(302, "/");
  if (
    !locals.auth?.admin &&
    event.url.pathname.split("/").some((seg) => ["new", "edit"].includes(seg))
  )
    redirect(302, "/app");

  return resolve(event);
};
