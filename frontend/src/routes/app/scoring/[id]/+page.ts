import { SAMPLE_MATCH_INFO, SAMPLE_PLAYER_INFO, SAMPLE_TEAM_INFO } from "$lib/types";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  return {
    match: SAMPLE_MATCH_INFO,
    players: [
      {
        id: 1,
        name: "Guppy"
      },
      {
        id: 2,
        name: "Guppy 2"
      },
      {
        id: 3,
        name: "Guppy 3"
      },
      {
        id: 4,
        name: "Guppy 4"
      },
      {
        id: 5,
        name: "Guppy 5"
      },
      {
        id: 6,
        name: "Guppy 6"
      },
      {
        id: 7,
        name: "Guppy 7"
      },
      {
        id: 8,
        name: "Guppy 8"
      },
      {
        id: 9,
        name: "Guppy 9"
      },
      {
        id: 10,
        name: "Guppy 10"
      },
    ]
  };
}) satisfies PageLoad;
