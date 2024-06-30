export interface MatchInfo {
  id: number;
  ourTeamId: number;
  ourTeamName: string;
  oppTeamName: string;
  location: string;
  time: string;
  points: { our: number; opp: number }[];
  visible: boolean;
  scoring: boolean;
}

export const SAMPLE_MATCH_INFO: MatchInfo = {
  id: 0,
  ourTeamId: 0,
  ourTeamName: "SBHS 1sts",
  oppTeamName: "Newington 2nds",
  location: "SBHS Gymnasium",
  time: new Date(2024, 3, 18, 9, 0).toISOString(),
  points: [
    { our: 25, opp: 20 },
    { our: 26, opp: 14 },
    { our: 28, opp: 23 },
  ],
  visible: true,
  scoring: false,
};

export const EMPTY_MATCH_INFO: MatchInfo = {
  id: 0,
  ourTeamId: 0,
  ourTeamName: "",
  oppTeamName: "",
  location: "",
  time: new Date().toISOString(),
  points: [],
  visible: true,
  scoring: false,
};

export interface PlayerInfo {
  id: number;
  firstName: string;
  surname: string;
  gradYear: number;
  teams: {
    name: string;
    id: number;
  }[];
  matchIds: number[];
  ppg: number;
  kr: number;
  pef: number;
  totalPoints: number;
  visible: boolean;
}

export const SAMPLE_PLAYER_INFO: PlayerInfo = {
  id: 440805299,
  firstName: "Guppy",
  surname: "Gup",
  gradYear: 2024,
  teams: [
    { name: "SBHS 1sts", id: 0 },
    { name: "SBHS 2nds", id: 1 },
  ],
  matchIds: [0, 1, 2],
  ppg: 12,
  kr: 0.5,
  pef: 0.5,
  totalPoints: 100,
  visible: true,
};

export const EMPTY_PLAYER_INFO: PlayerInfo = {
  id: 0,
  firstName: "",
  surname: "",
  gradYear: new Date().getFullYear(),
  teams: [],
  matchIds: [],
  ppg: 0,
  kr: 0,
  pef: 0,
  totalPoints: 0,
  visible: true,
};

export interface TeamInfo {
  id: number;
  name: string;
  wins: number;
  losses: number;
  setRatio: number;
  kr: number;
  pef: number;
  playerIds: number[];
  visible: boolean;
}

export const SAMPLE_TEAM_INFO: TeamInfo = {
  id: 0,
  name: "SBHS 1sts",
  wins: 1,
  losses: 1,
  setRatio: 0.5,
  kr: 0.5,
  pef: 0.5,
  playerIds: [0],
  visible: true,
};

export const EMPTY_TEAM_INFO: TeamInfo = {
  id: 0,
  name: "",
  wins: 0,
  losses: 0,
  setRatio: 0,
  kr: 0,
  pef: 0,
  playerIds: [],
  visible: true,
};

export interface Stat {
  playerId: number;
  action: string;
  rating: number;
  from: [number, number];
  to: [number, number]
}
