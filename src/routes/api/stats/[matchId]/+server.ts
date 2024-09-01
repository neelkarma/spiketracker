import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Endpoint for submitting stats for a given match. */
export const PUT: RequestHandler = async ({ params, locals, request }) => {
  const matchId = parseInt(params.matchId);
  if (isNaN(matchId)) {
    error(400, "match_id must be an integer");
  }

  if (!locals.auth?.admin) {
    const res = await db.execute({
      sql: "SELECT scoring FROM matches WHERE id = ?",
      args: [matchId],
    });

    if (res.rows.length === 0) {
      error(404, "Not found");
    }

    const matchData = res.rows[0];
    if (!matchData.scoring) {
      error(403, "Forbidden");
    }
  }

  const data = await request.json();

  try {
    db.batch([
      {
        sql: "DELETE FROM stats WHERE matchId = ?",
        args: [matchId],
      },
      ...data.map((stat: any) => ({
        sql: `
        INSERT INTO stats (playerId, matchId, action, rating, fromX, fromY, toX, toY)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        args: [
          stat.playerId,
          matchId,
          stat.action,
          stat.rating,
          stat.from[0],
          stat.from[1],
          stat.to[0],
          stat.to[1],
        ],
      })),
    ]);

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};
