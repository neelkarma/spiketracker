import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Auth status endpoint - provides:
 * - whether the user is authorized
 * - whether the user is an admin
 * - the student id (if the user is a student)
 */
export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.auth) {
    return json({ authorized: false });
  } else {
    return json({
      authorized: true,
      ...locals.auth,
    });
  }
};
