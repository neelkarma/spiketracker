import { getPool } from "$lib/server/db";
import { getJWT } from "$lib/server/session";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const payload = getJWT(event.cookies);

  if (payload) {
    const user = {
      admin: payload.admin,
      id: payload.id,
      oauth: payload.oauth,
    };
    event.locals.user = user;

    if (!user.admin) {
      const pool = await getPool();
      const res = await pool.query("SELECT name FROM Player WHERE id = $1", [
        user.id,
      ]);
      if (res.rowCount === 0 && event.url.pathname.startsWith("/app")) {
        event.cookies.delete("Authorization", { path: "/" });
        redirect(302, "/?error=not_registered");
      }
    }
  } else event.locals.user = null;

  if (event.locals.user === null && event.url.pathname.startsWith("/app"))
    redirect(302, "/");

  return resolve(event);
}) satisfies Handle;
