import { ADMIN_PASSWORD } from "$env/static/private";
import {
  sessionTokenPayloadFromAdmin,
  signSessionToken,
} from "$lib/server/session.js";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  // Login for admin/coach/volleyball prefect - uses password for authentication
  adminLogin: async ({ cookies, request }) => {
    const formData = await request.formData();
    const password = formData.get("password");

    if (!password) return fail(400, { reason: "No password provided" });
    if (password !== ADMIN_PASSWORD)
      return fail(401, { reason: "Incorrect password" });

    const payload = sessionTokenPayloadFromAdmin();
    const sessionToken = signSessionToken(payload);
    cookies.set("Authorization", sessionToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });

    redirect(302, "/");
  },
};
