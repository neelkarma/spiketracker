import { browser } from "$app/environment";
import { SAMPLE_PLAYER_INFO, type PlayerInfo } from "$lib/types";
import { wait } from "$lib/utils";
import type { PageLoad } from "./$types";

export const load = (async ({ params }): Promise<PlayerInfo> => {
  const id = parseInt(params.id);

  // Simulate network latency
  if (browser) await wait(1000);

  return SAMPLE_PLAYER_INFO;
}) satisfies PageLoad;
