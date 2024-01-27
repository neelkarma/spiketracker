// See https://kit.svelte.dev/docs/types#app

import type { TokenSet } from "openid-client";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user:
        | {
            admin: true;
          }
        | {
            admin: false;
            id: number;
            oauth: TokenSet;
          }
        | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
