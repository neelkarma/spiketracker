import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Gets details on a specific match. */
export const GET: RequestHandler = async ({ params, locals }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: `
      SELECT
          matches.id,
          matches.teamId,
          teams.name AS ourTeamName,
          matches.oppName AS oppTeamName,
          matches.location,
          matches.time,
          matches.points,
          matches.visible,
          matches.scoring
      FROM matches
      INNER JOIN teams ON teams.id = matches.teamId
      WHERE matches.id = ?
    `,
    args: [id],
  });

  if (res.rows.length === 0) {
    error(404, "Not found");
  }

  const matchData = res.rows[0];

  if (matchData.visible !== 1 && !locals.auth!.admin) {
    error(403, "Forbidden");
  }

  return json({
    ...matchData,
    points: JSON.parse(matchData.points!.toString()),
    visible: !!matchData.visible,
    scoring: !!matchData.scoring,
  });
};

/** Edits a match. */
export const PUT: RequestHandler = async ({ params, locals, request }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const data = await request.json();

  try {
    await db.execute({
      sql: `
        UPDATE matches
        SET teamId = ?, oppName = ?, time = ?, location = ?, points = ?, visible = ?, scoring = ?
        WHERE id = ?
      `,
      args: [
        data.ourTeamId,
        data.oppTeamName,
        data.time,
        data.location,
        JSON.stringify(data.points),
        data.visible,
        data.scoring,
        id,
      ],
    });

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};

/** Deletes a match. */
export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.auth?.admin) error(400, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  await db.batch([
    {
      sql: "DELETE FROM stats WHERE matchId = ?",
      args: [id],
    },
    {
      sql: "DELETE FROM matches WHERE id = ?",
      args: [id],
    },
  ]);

  return new Response("Success");
};
