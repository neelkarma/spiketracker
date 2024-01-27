import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: integer("id").primaryKey(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  gradYear: integer("grad_year").notNull(),
});

export const playersRelations = relations(players, ({ many }) => ({
  teams: many(playersToTeams),
  stats: many(stats),
}));

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  year: integer("year").notNull(),
  archived: boolean("archived").notNull().default(false),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  matches: many(matches),
  players: many(playersToTeams),
}));

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  approved: boolean("approved").notNull().default(false),
  time: timestamp("time").notNull(),
  location: varchar("location").notNull(),
});

export const matchesRelations = relations(matches, ({ one, many }) => ({
  team: one(teams, {
    fields: [matches.teamId],
    references: [teams.id],
  }),
  stats: many(stats),
}));

export const playerActionEnum = pgEnum("player_action_type", [
  "attack",
  "block",
  "serve",
  "serve_recieve",
  "freeball_recieve",
  "set",
]);

export const playerPositionEnum = pgEnum("player_position", [
  "outside",
  "opposite",
  "middle",
  "setter",
  "libero",
]);

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id")
    .notNull()
    .references(() => players.id),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id),
  action: playerActionEnum("action").notNull(),
  rating: integer("rating").notNull(),
  position: playerPositionEnum("position").notNull(),
  xPosIn: integer("x_pos_in").notNull(),
  yPosIn: integer("y_pos_in").notNull(),
  xPosOut: integer("x_pos_out").notNull(),
  yPosOut: integer("y_pos_out").notNull(),
});

export const statsRelations = relations(stats, ({ one }) => ({
  player: one(players, {
    fields: [stats.playerId],
    references: [players.id],
  }),
  match: one(matches, {
    fields: [stats.matchId],
    references: [matches.id],
  }),
}));

export const playersToTeams = pgTable(
  "players_to_teams",
  {
    playerId: integer("player_id").references(() => players.id),
    teamId: integer("team_id").references(() => teams.id),
  },
  (t) => ({ pk: primaryKey({ columns: [t.playerId, t.teamId] }) })
);

export const playersToTeamsRelations = relations(playersToTeams, ({ one }) => ({
  player: one(players, {
    fields: [playersToTeams.playerId],
    references: [players.id],
  }),
  team: one(teams, {
    fields: [playersToTeams.teamId],
    references: [teams.id],
  }),
}));
