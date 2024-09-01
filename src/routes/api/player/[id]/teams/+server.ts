import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import { processTeamRow } from "../../../team/[id]/common";
import type { RequestHandler } from "./$types";

/** this endpoint gets details on the teams for a specific player */
export const GET: RequestHandler = async ({ params, locals }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: `
      SELECT teams.*
      FROM teams
      INNER JOIN teamPlayers ON teams.id = teamPlayers.teamId
      WHERE
        teamPlayers.playerId = ?
    `,
    args: [id],
  });

  const teams = locals.auth?.admin
    ? res.rows
    : res.rows.filter((row) => row.visible);

  const processedTeams = await Promise.all(teams.map(processTeamRow));

  return json(processedTeams);
};
