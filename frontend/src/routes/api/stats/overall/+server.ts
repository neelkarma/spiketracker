import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { calculateStatRate } from "../../common";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const matchCountRes = await db.execute(
    "SELECT count(*) AS count FROM matches",
  );
  const numMatches = matchCountRes.rows[0].count;

  const teamCountRes = await db.execute("SELECT count(*) AS count FROM teams");
  const numTeams = teamCountRes.rows[0].count;

  const playerCountRes = await db.execute(
    "SELECT count(*) AS count FROM players",
  );
  const numPlayers = playerCountRes.rows[0].count;

  const ratingSql = `
    SELECT rating, count(*) AS count
    FROM stats
    WHERE
      action = ?
  `;

  const { successful: points, rate: kr } = await calculateStatRate({
    sql: ratingSql,
    args: ["atk"],
  });
  const { rate: pef } = await calculateStatRate({
    sql: ratingSql,
    args: ["set"],
  });

  return json({
    players: numPlayers,
    teams: numTeams,
    matches: numMatches,
    kr,
    pef,
    points,
  });
};
