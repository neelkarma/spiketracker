-- Pragmas
PRAGMA foreign_keys = ON;

-- Tables
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  firstName TEXT NOT NULL,
  surname TEXT NOT NULL,
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
  fromX INTEGER CHECK (
    fromX >= 0
    AND fromX <= 22
  ) NOT NULL,
  fromY INTEGER CHECK (
    fromY >= 0
    AND fromY <= 22
  ) NOT NULL,
  toX INTEGER CHECK (
    toX >= 0
    AND toX <= 22
  ) NOT NULL,
  toY INTEGER CHECK (
    toY >= 0
    AND toY <= 22
  ) NOT NULL
);

CREATE TABLE IF NOT EXISTS teamPlayers (
  teamId INTEGER NOT NULL REFERENCES teams (id),
  playerId INTEGER NOT NULL REFERENCES players (id),
  PRIMARY KEY (teamId, playerId)
);

-- Data
INSERT
  OR IGNORE INTO players (id, firstName, surname, gradYear)
VALUES (440805299, 'Neel', 'Sharma', 2024),
  (447507684, 'Arnav', 'Gupta', 2024),
  (442097500, 'Andrew', 'Wang', 2024),
  (442031151, 'Nathanael', 'Thie', 2024);

INSERT
  OR IGNORE INTO teams (name, year)
VALUES ('SBHS 1sts', 2024),
  ('SBHS 2nds', 2024);

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
    '2024-07-04T00:59:40.405Z',
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
    fromX,
    fromY,
    toX,
    toY
  )
VALUES (440805299, 1, 'set', 3, 3, 1, 1, 3);
