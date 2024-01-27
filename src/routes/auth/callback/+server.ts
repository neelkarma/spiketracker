import { API_BASE, WEBSITE_URL } from "$lib/server/consts";
import { client } from "$lib/server/sbhs";
import { storeJWT } from "$lib/server/session";
import { error, redirect } from "@sveltejs/kit";
import { STATE_COOKIE } from "../consts";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url, cookies }) => {
  // verify the state cookie - this protects against xss attacks
  const state = url.searchParams.get("state");
  if (state !== cookies.get(STATE_COOKIE)) error(403);

  const params = client.callbackParams(url.toString());
  const tokenSet = await client.oauthCallback(
    `${WEBSITE_URL}/auth/callback`,
    params,
    { response_type: "code", state: state ?? undefined }
  );
  const apiRes = await client.requestResource(
    `${API_BASE}/details/userinfo.json`,
    tokenSet
  );
  if (apiRes.statusCode !== 200) error(403);
  const { studentId } = JSON.parse(apiRes.body?.toString() ?? "{}");
  if (!studentId) error(403);
  const id = Number(studentId);

  storeJWT(cookies, { id, oauth: tokenSet });

  redirect(302, "/");
}) satisfies RequestHandler;
