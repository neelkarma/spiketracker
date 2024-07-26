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
      SELECT * FROM players
      INNER JOIN teamPlayers ON teamPlayers.playerId = players.id
      INNER JOIN matches ON matches.teamId = teamPlayers.teamId
      WHERE matches.id = ?
    `,
    args: [id],
  });

  const ratingSql = `
    SELECT rating, count(*) AS count FROM stats
    WHERE
        matchId = ?
        AND playerId = ?
        AND action = ?
    GROUP BY rating
  `;

  const processedPlayers = await Promise.all(
    res.rows.map(async (player) => {
      const { successful: points, rate: kr } = await calculateStatRate({
        sql: ratingSql,
        args: [id, player.id, "atk"],
      });
      const { rate: pef } = await calculateStatRate({
        sql: ratingSql,
        args: [id, player.id, "set"],
      });
      return { player, kr, pef, points };
    }),
  );

  return json(processedPlayers);
};
