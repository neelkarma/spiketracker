import { db } from "$lib/server/db";
import { refreshTokenSet, verifyIdToken } from "$lib/server/sbhs";
import { signSessionToken } from "$lib/server/session";
import { redirect } from "@sveltejs/kit";
import { STATE_COOKIE } from "../common";
import type { RequestHandler } from "./$types";

/** Callback endpoint for SBHS OAuth. Redirects back to app with a session token. */
export const GET: RequestHandler = async ({ cookies, url, fetch }) => {
  // verify the state param - this protects against xss attacks
  const state = url.searchParams.get("state");
  if (state != cookies.get(STATE_COOKIE)) {
    // invalid state param
    redirect(302, "/?error=state");
  }

  // retrieve refresh token from url search params
  const code = url.searchParams.get("code");
  if (!code) {
    // no code returned from sbhs api
    console.warn(
      "auth: no code returned from sbhs api. query args:",
      url.searchParams,
    );
    redirect(302, "/?error=sbhs");
  }

  // exchange code for id token
  const tokenSet = await refreshTokenSet(fetch, code);
  const { id_token: idToken } = tokenSet;
  const idTokenPayload = await verifyIdToken(idToken);

  // check that the student is registered
  const studentId = parseInt(idTokenPayload.student_id);
  const dbRes = await db.execute({
    sql: "SELECT id FROM players WHERE id = ?",
    args: [studentId],
  });
  if (dbRes.rows.length === 0) {
    // student not registered
    console.log("auth: student not registered");
    redirect(302, "/?error=forbidden");
  }

  // sign session token
  const sessionToken = await signSessionToken({
    admin: false,
    id: studentId,
  });

  // set the session token cookie and redirect user back to app
  cookies.set("Authorization", `Bearer ${sessionToken}`, {
    path: "/",
    maxAge: 90 * 24 * 60 * 60, // 90 days
    httpOnly: true,
  });
  redirect(302, "/");
};
