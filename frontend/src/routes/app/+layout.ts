import type { LayoutLoad } from "./$types";

export const load = (({ fetch }) =>
  fetch("/api/auth/status").then((res) => res.json())
) satisfies LayoutLoad;
