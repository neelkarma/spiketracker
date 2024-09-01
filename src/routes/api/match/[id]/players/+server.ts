import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { calculateStatRate } from "../../../common";
import type { RequestHandler } from "./$types";

/** Responds with the stats for the players on a specific match */
export const GET: RequestHandler = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: `
      SELECT * FROM players
      INNER JOIN teamPlayers ON teamPlayers.playerId = players.id
      INNER JOIN matches ON matches.teamId = teamPlayers.teamId
      WHERE matches.id = ?
    `,
    args: [id],
  });

  const processedPlayers = await Promise.all(
    res.rows.map(async (player) => {
      const { successful: points, rate: kr } = await calculateStatRate({
        sql: `
          SELECT rating, count(*) AS count FROM stats
          WHERE
            matchId = ?
            AND playerId = ?
            AND action IN ('atk', 'blk', 'srv')
          GROUP BY rating
        `,
        args: [id, player.id],
      });
      const { rate: pef } = await calculateStatRate({
        sql: `
          SELECT rating, count(*) AS count FROM stats
          WHERE
            matchId = ?
            AND playerId = ?
            AND action IN ('set', 'frc', 'src')
          GROUP BY rating
        `,
        args: [id, player.id],
      });
      return { player, kr, pef, points };
    }),
  );

  return json(processedPlayers);
};
