import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Creates a new player. */
export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.auth?.admin) error(403, "Forbidden");

  const body = await request.json();

  try {
    await db.batch([
      {
        sql: `
        INSERT INTO players (id, firstName, surname, gradYear, visible)
        VALUES (?, ?, ?, ?, ?)
      `,
        args: [
          body.id,
          body.firstName,
          body.surname,
          body.gradYear,
          body.visible,
        ],
      },
      ...body.teams.map((team: any) => ({
        sql: `
        INSERT INTO teamPlayers (playerId, teamId)
        VALUES (?, ?)
      `,
        args: [body.id, team.id],
      })),
    ]);

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    error(400, "Client error");
  }
};
