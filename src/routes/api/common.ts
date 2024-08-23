import { db } from "$lib/server/db";
import type { InStatement } from "@libsql/client";

/**
 * Calculates a stat rate given an sql query that outputs columns for rating and count.
 * @param stmt - The sql query to execute.
 * @returns the number of total and successful stats, and the rate (successful / total).
 */
export async function calculateStatRate(stmt: InStatement) {
  const res = await db.execute(stmt);

  let total = 0;
  let successful = 0;

  for (const row of res.rows) {
    total += row.count as number;
    if (row.rating === 3) {
      successful += row.count as number;
    }
  }

  const rate = total > 0 ? successful / total : 0;

  return { total, successful, rate };
}
