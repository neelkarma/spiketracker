import { ADMIN_PASSWORD } from "$env/static/private";
import { storeJWT } from "$lib/server/session";
import { fail, redirect } from "@sveltejs/kit";

export const actions = {
  // Login for admin/coach/volleyball prefect - uses password for authentication
  adminLogin: async ({ cookies, request }) => {
    const formData = await request.formData();
    const password = formData.get("password");

    if (!password) return fail(400, { reason: "No password provided" });
    if (password !== ADMIN_PASSWORD)
      return fail(401, { reason: "Incorrect password" });

    storeJWT(cookies);
    redirect(302, "/");
  },
};
