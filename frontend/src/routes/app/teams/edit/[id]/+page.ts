import { browser } from "$app/environment";
import {
  SAMPLE_PLAYER_INFO,
  SAMPLE_TEAM_INFO,
  type PlayerInfo,
  type TeamInfo,
} from "$lib/types";
import { wait } from "$lib/utils";
import type { PageLoad } from "./$types";

export const load = (async ({
  params,
}): Promise<{ data: TeamInfo; players: PlayerInfo[] }> => {
  const id = parseInt(params.id);

  // Simulate network latency
  if (browser) await wait(1000);

  return {
    data: {
      ...SAMPLE_TEAM_INFO,
      id,
    },
    players: [SAMPLE_PLAYER_INFO],
  };
}) satisfies PageLoad;
