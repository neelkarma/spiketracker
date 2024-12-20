import { SessionTokenPayload } from "$lib/server/session";
// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      auth: SessionTokenPayload | null;
    }
    type PageData =
      | {
          authorized: true;
          admin: true;
        }
      | {
          authorized: true;
          admin: false;
          id: number;
        }
      | {
          authorized: false;
        };
    // interface Platform {}
  }
}

export type {};
