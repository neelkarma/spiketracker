import { db } from "$lib/server/db";
import { players } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
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
    const player = await db.query.players.findFirst({
      where: eq(players.id, user.id),
    });
    return {
      admin: false,
      id: user.id,
      name: player?.firstName,
    };
  }
};
