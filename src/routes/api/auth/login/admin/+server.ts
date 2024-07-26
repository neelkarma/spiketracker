import { ADMIN_PASSWORD } from "$env/static/private";
import { signSessionToken } from "$lib/server/session";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { password } = await request.json();

  if (!password) {
    error(400, "No password provided.");
  }

  if (password != ADMIN_PASSWORD) {
    error(401, "Invalid password");
  }

  const sessionToken = await signSessionToken({ admin: true, id: undefined });
  cookies.set("Authorization", `Bearer ${sessionToken}`, {
    path: "/",
    maxAge: 90 * 24 * 60 * 60, // 90 days
    httpOnly: true,
  });

  return new Response("Success");
};
