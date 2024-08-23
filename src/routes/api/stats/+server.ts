import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Get a list of stats matching the given criteria (match, team, and/or player). Mainly used in the stat heatmap */
export const GET: RequestHandler = async ({ url }) => {
  const matchIdStr = url.searchParams.get("match_id");
  const teamIdStr = url.searchParams.get("team_id");
  const playerIdStr = url.searchParams.get("player_id");

  if (!matchIdStr && !teamIdStr && !playerIdStr) {
    error(400, "No params given");
  }

  let matchId;
  if (matchIdStr) {
    matchId = parseInt(matchIdStr);
    if (isNaN(matchId)) {
      error(400, "match_id must be an integer");
    }
  }

  let teamId;
  if (teamIdStr) {
    teamId = parseInt(teamIdStr);
    if (isNaN(teamId)) {
      error(400, "team_id must be an integer");
    }
  }

  let playerId;
  if (playerIdStr) {
    playerId = parseInt(playerIdStr);
    if (isNaN(playerId)) {
      error(400, "player_id must be an integer");
    }
  }

  const res = await db.execute({
    sql: `
      SELECT * FROM stats
      INNER JOIN matches ON stats.matchId = matches.id
      INNER JOIN players ON stats.playerId = players.id
      WHERE (? = 1 OR stats.matchId = ?)
        AND (? = 1 OR matches.teamId = ?)
        AND (? = 1 OR stats.playerId = ?)
    `,
    args: [
      matchId ? 0 : 1,
      matchId ?? 0,
      teamId ? 0 : 1,
      teamId ?? 0,
      playerId ? 0 : 1,
      playerId ?? 0,
    ],
  });

  const processedStats = res.rows.map((row) => ({
    playerId: row.playerId,
    matchId: row.matchId,
    action: row.action,
    rating: row.rating,
    from: [row.fromX, row.fromY],
    to: [row.toX, row.toY],
  }));

  return json(processedStats);
};
