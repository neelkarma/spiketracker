import { redirect } from "@sveltejs/kit";

export const GET = () => {
  throw redirect(301, "/app/help/quick-start");
};
