import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { calculateStatRate } from "../../../common";
import type { RequestHandler } from "./$types";

/** Gets the details of the players on a given team */
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
      const { successful: points, rate: kr } = await calculateStatRate({
        sql: `
          SELECT rating, count(*) AS count FROM stats
          INNER JOIN matches ON matches.id = stats.matchId
          WHERE
            matches.teamId = ?
            AND stats.playerId = ?
            AND stats.action IN ('atk', 'blk', 'srv')
          GROUP BY rating
        `,
        args: [id, player.id],
      });
      const { rate: pef } = await calculateStatRate({
        sql: `
          SELECT rating, count(*) AS count FROM stats
          INNER JOIN matches ON matches.id = stats.matchId
          WHERE
            matches.teamId = ?
            AND stats.playerId = ?
            AND stats.action IN ('set', 'frc', 'src')
          GROUP BY rating
        `,
        args: [id, player.id],
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
