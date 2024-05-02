import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const { fetch } = event;

  if (event.url.pathname.startsWith("/api")) return resolve(event);

  const data = await fetch("/api/auth/status").then((res) => res.json());

  if (data.authorized && !event.url.pathname.startsWith("/app"))
    throw redirect(302, "/app");
  if (!data.authorized && event.url.pathname.startsWith("/app"))
    throw redirect(302, "/");
  if (
    !data.admin &&
    event.url.pathname.split("/").some((seg) => ["new", "edit"].includes(seg))
  )
    throw redirect(302, "/app");

  return resolve(event);
};
