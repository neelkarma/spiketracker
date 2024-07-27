import { db } from "$lib/server/db";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { processPlayerRow } from "./common";

export const GET: RequestHandler = async ({ params, locals }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const res = await db.execute({
    sql: "SELECT * FROM players WHERE id = ?",
    args: [id],
  });

  if (res.rows.length === 0) {
    error(404, "Not found");
  }

  const playerData = res.rows[0];

  if (
    playerData.visible !== 1 &&
    playerData.id !== locals.auth?.id &&
    !locals.auth?.admin
  ) {
    error(403, "Forbidden");
  }

  const processedPlayer = await processPlayerRow(playerData);
  return json(processedPlayer);
};

export const PUT: RequestHandler = async ({ params, locals, request }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  const body = await request.json();

  try {
    await db.execute({
      sql: `
        UPDATE players
        SET firstName = ?, surname = ?, gradYear = ?, visible = ?
        WHERE id = ?
      `,
      args: [body.firstName, body.surname, body.gradYear, body.visible, id],
    });
    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const id = parseInt(params.id);
  if (isNaN(id)) {
    error(400, "id must be an integer");
  }

  await db.batch(
    [
      {
        sql: "DELETE FROM teamPlayers WHERE playerId = ?",
        args: [id],
      },
      {
        sql: "DELETE FROM players WHERE id = ?",
        args: [id],
      },
    ],
    "write",
  );

  return new Response("Success");
};