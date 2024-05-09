import { error } from "@sveltejs/kit";
import { marked } from "marked";
import type { PageServerLoad } from "./$types";

export const prerender = true;

export const load = (async ({ params }) => {
  try {
    const { default: markdown } = await import(`../${params.slug}.md?raw`);
    const html = await marked(markdown);
    return {
      html,
    };
  } catch (e) {
    error(404, `Could not find ${params.slug}`);
  }
}) satisfies PageServerLoad;
