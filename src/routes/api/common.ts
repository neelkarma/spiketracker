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

  // we have to check if total > 0 to protect against a division-by-zero error
  const rate = total > 0 ? successful / total : 0;

  return { total, successful, rate };
}

/**
 * Compares two strings or two numbers. Mainly for use in JavaScript's Array.prototype.sort() function.
 * @param a - First item to compare.
 * @param b - Second item to compare.
 * @param reverse - Whether to reverse the final output. Defaults to false.
 * @returns A positive number if a > b, negative if b < a or 0 if a == b or the inputs are invalid
 */
export function compare<T extends string | number>(
  a: T,
  b: T,
  reverse = false,
): number {
  if (reverse) {
    [a, b] = [b, a];
  }
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  } else if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return 0;
}
