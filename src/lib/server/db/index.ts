import { PG_DATABASE, PG_PASSWORD, PG_USER } from "$env/static/private";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

// Because `pg` is a CJS module, you need to first import the whole library and then destructure to get children, instead of importing `Pool` normally
const { Pool } = pg;

const pool = new Pool({
  database: PG_DATABASE,
  user: PG_USER,
  password: PG_PASSWORD,
});

export const db = drizzle(pool, { schema });
