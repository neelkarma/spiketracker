import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Creates a match. */
export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const data = await request.json();

  try {
    await db.execute({
      sql: `
        INSERT INTO matches (teamId, oppName, time, location, points, visible, scoring)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        data.ourTeamId,
        data.oppTeamName,
        data.time,
        data.location,
        JSON.stringify(data.points),
        data.visible,
        data.scoring,
      ],
    });

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};
