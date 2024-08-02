import { db } from "$lib/server/db";
import { calculateStatRate } from "../../common";

export async function processTeamRow(row: any) {
  const id = row.id;

  // get team player ids
  const playerIdsRes = await db.execute({
    sql: "SELECT playerId FROM teamPlayers WHERE teamId = ?",
    args: [id],
  });
  const playerIds = playerIdsRes.rows.map((row) => row.playerId);

  // calculate team w/l and set ratio
  const matchPointsRes = await db.execute({
    sql: "SELECT points FROM matches WHERE teamId = ?",
    args: [id],
  });

  let wins = 0;
  let losses = 0;
  let setWins = 0;
  let setLosses = 0;

  for (const row of matchPointsRes.rows) {
    const points = JSON.parse(row.points as string);

    let matchSetWins = 0;
    let matchSetLosses = 0;

    for (const { our, opp } of points) {
      if (our > opp && our >= 15) {
        matchSetWins++;
      } else if (our < opp && opp >= 15) {
        matchSetLosses++;
      }
    }

    if (matchSetWins > matchSetLosses) {
      wins++;
    } else if (matchSetWins < matchSetLosses) {
      losses++;
    }

    setWins += matchSetWins;
    setLosses += matchSetLosses;
  }

  const setRatio = setLosses > 0 ? setWins / setLosses : 0;

  // calculate kr and pef
  const ratingSql = `
    SELECT stats.rating, count(*) AS count
    FROM stats
    INNER JOIN matches ON matches.id = stats.matchId
    WHERE stats.action = ? AND matches.teamId = ?
    GROUP BY stats.rating;
  `;

  const { rate: kr } = await calculateStatRate({
    sql: ratingSql,
    args: ["atk", id],
  });
  const { rate: pef } = await calculateStatRate({
    sql: ratingSql,
    args: ["set", id],
  });

  return {
    id,
    name: row.name,
    wins,
    losses,
    setRatio,
    kr,
    pef,
    playerIds,
    year: row.year,
    visible: !!row.visible,
  };
}
