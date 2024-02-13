// See https://kit.svelte.dev/docs/types#app

import type { SessionTokenPayload } from "$lib/server/session";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: SessionTokenPayload | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
