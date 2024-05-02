import { SAMPLE_MATCH_INFO, type MatchInfo } from "$lib/types";
import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    ...SAMPLE_MATCH_INFO,
  } as Required<MatchInfo>;
}) satisfies PageLoad;
