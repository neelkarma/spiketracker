-- Schema
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  grad_year INTEGER NOT NULL,
  
  avg_ppg REAL NOT NULL DEFAULT 0,
  kill_rate REAL NOT NULL DEFAULT 0,
  pass_efficiency REAL NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  total_atk_points INTEGER NOT NULL DEFAULT 0,
  total_def_points INTEGER NOT NULL DEFAULT 0,
  total_blk_points INTEGER NOT NULL DEFAULT 0,
  total_srv_points INTEGER NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT 0

  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  set_ratio REAL NOT NULL DEFAULT 0,
  kill_rate REAL NOT NULL DEFAULT 0,
  pass_efficiency REAL NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  opponent_name TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT 0,
  time TEXT NOT NULL,
  location TEXT NOT NULL,

  set_one_our_score INTEGER NOT NULL DEFAULT 0,
  set_one_opp_score INTEGER NOT NULL DEFAULT 0,
  set_two_our_score INTEGER NOT NULL DEFAULT 0,
  set_two_opp_score INTEGER NOT NULL DEFAULT 0,
  set_three_our_score INTEGER NOT NULL DEFAULT 0,
  set_three_opp_score INTEGER NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL REFERENCES players(id),
  match_id INTEGER NOT NULL REFERENCES matches(id),
  action TEXT CHECK (action in ('attack', 'block', 'serve', 'serve_receive', 'freeball_recieve', 'set')) NOT NULL,
  rating INTEGER CHECK (rating IN (1, 2, 3)) NOT NULL,
  position TEXT CHECK (position in ('outside', 'opposite', 'middle', 'setter', 'libero')) NOT NULL,
  x_pos_in INTEGER CHECK (x_pos_in >= 0 AND x_pos_in <= 18) NOT NULL,
  y_pos_in INTEGER CHECK (y_pos_in >= 0 AND y_pos_in <= 18) NOT NULL,
  x_pos_out INTEGER CHECK (x_pos_out >= 0 AND x_pos_out <= 18) NOT NULL,
  y_pos_out INTEGER CHECK (y_pos_out >= 0 AND y_pos_out <= 18) NOT NULL
);

CREATE TABLE IF NOT EXISTS team_players (
  team_id INTEGER NOT NULL REFERENCES teams(id),
  player_id INTEGER NOT NULL REFERENCES players(id),
  PRIMARY KEY (team_id, player_id)
);

-- Triggers
CREATE TRIGGER IF NOT EXISTS update_player_on_insert
AFTER INSERT ON stats
BEGIN
  UPDATE players SET
  avg_ppg =
    (SELECT COUNT(*) FROM stats WHERE player_id = NEW.player_id)
    / (SELECT COUNT(*) FROM matches WHERE
    team_id IN (SELECT team_id FROM player_teams WHERE player_id = NEW.player_id)),
  kill_rate = 0, -- ask arnav about how to calculate kr
  pass_efficiency = 0, -- ask arnav about how to calculate pef
  total_points = total_points + 1,
  total_atk_points = total_atk_points + (NEW.action = 'attack'),
  total_def_points = total_def_points + (NEW.action = 'block'),
  total_blk_points = total_blk_points + (NEW.action = 'block'),
  total_srv_points = total_srv_points + (NEW.action = 'serve')
  WHERE id = NEW.player_id;
END;

-- TODO: Create triggers for:
-- - update_player_on_update
-- - update_player_on_delete
-- - update_team_on_update
-- - update_team_on_delete
-- - update_team_on_insert

-- Data
INSERT INTO players (id, first_name, last_name, grad_year) VALUES
(440805299, 'Neel', 'Sharma', 2024),
(447507684, 'Arnav', 'Gupta', 2024),
(442097500, 'Andrew', 'Wang', 2024),
(442031151, 'Nathanael', 'Thie', 2024);

INSERT INTO teams (name, year) VALUES
('Test', 2024);

INSERT INTO team_players (team_id, player_id) VALUES
(1, 440805299),
(1, 447507684),
(1, 442097500),
(1, 442031151);