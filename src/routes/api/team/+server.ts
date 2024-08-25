import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Creates a team. */
export const POST: RequestHandler = async ({ locals, request }) => {
  if (!locals.auth?.admin) {
    error(403, "Forbidden");
  }

  const body = await request.json();

  const txn = await db.transaction("write");
  try {
    const res = await txn.execute({
      sql: `
        INSERT INTO teams (name, year, visible)
        VALUES (?, ?, ?)
      `,
      args: [body.name, body.year, body.visible],
    });

    const teamId = res.lastInsertRowid!;

    await txn.batch(
      body.playerIds.map((playerId: number) => ({
        sql: `
          INSERT INTO teamPlayers (teamId, playerId)
          VALUES (?, ?)
        `,
        args: [teamId, playerId],
      })),
    );

    await txn.commit();

    return new Response("Success");
  } catch (e) {
    console.warn(e);
    await txn.rollback();
    error(400, "Client error");
  }
};
