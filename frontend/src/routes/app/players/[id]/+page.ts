import { SAMPLE_PLAYER_INFO } from "$lib/types";
import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    ...SAMPLE_PLAYER_INFO,
  };
}) satisfies PageLoad;
