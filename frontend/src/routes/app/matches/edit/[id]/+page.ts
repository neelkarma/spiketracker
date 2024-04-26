import { browser } from "$app/environment";
import type { MatchInfo } from "$lib/types";
import { wait } from "$lib/utils";
import type { PageLoad } from "./$types";

export const load = (async ({ params }): Promise<MatchInfo> => {
  const id = parseInt(params.id);

  // Simulate network latency
  if (browser) await wait(1000);

  return {
    id,
    ourTeamId: 1,
    ourTeamName: "SBHS 1sts",
    oppTeamName: "Newington 2nds",
    date: new Date(2024, 3, 17, 9, 0),
    location: "SBHS Gymnasium",
    pointsOverridden: false,
    points: [
      { our: 25, opp: 20 },
      { our: 26, opp: 14 },
      { our: 28, opp: 23 },
    ],
    visible: false,
    scoring: false,
  };
}) satisfies PageLoad;
