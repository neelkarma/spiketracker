import type { MatchInfo } from "$lib/types";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }): Promise<MatchInfo> => {
  // we load the details of the match by calling the API here
  const res = await fetch(`/api/match/${params.id}`);

  if (res.status === 404) {
    error(404, "Not Found");
  } else if (!res.ok) {
    console.log(await res.text());
    error(500, "Something went wrong.");
  }

  const data = await res.json();
  return data;
}) satisfies PageLoad;
