import { error } from "@sveltejs/kit";
import { marked } from "marked";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = async () => {
  const allPages = import.meta.glob("../*.md", { query: "?raw" });

  return Object.keys(allPages).map((path) => ({
    // strip the `../` and the `.md` from the path string using raw indexing
    // since import.meta.glob preserves those
    slug: path.substring(3, path.length - 3),
  }));
};

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
