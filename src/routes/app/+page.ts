import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, parent }) => {
  const auth = await parent();
  if (!auth.authorized) return;

  if (auth.admin) {
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
    const currentlyScoring = matches.some((match: any) => match.scoring);

    return {
      ...overallStats,
      currentlyScoring,
    };
  } else {
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
