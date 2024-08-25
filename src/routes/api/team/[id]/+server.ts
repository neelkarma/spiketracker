import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { processTeamRow } from "./common";

/** Gets the details of a team */
export const GET: RequestHandler = async ({ params, locals }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: "SELECT * FROM teams WHERE id = ?",
    args: [id],
  });

  if (res.rows.length === 0) {
    error(404, "Not found");
  }

  const teamData = res.rows[0];

  if (teamData.visible !== 1 && !locals.auth?.admin) {
    error(403, "Forbidden");
  }

  const processedTeam = await processTeamRow(teamData);
  return json(processedTeam);
};

/** Edits a team. */
export const PUT: RequestHandler = async ({ params, locals, request }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const body = await request.json();

  try {
    await db.batch(
      [
        {
          sql: `
            UPDATE teams
            SET name = ?, year = ?, visible = ?
            WHERE id = ?
          `,
          args: [body.name, body.year, body.visible, id],
        },
        {
          sql: "DELETE FROM teamPlayers WHERE teamId = ?",
          args: [id],
        },
        ...body.playerIds.map((playerId: number) => ({
          sql: `
            INSERT INTO teamPlayers (teamId, playerId)
            VALUES (?, ?)
          `,
          args: [id, playerId],
        })),
      ],
      "write",
    );

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};

/** Deletes a team. */
export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  await db.batch(
    [
      {
        sql: "DELETE FROM teamPlayers WHERE teamId = ?",
        args: [id],
      },
      {
        sql: "DELETE FROM teams WHERE id = ?",
        args: [id],
      },
    ],
    "write",
  );

  return new Response("Success");
};
