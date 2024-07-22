import { redirect } from "@sveltejs/kit";

export const GET = () => {
  redirect(301, "/app/help/quick-start");
};
