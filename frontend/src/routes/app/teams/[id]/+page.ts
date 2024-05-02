import { SAMPLE_TEAM_INFO } from "$lib/types";
import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    ...SAMPLE_TEAM_INFO,
    players: [
      {
        playernum: 0,
        firstName: "Guppy",
        surname: "Gup",
        position: "Setter",
      },
    ],
  };
}) satisfies PageLoad;
