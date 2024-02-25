import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    date: new Date(),
    location: "SBHS Gymnasium",
    ourTeamName: "SBHS 1sts",
    ourTeamId: 1,
    oppTeamName: "Newington 2nds",
    sets: [
      {
        ourScore: 25,
        oppScore: 14,
      },
      {
        ourScore: 25,
        oppScore: 20,
      },
      {
        ourScore: 25,
        oppScore: 23,
      },
    ],
  };
}) satisfies PageLoad;
