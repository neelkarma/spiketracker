import type { RequestHandler } from "./$types";

/** Logout endpoint for both players and admins. */
export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete("Authorization", { path: "/" });
  return new Response("Success");
};
