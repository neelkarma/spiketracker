import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { calculateStatRate } from "../../../common";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: `
      SELECT
          matches.id,
          matches.teamId as ourTeamId,
          teams.name as ourTeamName,
          matches.oppName as oppTeamName,
          matches.location,
          matches.time,
          matches.points,
          matches.visible,
          matches.scoring
      FROM matches
      INNER JOIN teams ON teams.id = matches.teamId
      INNER JOIN teamPlayers ON teamPlayers.teamId = matches.teamId
      WHERE teamPlayers.playerId = ?;
    `,
    args: [id],
  });
  const matches = res.rows;

  const ratingSql = `
    SELECT rating, count(*) AS count
    FROM stats
    WHERE
        playerId = ?
        AND matchId = ?
        AND action = ?
    GROUP BY rating
  `;

  const processedMatches = await Promise.all(
    matches.map(async (match) => {
      const { successful: points, rate: kr } = await calculateStatRate({
        sql: ratingSql,
        args: [match.id, id, "atk"],
      });
      const { rate: pef } = await calculateStatRate({
        sql: ratingSql,
        args: [match.id, id, "set"],
      });

      return { match, kr, pef, points };
    }),
  );

  return json(processedMatches);
};
