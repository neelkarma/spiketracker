import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import { compare } from "../common";
import { processPlayerRow } from "../player/[id]/common";
import type { RequestHandler } from "./$types";

/** Search and sort for players. */
export const GET: RequestHandler = async ({ url, locals }) => {
  const query = url.searchParams.get("q") ?? "";
  const sortBy = url.searchParams.get("sort") ?? "time";
  const reverse = url.searchParams.get("reverse") === "1";

  const queryPattern = "%" + query + "%";
  const queryAsParsedInteger = parseInt(query);
  const queryAsInteger = isNaN(queryAsParsedInteger)
    ? -1
    : queryAsParsedInteger;

  const res = await db.execute({
    sql: `
      SELECT *
      FROM players
      WHERE
        firstName || ' ' || surname LIKE ?
        OR id = ?
    `,
    args: [queryPattern, queryAsInteger],
  });

  const players = locals.auth?.admin
    ? res.rows
    : res.rows.filter((row) => row.visible);

  const processedPlayers = await Promise.all(players.map(processPlayerRow));

  processedPlayers.sort((a: any, b: any) =>
    compare(a[sortBy], b[sortBy], reverse),
  );

  return json(processedPlayers);
};
