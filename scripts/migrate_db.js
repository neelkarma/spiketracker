import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

dotenv.config();

const { Client } = pg;

const client = new Client({
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
});

const db = drizzle(client);
await migrate(db, { migrationsFolder: "drizzle" });

await client.end();
