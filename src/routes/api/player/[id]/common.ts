import { db } from "$lib/server/db";
import { calculateStatRate } from "../../common";

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
  const ratingSql = `
    SELECT rating, count(*) AS count
    FROM stats
    WHERE action = ? AND playerId = ?
    GROUP BY rating;
  `;
  const { successful: totalPoints, rate: kr } = await calculateStatRate({
    sql: ratingSql,
    args: ["atk", id],
  });
  const { rate: pef } = await calculateStatRate({
    sql: ratingSql,
    args: ["set", id],
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
