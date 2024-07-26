import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { MatchInfo, PlayerInfo } from "$lib/types";

export const load = (async ({
  fetch,
  params,
}): Promise<{
  player: PlayerInfo;
  matches: {
    match: MatchInfo;
    kr: number;
    pef: number;
    points: number;
  }[];
}> => {
  const [playerDataRes, matchInfoRes] = await Promise.all([
    fetch(`/api/player/${params.id}`),
    fetch(`/api/player/${params.id}/matches`),
  ]);

  if (playerDataRes.status === 404) {
    error(404, "Not Found");
  }
  if (!playerDataRes.ok || !matchInfoRes.ok) {
    console.log(await playerDataRes.text());
    error(500, "Something went wrong");
  }

  const [playerData, matchInfo] = await Promise.all([
    playerDataRes.json(),
    matchInfoRes.json(),
  ]);

  return {
    player: playerData,
    matches: matchInfo,
  };
}) satisfies PageLoad;
