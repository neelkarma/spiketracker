import { createClient } from "@libsql/client";
import { existsSync, readFileSync, rmSync } from "fs";

const SCHEMA_PATH = "schema.sql";
const DB_PATH = "data.sqlite3";

if (process.argv.includes("--reset")) {
  if (existsSync(DB_PATH)) {
    console.log("deleting existing db...");
    rmSync(DB_PATH);
  } else {
    console.log("warning: existing db not found - reset skipped");
  }
}

const db = createClient({ url: `file:${DB_PATH}` });

const schema = readFileSync(SCHEMA_PATH, "utf-8");
await db.executeMultiple(schema);
db.close();

console.log("database schema successfully initialised");
