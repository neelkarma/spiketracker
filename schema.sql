CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grad_year INTEGER NOT NULL,
  score INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams.id,
  approved BOOLEAN NOT NULL DEFAULT 0,
  time TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL REFERENCES players.id,
  match_id INTEGER NOT NULL REFERENCES matches.id,
  action TEXT CHECK (action in ('attack', 'block', 'serve', 'serve_receive', 'freeball_recieve', 'set')) NOT NULL,
  rating INTEGER CHECK (rating IN (1, 2, 3)) NOT NULL
  position TEXT CHECK (position in ('outside', 'opposite', 'middle', 'setter', 'libero')) NOT NULL,
  x_pos_in INTEGER CHECK (x_pos_in >= 0 AND x_pos_in <= 18) NOT NULL,
  y_pos_in INTEGER CHECK (y_pos_in >= 0 AND y_pos_in <= 18) NOT NULL,
  x_pos_out INTEGER CHECK (x_pos_out >= 0 AND x_pos_out <= 18) NOT NULL,
  y_pos_out INTEGER CHECK (y_pos_out >= 0 AND y_pos_out <= 18) NOT NULL,
);

CREATE TABLE IF NOT EXISTS team_players (
  team_id INTEGER NOT NULL REFERENCES teams.id,
  player_id INTEGER NOT NULL REFERENCES players.id,
  PRIMARY KEY (team_id, player_id)
);