import { SAMPLE_TEAM_INFO } from "$lib/types";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  return SAMPLE_TEAM_INFO;
}) satisfies PageLoad;
