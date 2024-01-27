CREATE TABLE IF NOT EXISTS Team (
  id INT PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS Player (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,

  team_id INT FOREIGN KEY REFERENCES Team(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS Match (
  id INT PRIMARY KEY AUTOINCREMENT,

  team_id INT FOREIGN KEY REFERENCES Team(id) NOT NULL
  opp_team VARCHAR(255) NOT NULL

  our_score INT NOT NULL
  opp_score INT NOT NULL
);

CREATE TABLE IF NOT EXISTS PlayerMatchStats (
  player_id INT UNIQUE FOREIGN KEY REFERENCES Player(id) NOT NULL,
  match_id INT UNIQUE FOREIGN KEY REFERENCES Match(id) NOT NULL,

  points_rb INT NOT NULL,
  points_rf INT NOT NULL,
  points_mf INT NOT NULL,
  points_lf INT NOT NULL,
  points_lb INT NOT NULL,
  points_lm INT NOT NULL,
);