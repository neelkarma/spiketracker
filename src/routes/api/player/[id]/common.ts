import { db } from "$lib/server/db";
import { calculateStatRate } from "../../common";

/**
 * Gets associated team, match and statistics for a player row and attaches them to the provided row
 * @param row - the desired player's database row
 */
export async function processPlayerRow(row: any) {
  const id = row.id;

  // get player teams
  const teamsRes = await db.execute({
    sql: `
      SELECT teams.id, teams.name
      FROM teams
      INNER JOIN teamPlayers ON teams.id = teamPlayers.teamId
      WHERE teamPlayers.playerId = ?;
    `,
    args: [id],
  });
  const teams = teamsRes.rows;

  // get player match ids
  const matchIdsRes = await db.execute({
    sql: `
      SELECT matches.id
      FROM matches
      INNER JOIN teamPlayers ON matches.teamId = teamPlayers.teamId
      WHERE teamPlayers.playerId = ?;
    `,
    args: [id],
  });
  const matchIds = matchIdsRes.rows.map((row) => row.id);

  // get stat rates
  const { successful: totalPoints, rate: kr } = await calculateStatRate({
    sql: `
      SELECT rating, count(*) AS count
      FROM stats
      WHERE
        action IN ('atk', 'blk', 'srv')
        AND playerId = ?
      GROUP BY rating;
    `,
    args: [id],
  });
  const { rate: pef } = await calculateStatRate({
    sql: `
      SELECT rating, count(*) AS count
      FROM stats
      WHERE
        action IN ('set', 'frc', 'src')
        AND playerId = ?
      GROUP BY rating;
    `,
    args: [id],
  });

  // calculate ppg
  const ppg = matchIds.length > 0 ? totalPoints / matchIds.length : 0;

  return {
    ...row,
    teams,
    ppg,
    kr,
    pef,
    matchIds,
    totalPoints,
    visible: !!row.visible,
  };
}
