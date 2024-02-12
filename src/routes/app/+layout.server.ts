import { db } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

const getPlayerStmt = db.prepare<any>(
  "SELECT first_name FROM players WHERE id = ?"
);

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user!;
  // get user's name
  if (user.admin)
    return {
      admin: true,
      name: "Coach",
    };
  else {
    const player = getPlayerStmt.get(user.id);
    return {
      admin: false,
      id: user.id,
      name: player?.first_name,
    };
  }
};
