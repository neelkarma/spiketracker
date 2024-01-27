import { getPool } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user!;
  // get user's name
  if (user.admin)
    return {
      admin: true,
      name: "Coach",
    };
  else {
    const pool = await getPool();
    const res = await pool.query("SELECT name FROM Player where id = $1", [
      user.id,
    ]);
    return {
      admin: false,
      id: user.id,
      name: res.rows[0].name,
    };
  }
};
