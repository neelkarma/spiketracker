import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    name: "Andrew Wang",
    teams: [
      {
        name: "SBHS 1sts",
        id: 1,
      },
      {
        name: "SBHS 2nds",
        id: 2,
      },
      {
        name: "SBHS 3rds",
        id: 3,
      }
    ],
    stats: {
      ppg: 12,
      kr: 50,
      pef: 50,
      totalPoints: 100,
    },
  };
}) satisfies PageLoad;
