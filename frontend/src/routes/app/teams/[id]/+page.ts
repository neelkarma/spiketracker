import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    teamName: "SBHS 1sts",
    teamId: 1,
    players: []
  };
}) satisfies PageLoad;
