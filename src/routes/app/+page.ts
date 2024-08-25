import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, parent }) => {
  const auth = await parent();
  if (!auth.authorized) return;

  // we load different data depending on if it's an admin or a player that's logged in
  if (auth.admin) {
    // for admins, we fetch overall stats and matches (to check if a match is currently scorable)
    const [matchesRes, overallStatsRes] = await Promise.all([
      fetch("/api/matches"),
      fetch("/api/stats/overall"),
    ]);

    if (!overallStatsRes.ok || !matchesRes.ok) {
      console.log(await overallStatsRes.text());
      console.log(await matchesRes.text());
      error(500, "Something went wrong");
    }

    const overallStats = await overallStatsRes.json();
    const matches = await matchesRes.json();

    // if any match is scoring, we need to display that
    const currentlyScoring = matches.some((match: any) => match.scoring);

    return {
      ...overallStats,
      currentlyScoring,
    };
  } else {
    // for players, we get personalised player and team stats, as well as checking if there's a match currently scorable
    const [matchesRes, playerRes, teamsRes] = await Promise.all([
      fetch("/api/matches"),
      fetch(`/api/player/${auth.id}`),
      fetch(`/api/teams?player_id=${auth.id}`),
    ]);

    if (!playerRes.ok || !matchesRes.ok || !teamsRes.ok) {
      console.log(await playerRes.text());
      console.log(await matchesRes.text());
      console.log(await teamsRes.text());
      error(500, "Something went wrong");
    }

    const player = await playerRes.json();
    const matches = await matchesRes.json();
    const teams = await teamsRes.json();
    const currentlyScoring = matches.some((match: any) => match.scoring);

    return {
      ...player,
      currentlyScoring,
      teams,
    };
  }
}) satisfies PageLoad;
