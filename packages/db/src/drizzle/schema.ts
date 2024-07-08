import {
	pgTable,
	pgEnum,
	uuid,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { index } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const stat = pgEnum("stat", [
	"GOING_ON",
	"COMPLETED",
	"ABANDON",
	"PLAYER_LEFT",
]);

export const Square = pgEnum("Square", [
	"a8",
	"b8",
	"c8",
	"d8",
	"e8",
	"f8",
	"g8",
	"h8",
	"a7",
	"b7",
	"c7",
	"d7",
	"e7",
	"f7",
	"g7",
	"h7",
	"a6",
	"b6",
	"c6",
	"d6",
	"e6",
	"f6",
	"g6",
	"h6",
	"a5",
	"b5",
	"c5",
	"d5",
	"e5",
	"f5",
	"g5",
	"h5",
	"a4",
	"b4",
	"c4",
	"d4",
	"e4",
	"f4",
	"g4",
	"h4",
	"a3",
	"b3",
	"c3",
	"d3",
	"e3",
	"f3",
	"g3",
	"h3",
	"a2",
	"b2",
	"c2",
	"d2",
	"e2",
	"f2",
	"g2",
	"h2",
	"a1",
	"b1",
	"c1",
	"d1",
	"e1",
	"f1",
	"g1",
	"h1",
]);

export const PieceSymbol = pgEnum("PieceSymbol", [
	"p",
	"n",
	"b",
	"r",
	"q",
	"k",
]);

const SquareSchema = z.enum(Square.enumValues);
export type SquareDb = z.infer<typeof SquareSchema>;

const PieceSchema = z.enum(PieceSymbol.enumValues);
export type PieceSymbolDb = z.infer<typeof PieceSchema>;

export const color = pgEnum("color", ["w", "b"]);
export const result = pgEnum("result", ["w", "b", "in_progress"]);

export const game = pgTable(
	"game",
	{
		id: uuid("id").primaryKey().notNull(),
		player1id: uuid("player1id")
			.notNull()
			.references(() => users.id),
		player2id: uuid("player2id")
			.notNull()
			.references(() => users.id),

		gameStatus: stat("gameStatus").notNull(),
		moves: uuid("moves")
			.references((): AnyPgColumn => move.id)
			.array(),
		startingFen: text("startingFen").default(
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
		),
		currentFen: text("currentFen").notNull(),
		startAt: timestamp("startAt", {
			withTimezone: true,
			mode: "string",
		}).defaultNow(),
		result: result("result").notNull().default("in_progress"),
	},
	(table) => {
		return {
			game_index_gameStatus: index("gameStatus").on(table.gameStatus),
			game_index_result: index("result").on(table.result),
		};
	},
);

export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		username: varchar("username", { length: 40 }).notNull(),
		email: varchar("email", { length: 100 }).notNull(),
		password: text("password").notNull(),
		name: varchar("name", { length: 50 }),
		gamesAsWhite: uuid("gamesAsWhite")
			.default(sql`ARRAY[]::uuid[]`)
			.array()
			.notNull(),
		gamesAsBlack: uuid("gamesAsBlack")
			.default(sql`ARRAY[]::uuid[]`)
			.array()
			.notNull(),
		createdAt: timestamp("createdAt", { mode: "string" })
			.defaultNow()
			.notNull(),
		lastLogin: timestamp("lastLogin", { mode: "string" })
			.defaultNow()
			.notNull(),
	},
	(table) => {
		return {
			users_username_unique: unique("users_username_unique").on(table.username),
			users_email_unique: unique("users_email_unique").on(table.email),
		};
	},
);

export const move = pgTable("move", {
	id: uuid("id").primaryKey().defaultRandom(),
	gameId: uuid("gameId").references(() => game.id),
	color: color("color"),
	from: Square("from"),
	to: Square("to"),
	piece: PieceSymbol("piece"),
	captured: PieceSymbol("captured"),
	promotion: PieceSymbol("promotion"),
	flags: text("flags"),
	san: text("san"),
	lan: text("lan"),
	before: text("before"),
	after: text("after"),
});

export const dbUserZodSchema = createInsertSchema(users).pick({
	username: true,
	name: true,
	password: true,
	email: true,
});

export const userRelationToGame = relations(users, ({ many }) => ({
	allGamesAsBlack: many(game, { relationName: "allGamesAsBlack" }),
	allGamesAsWhite: many(game, { relationName: "allGamesAsWhite" }),
}));

export const gameRelationToUser = relations(game, ({ one }) => ({
	player1: one(users, {
		fields: [game.player1id],
		references: [users.id],
		relationName: "allGamesAsWhite",
	}),

	player2: one(users, {
		fields: [game.player2id],
		references: [users.id],
		relationName: "allGamesAsBlack",
	}),
}));

export const gameRelationToMove = relations(game, ({ many }) => ({
	allMoves: many(move, { relationName: "allMoves" }),
}));

export const moveRelationToGame = relations(move, ({ one }) => ({
	game: one(game, {
		fields: [move.gameId],
		references: [game.id],
		relationName: "allMoves",
	}),
}));

export type dbUserZod = z.infer<typeof dbUserZodSchema>;
export const dbUserSelectZodSchema = createSelectSchema(users);

export type dbUserSelectZod = z.infer<typeof dbUserSelectZodSchema>;

export const loginSchema = dbUserSelectZodSchema.pick({
	email: true,
	password: true,
});
