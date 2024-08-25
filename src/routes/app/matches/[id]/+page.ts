import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  // we fetch the given match and players for that match
  const [matchRes, playerRes] = await Promise.all([
    fetch(`/api/match/${params.id}`),
    fetch(`/api/match/${params.id}/players`),
  ]);

  if (matchRes.status === 404) {
    error(404, "Not Found");
  }
  if (!matchRes.ok || !playerRes.ok) {
    console.log(await matchRes.text());
    error(500, "Something went wrong");
  }

  const [match, players] = await Promise.all([
    matchRes.json(),
    playerRes.json(),
  ]);

  return {
    match,
    players,
  };
}) satisfies PageLoad;
