import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/** Endpoint to search and sort through all matches. */
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
      SELECT
          matches.id,
          matches.teamId as ourTeamId,
          teams.name as ourTeamName,
          matches.oppName as oppTeamName,
          matches.location,
          matches.time,
          matches.points,
          matches.visible,
          matches.scoring
      FROM matches
      INNER JOIN teams ON teams.id = matches.teamId
      WHERE
          teams.name LIKE ?
          OR matches.oppName LIKE ?
          OR matches.location LIKE ?
          OR matches.id = ?
          OR teams.id = ?
    `,
    args: [
      queryPattern,
      queryPattern,
      queryPattern,
      queryAsInteger,
      queryAsInteger,
    ],
  });

  // levels of access
  const matches = locals.auth?.admin
    ? res.rows
    : res.rows.filter((row) => row.visible);

  const processedMatches = matches.map((row) => ({
    ...row,
    points: JSON.parse(row.points as string),
    visible: !!row.visible,
    scoring: !!row.scoring,
  }));

  processedMatches.sort((a: any, b: any) => {
    if (reverse) {
      [a, b] = [b, a];
    }
    if (sortBy === "time") {
      return Date.parse(a.time) - Date.parse(b.time);
    }
    return a[sortBy] - b[sortBy];
  });

  return json(processedMatches);
};
