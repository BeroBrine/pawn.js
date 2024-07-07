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

export const stat = pgEnum("stat", [
	"GOING_ON",
	"COMPLETED",
	"ABANDON",
	"PLAYER_LEFT",
]);

export const game = pgTable("game", {
	id: uuid("id").primaryKey().notNull(),
	player1id: uuid("player1id")
		.notNull()
		.references(() => users.id),
	player2id: uuid("player2id")
		.notNull()
		.references(() => users.id),
	gameStatus: stat("gameStatus").notNull(),
	startingFen: text("startingFen").default(
		"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	),
	currentFen: text("currentFen").notNull(),
	startAt: timestamp("startAt", {
		withTimezone: true,
		mode: "string",
	}).defaultNow(),
});

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
