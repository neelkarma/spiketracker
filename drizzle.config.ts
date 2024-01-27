import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: "localhost",
    database: process.env.PG_DATABASE!,
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
  },
});
