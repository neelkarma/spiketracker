import { type PlayerInfo, type TeamInfo } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({
  fetch,
  params,
}): Promise<{ team: TeamInfo; players: PlayerInfo[] }> => {
  // we fetch the team and its players from the api to populate the initial form values
  const [teamDataRes, playersRes] = await Promise.all([
    fetch(`/api/team/${params.id}`),
    fetch(`/api/team/${params.id}/players`),
  ]);

  if (teamDataRes.status === 404) {
    error(404, "Not Found");
  }

  if (!teamDataRes.ok || !playersRes.ok) {
    error(500, "Something went wrong");
  }

  const [teamData, players] = await Promise.all([
    teamDataRes.json(),
    playersRes.json(),
  ]);

  return {
    team: teamData,
    players,
  };
}) satisfies PageLoad;
