import type { RequestHandler } from "@sveltejs/kit";

const API_BASE = import.meta.env.PROD
  ? "https://api.spiketracker.app"
  : "http://localhost:5000";

export const GET = (async ({ params, url, fetch }) => {
  return fetch(API_BASE + "/" + params.path + url.search);
}) satisfies RequestHandler;

export const POST = (async ({ params, url, fetch, request }) => {
  return fetch(API_BASE + "/" + params.path + url.search, request);
}) satisfies RequestHandler;
