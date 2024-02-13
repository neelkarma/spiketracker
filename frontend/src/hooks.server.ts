import { building } from "$app/environment";
import { redirect, type Handle } from "@sveltejs/kit";
import { Agent } from "undici";

if (!building) {
  //@ts-expect-error
  globalThis[Symbol.for("undici.globalDispatcher.1")] = new Agent({
    headersTimeout: 10 * 60e3,
    bodyTimeout: 10 * 60e3,
    keepAliveTimeout: 10 * 60e3,
  });
}

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith("/api")) return resolve(event);

  const res = await event.fetch("/api/auth/status");
  const data = await res.json();

  if (data.authorized && !event.url.pathname.startsWith("/app"))
    throw redirect(302, "/app");
  if (!data.authorized && event.url.pathname.startsWith("/app"))
    throw redirect(302, "/");

  return resolve(event);
};
