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

// this allows all pages and components to use $page.data to check auth status and permissions
export const load = (({ fetch }): Promise<AuthRepsonse> =>
  fetch("/api/auth/status").then((res) => res.json())) satisfies LayoutLoad;
