import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  // we fetch the match data from the api
  const matchRes = await fetch(`/api/match/${params.id}`);

  if (matchRes.status === 404) {
    error(404, "Not Found");
  } else if (!matchRes.ok) {
    console.log(await matchRes.text());
    error(500, "Something went wrong");
  }

  const match = await matchRes.json();

  const playersRes = await fetch(`/api/team/${match.teamId}/players`);

  if (!playersRes.ok) {
    console.log(await playersRes.text());
    error(500, "Something went wrong");
  }

  const players = await playersRes.json();

  return {
    match,
    players,
  };
}) satisfies PageLoad;
