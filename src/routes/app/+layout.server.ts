import { db } from "$lib/server/db";
import type { LayoutServerLoad } from "./$types";

const getPlayerStmt = db.prepare("SELECT first_name FROM players WHERE id = ?");

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user!;
  // get user's name
  if (user.admin)
    return {
      admin: true,
      name: "Coach",
    };
  else {
    const player = <any>getPlayerStmt.get(user.id);
    console.log(player);
    return {
      admin: false,
      id: user.id,
      name: player?.first_name,
    };
  }
};
