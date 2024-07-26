import { type PlayerInfo } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ params, fetch }): Promise<PlayerInfo> => {
  const res = await fetch(`/api/player/${params.id}`);

  if (res.status === 404) {
    error(404, "Not found");
  } else if (!res.ok) {
    console.log(await res.text());
    error(500, "Something went wrong.");
  }

  const data = await res.json();

  return data;
}) satisfies PageLoad;
