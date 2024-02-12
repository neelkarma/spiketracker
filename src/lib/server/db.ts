import { DB_PATH } from "$env/static/private";
import Database from "better-sqlite3";
import { readFileSync } from "fs";

export const db = new Database(DB_PATH);

const initSql = readFileSync("schema.sql", "utf8");
// db.exec(initSql);
