-- Pragmas
PRAGMA foreign_keys = ON;

-- Tables
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  gradYear INTEGER NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teamId INTEGER NOT NULL REFERENCES teams (id),
  oppName TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  points TEXT DEFAULT "[]" NOT NULL,
  -- { our: number; opp: number; }[]
  visible BOOLEAN NOT NULL DEFAULT 0,
  scoring BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playerId INTEGER NOT NULL REFERENCES players (id),
  matchId INTEGER NOT NULL REFERENCES matches (id),
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
  xPosIn INTEGER CHECK (
    xPosIn >= 0
    AND xPosIn <= 22
  ) NOT NULL,
  yPosIn INTEGER CHECK (
    yPosIn >= 0
    AND yPosIn <= 22
  ) NOT NULL,
  xPosOut INTEGER CHECK (
    xPosOut >= 0
    AND xPosOut <= 22
  ) NOT NULL,
  yPosOut INTEGER CHECK (
    yPosOut >= 0
    AND yPosOut <= 22
  ) NOT NULL
);

CREATE TABLE IF NOT EXISTS teamPlayers (
  teamId INTEGER NOT NULL REFERENCES teams (id),
  playerId INTEGER NOT NULL REFERENCES players (id),
  PRIMARY KEY (teamId, playerId)
);

-- Views
CREATE VIEW IF NOT EXISTS points AS
SELECT *
FROM stats
WHERE action IN ('attack', 'block', 'serve')
  AND rating = 3
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS attacks AS
SELECT *
FROM stats
WHERE action IN ('attack')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS successfulAttacks AS
SELECT *
FROM attacks
WHERE rating = 3;

CREATE VIEW if NOT EXISTS wingAttacks AS
SELECT *
FROM attacks
WHERE position = 'outside'
  OR position = 'opposition';

CREATE VIEW if NOT EXISTS middleAttacks AS
SELECT *
FROM attacks
WHERE position = 'middle';

CREATE VIEW IF NOT EXISTS serves AS
SELECT *
FROM stats
WHERE action IN ('serve')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS successfulServes AS
SELECT *
FROM serves
WHERE rating = 3;

CREATE VIEW IF NOT EXISTS pos1ServeEff AS
SELECT *
FROM serves
WHERE x_pos_out < 6;

CREATE VIEW IF NOT EXISTS pos2ServeEff AS
SELECT *
FROM serves
WHERE x_pos_out > 6
  AND x_pos_out < 12;

CREATE VIEW IF NOT EXISTS pos3ServeEff AS
SELECT *
FROM serves
WHERE x_pos_out > 12;

CREATE VIEW IF NOT EXISTS blocks AS
SELECT *
FROM stats
WHERE action IN ('block')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS successfulBlocks AS
SELECT *
FROM blocks
WHERE rating = 3
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS setPasses AS
SELECT *
FROM stats
WHERE action IN ('set')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS serveRecieves AS
SELECT *
FROM stats
WHERE action in ('serve_receive')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS freeballRecieves AS
SELECT *
FROM stats
WHERE action in ('freeball_receive')
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS errorStats AS
SELECT id
FROM stats
WHERE rating = 0
  AND approved = TRUE;

CREATE VIEW IF NOT EXISTS gamesPlayed AS
SELECT player_id,
  COUNT(DISTINCT match_id) AS numberGames
FROM stats
GROUP BY playerId;

CREATE VIEW IF NOT EXISTS playerStats AS
SELECT id,
  (
    SELECT COUNT(*)
    FROM successfulAttacks
    WHERE successfulAttacks.playerId = players.id
  ) / (
    SELECT COUNT(*)
    FROM attacks
    WHERE attacks.playerId = players.id
  ) AS killRate,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM attacks
    WHERE attacks.playerId = players.id
  ) AS attackEff,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM blocks
    WHERE blocks.playerId = players.id
  ) AS blockingAvg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM serves
    WHERE serves.playerId = players.id
  ) AS servingAvg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM setPasses
    WHERE setPasses.playerId = players.id
  ) AS settingAvg,
  (
    SELECT COUNT(*)
    FROM successfulServes
    WHERE successfulServes.playerId = players.id
  ) / (
    SELECT COUNT(*)
    FROM serves
    WHERE serves.playerId = players.id
  ) AS aceRate,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM serveReceives
    WHERE serveReceives.playerId = players.id
  ) AS serveRecAvg,
  (
    SELECT SUM(rating) / COUNT(rating) / 3
    FROM freeballReceives
    WHERE freeballReceives.playerId = players.id
  ) AS freeballRecAvg,
  (
    (
      SELECT -1 * COUNT(*)
      FROM errorStats
      WHERE errorStats.playerId = players.id
    ) + (
      SELECT COUNT(*)
      FROM points
      WHERE points.playerId = players.id
    )
  ) / (
    -- number of matches played by game
    SELECT numberGames
    FROM gamesPlayed
    WHERE gamesPlayed.playerId = players.id
  ) AS boxPlusMinus
FROM players;

CREATE VIEW IF NOT EXISTS matchStats AS
SELECT id -- total our sets
  -- total opp sets
  -- total our points for each set
FROM matches;

CREATE VIEW IF NOT EXISTS teamStats AS -- how to check approved for everything
SELECT id,
  (
    SELECT COUNT(*)
    FROM matches
    WHERE matches.teamId = teams.id
  ) AS totalMatches,
  (
    SELECT COUNT(*)
    FROM matches
    WHERE matches.teamId = teams.id
      AND matches.approved = 1
  ) AS totalApprovedMatches,
  (
    SELECT SUM(rating) / COUNT(rating) -- needs to be altered
    FROM wingAttacks
    WHERE wingAttacks.teamId = teams.id
      AND matches.approved = 1
  ) AS wingHittingAvg,
  (
    SELECT SUM(rating) / COUNT(rating) -- needs to be altered
    FROM middleAttacks
    WHERE middleAttacks.teamId = teams.id
      AND matches.approved = 1
  ) AS middleHittingAvg -- losses INTEGER NOT NULL DEFAULT 0,
  -- set_ratio REAL NOT NULL DEFAULT 0,
  -- kill_rate REAL NOT NULL DEFAULT 0,
  -- pass_efficiency REAL NOT NULL DEFAULT 0,
FROM teams;

-- Data
INSERT
  OR IGNORE INTO players (id, firstName, lastName, gradYear)
VALUES (440805299, 'Neel', 'Sharma', 2024),
  (447507684, 'Arnav', 'Gupta', 2024),
  (442097500, 'Andrew', 'Wang', 2024),
  (442031151, 'Nathanael', 'Thie', 2024);

INSERT
  OR IGNORE INTO teams (name, year)
VALUES ('Test', 2024);

INSERT
  OR IGNORE INTO teamPlayers (teamId, playerId)
VALUES (1, 440805299),
  (1, 447507684),
  (1, 442097500),
  (1, 442031151);

INSERT
  OR IGNORE INTO matches (
    teamId,
    oppName,
    time,
    location,
    points,
    visible,
    scoring
  )
VALUES (
    1,
    'Newington 2nds',
    '0:00',
    'SBHS Gymnasium',
    '[]',
    true,
    false
  );

INSERT
  OR IGNORE INTO stats (
    playerId,
    matchId,
    action,
    rating,
    position,
    xPosIn,
    yPosIn,
    xPosOut,
    yPosOut
  )
VALUES (440805299, 1, 'set', 3, 'outside', 3, 1, 1, 3);