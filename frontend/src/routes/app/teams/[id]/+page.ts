import type { PageLoad } from "./$types";

export const load = (() => {
  // dummy data
  return {
    name: "SBHS 1sts",
    id: 1,
    wins: 1,
    losses: 1,
    setRatio: 0.5,
    kr: 0.5,
    pef: 0.5
  };
}) satisfies PageLoad;
