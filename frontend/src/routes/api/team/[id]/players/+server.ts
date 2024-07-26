import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { calculateStatRate } from "../../../common";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(403, "Forbidden");
  }

  const res = await db.execute({
    sql: `
      SELECT * FROM players
      INNER JOIN teamPlayers ON teamPlayers.playerId = players.id
      WHERE teamPlayers.teamId = ?
    `,
    args: [id],
  });

  const processedPlayers: any[] = await Promise.all(
    res.rows.map(async (player) => {
      const ratingSql = `
        SELECT rating, count(*) AS count FROM stats
        INNER JOIN matches ON matches.id = stats.matchId
        WHERE
          matches.teamId = ?
          AND stats.playerId = ?
          AND stats.action = ?
        GROUP BY rating
      `;

      const { successful: points, rate: kr } = await calculateStatRate({
        sql: ratingSql,
        args: [id, player.id, "atk"],
      });
      const { rate: pef } = await calculateStatRate({
        sql: ratingSql,
        args: [id, player.id, "set"],
      });

      const matchCountRes = await db.execute({
        sql: `
        SELECT count(*) AS count FROM matches
        WHERE matches.teamId = ?
      `,
        args: [id],
      });
      const totalMatches = matchCountRes.rows[0].count as number;

      const ppg = totalMatches > 0 ? points / totalMatches : 0;

      return { ...player, kr, pef, ppg, points };
    }),
  );

  processedPlayers.sort((a, b) => a.surname.localeCompare(b.surname));

  return json(processedPlayers);
};
