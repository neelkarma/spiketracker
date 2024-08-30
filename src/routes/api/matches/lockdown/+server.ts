import { db } from "$lib/server/db";
import type { RequestHandler } from "./$types";

/** Lockdown endpoint. Simply sets scoring to false for all matches. */
export const GET: RequestHandler = () => {
  db.execute("UPDATE matches SET scoring = 0");
  return new Response("Success");
};
