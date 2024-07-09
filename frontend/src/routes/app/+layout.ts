import type { LayoutLoad } from "./$types";

type AuthRepsonse =
  | {
      authorized: false;
    }
  | {
      authorized: true;
      admin: true;
    }
  | { authorized: true; admin: false; id: number };

export const load = (({ fetch }): Promise<AuthRepsonse> =>
  fetch("/api/auth/status").then((res) => res.json())) satisfies LayoutLoad;
