import { getAuthorizationUrl } from "$lib/server/sbhs.js";
import { redirect } from "@sveltejs/kit";
import { STATE_COOKIE } from "./consts.js";

export const actions = {
  // Login for students - redirects to SBHS OAuth
  sbhsLogin: async ({ cookies }) => {
    // this is done to prevent CSRF attacks
    const state = crypto.randomUUID();
    cookies.set(STATE_COOKIE, state, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60,
    });

    redirect(302, getAuthorizationUrl(state));
  },

  // logout (both students and coaches) - deletes the auth cookie
  logout: async ({ cookies }) => {
    cookies.delete("Authorization", { path: "/" });
    redirect(302, "/");
  },

  // coach login is located in the admin folder
};
