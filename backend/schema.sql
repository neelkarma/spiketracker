-- Pragmas
PRAGMA foreign_keys = ON;

-- Tables
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grad_year INTEGER NOT NULL,
  positions TEXT NOT NULL DEFAULT "[]",
  -- string[]
  visible BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams (id),
  opponent_name TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  points TEXT DEFAULT "[]" NOT NULL -- { our: number; opp: number; }[]
  visible BOOLEAN NOT NULL DEFAULT 0,
  scoring BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL REFERENCES players (id),
  match_id INTEGER NOT NULL REFERENCES matches (id),
  action TEXT CHECK (
    action in (
      'attack',
      'block',
      'serve',
      'serve_receive',
      'freeball_recieve',
      'set'
    )
  ) NOT NULL,
  rating INTEGER CHECK (rating IN (0, 1, 2, 3)) NOT NULL,
  position TEXT CHECK (
    position in (
      'outside',
      'opposite',
      'middle',
      'setter',
      'libero'
    )
  ) NOT NULL,
  x_pos_in INTEGER CHECK (
    x_pos_in >= 0
    AND x_pos_in <= 22
  ) NOT NULL,
  y_pos_in INTEGER CHECK (
    y_pos_in >= 0
    AND y_pos_in <= 22
  ) NOT NULL,
  x_pos_out INTEGER CHECK (
    x_pos_out >= 0
    AND x_pos_out <= 22
  ) NOT NULL,
  y_pos_out INTEGER CHECK (
    y_pos_out >= 0
    AND y_pos_out <= 22
  ) NOT NULL
);

CREATE TABLE IF NOT EXISTS team_players (
  team_id INTEGER NOT NULL REFERENCES teams (id),
  player_id INTEGER NOT NULL REFERENCES players (id),
  PRIMARY KEY (team_id, player_id)
);

-- Views
CREATE VIEW IF NOT EXISTS points AS
SELECT *
FROM stats
WHERE action IN ('attack', 'block', 'serve')
  AND rating = 3;

CREATE VIEW IF NOT EXISTS attacks AS
SELECT *
FROM stats
WHERE action IN ('attack');

CREATE VIEW IF NOT EXISTS successful_attacks AS
SELECT *
FROM attacks
WHERE rating = 3;

CREATE VIEW IF NOT EXISTS serves AS
SELECT *
FROM stats
WHERE action IN ('serve');

CREATE VIEW IF NOT EXISTS successful_serves AS
SELECT *
FROM serves
WHERE rating = 3;

CREATE VIEW IF NOT EXISTS blocks AS
SELECT *
FROM stats
WHERE action IN ('block');

CREATE VIEW IF NOT EXISTS successful_blocks AS
SELECT *
FROM blocks
WHERE rating = 3;

CREATE VIEW IF NOT EXISTS set_passes AS
SELECT *
FROM stats
WHERE action IN ('set');

CREATE VIEW IF NOT EXISTS serve_recieves AS
SELECT *
FROM stats
WHERE action in ('serve_receive');

CREATE VIEW IF NOT EXISTS freeball_recieves AS
SELECT *
FROM stats
WHERE action in ('freeball_receive');

CREATE VIEW IF NOT EXISTS error_stats AS
SELECT id
FROM stats
WHERE rating = 0;

CREATE VIEW IF NOT EXISTS games_played AS
SELECT player_id,
  COUNT(DISTINCT match_id) AS number_games
FROM stats
GROUP BY player_id;

CREATE VIEW IF NOT EXISTS player_stats AS
SELECT id,
  (
    SELECT COUNT(*)
    FROM successful_attacks
    WHERE successful_attacks.player_id = players.id
  ) / (
    SELECT COUNT(*)
    FROM attacks
    WHERE attacks.player_id = players.id
  ) AS kill_rate,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM attacks
    WHERE attacks.player_id = players.id
  ) AS attack_eff,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM blocks
    WHERE blocks.player_id = players.id
  ) AS blocking_avg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM serves
    WHERE serves.player_id = players.id
  ) AS serving_avg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM set_passes
    WHERE set_passes.player_id = players.id
  ) AS setting_avg,
  (
    SELECT COUNT(*)
    FROM successful_serves
    WHERE successful_serves.player_id = players.id
  ) / (
    SELECT COUNT(*)
    FROM serves
    WHERE serves.player_id = players.id
  ) AS ace_rate,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM serve_receives
    WHERE serve_receives.player_id = players.id
  ) AS serve_rec_avg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM freeball_receives
    WHERE freeball_receives.player_id = players.id
  ) AS freeball_rec_avg,
  (
    (
      SELECT -1 * COUNT(*)
      FROM error_stats
      WHERE error_stats.player_id = players.id
    ) + (
      SELECT COUNT(*)
      FROM points
      WHERE points.player_id = players.id
    )
  ) / (
    -- number of matches played by game
    SELECT number_games
    FROM games_played
    WHERE games_played.player_id = players.id
  ) AS box_plus_minus
FROM players;

CREATE VIEW IF NOT EXISTS match_stats AS
SELECT id -- total our sets
  -- total opp sets
  -- total our points for each set
FROM matches;

CREATE VIEW IF NOT EXISTS team_stats AS
SELECT id,
  (
    SELECT COUNT(*)
    FROM matches
    WHERE matches.team_id = teams.id
  ) AS total_matches,
  (
    SELECT COUNT(*)
    FROM matches
    WHERE matches.team_id = teams.id
      AND matches.approved = 1
  ) AS total_approved_matches,
  (
    SELECT COUNT(*) -- needs to be altered
    FROM matches
    WHERE matches.team_id = teams.id
      AND matches.approved = 1
  ) AS wing_hitting_avg -- wins INTEGER NOT NULL DEFAULT 0,
  -- losses INTEGER NOT NULL DEFAULT 0,
  -- set_ratio REAL NOT NULL DEFAULT 0,
  -- kill_rate REAL NOT NULL DEFAULT 0,
  -- pass_efficiency REAL NOT NULL DEFAULT 0,
FROM teams;

-- Data
INSERT
  OR IGNORE INTO players (id, first_name, last_name, grad_year)
VALUES (440805299, 'Neel', 'Sharma', 2024),
  (447507684, 'Arnav', 'Gupta', 2024),
  (442097500, 'Andrew', 'Wang', 2024),
  (442031151, 'Nathanael', 'Thie', 2024);

INSERT
  OR IGNORE INTO teams (name, year)
VALUES ('Test', 2024);

INSERT
  OR IGNORE INTO team_players (team_id, player_id)
VALUES (1, 440805299),
  (1, 447507684),
  (1, 442097500),
  (1, 442031151);