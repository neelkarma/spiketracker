import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { processTeamRow } from "../team/[id]/common";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  const query = url.searchParams.get("q") ?? "";
  const sortBy = url.searchParams.get("sort") ?? "time";
  const reverse = url.searchParams.get("reverse") === "1";
  const playerId = url.searchParams.get("player_id") ?? "-1";

  const queryPattern = "%" + query + "%";
  const queryAsParsedInteger = parseInt(query);
  const queryAsInteger = isNaN(queryAsParsedInteger)
    ? -1
    : queryAsParsedInteger;
  const playerIdAsParsedInteger = parseInt(playerId);
  const playerIdAsInteger = isNaN(playerIdAsParsedInteger)
    ? -1
    : playerIdAsParsedInteger;

  const res = await db.execute({
    sql: `
      SELECT DISTINCT teams.*
      FROM teams
      INNER JOIN teamPlayers ON teamPlayers.teamId = teams.id
      WHERE
        teams.name LIKE ?
        OR teams.id = ?
        OR teamPlayers.playerId = ?
    `,
    args: [queryPattern, queryAsInteger, playerIdAsInteger],
  });

  const teams = locals.auth?.admin
    ? res.rows
    : res.rows.filter((row) => row.visible);

  const processedTeams = await Promise.all(teams.map(processTeamRow));

  processedTeams.sort((a: any, b: any) => {
    if (reverse) {
      [a, b] = [b, a];
    }
    if (typeof a[sortBy] === "string") {
      return a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase());
    }
    return a[sortBy] - b[sortBy];
  });

  return json(processedTeams);
};
