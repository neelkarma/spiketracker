import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import type { PlayerInfo } from "$lib/types";

export const load = (async ({ fetch, params }): Promise<PlayerInfo> => {
  const res = await fetch(`/api/player/${params.id}`)

  if (res.status === 404) {
    error(404, "Not Found");
  } else if (res.status !== 200) {
    console.log(await res.text())
    error(500, "Something went wrong")
  }

  const data = await res.json()

  return data
}) satisfies PageLoad;
