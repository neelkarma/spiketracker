import { building } from "$app/environment";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { fetch } = event;

  if (event.url.pathname.startsWith("/api")) return resolve(event);

  const res = await fetch("/api/auth/status");
  const data = await res.json();

  if (data.authorized && !event.url.pathname.startsWith("/app"))
    throw redirect(302, "/app");
  if (!data.authorized && event.url.pathname.startsWith("/app"))
    throw redirect(302, "/");

  return resolve(event);
};
