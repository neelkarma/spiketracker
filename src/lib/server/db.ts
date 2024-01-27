import { PG_DATABASE, PG_PASSWORD, PG_USER } from "$env/static/private";
import pg from "pg";

// This is to avoid a build error that has something to do with pg being a cjs module
const { Pool } = pg;

let pool: pg.Pool;

export const getPool = async () => {
  if (pool) return pool;

  pool = new Pool({
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
  });

  // init all the db tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Team (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Player (
      id INT PRIMARY KEY NOT NULL,
      name VARCHAR(255) NOT NULL,

      team_id INT REFERENCES Team(id) NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Match (
      id SERIAL PRIMARY KEY,

      team_id INT REFERENCES Team(id) NOT NULL,
      opp_team VARCHAR(255) NOT NULL,

      our_score INT NOT NULL,
      opp_score INT NOT NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS PlayerMatchStats (
      player_id INT UNIQUE REFERENCES Player(id) NOT NULL,
      match_id INT UNIQUE REFERENCES Match(id) NOT NULL,

      points_rb INT NOT NULL,
      points_rf INT NOT NULL,
      points_mf INT NOT NULL,
      points_lf INT NOT NULL,
      points_lb INT NOT NULL,
      points_lm INT NOT NULL
    )
  `);
  return pool;
};
