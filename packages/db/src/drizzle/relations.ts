import { relations } from "drizzle-orm/relations";
import { users, game } from "./schema";

export const gameRelations = relations(game, ({ one }) => ({
	user_player1id: one(users, {
		fields: [game.player1id],
		references: [users.id],
		relationName: "game_player1id_users_id",
	}),
	user_player2id: one(users, {
		fields: [game.player2id],
		references: [users.id],
		relationName: "game_player2id_users_id",
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	games_player1id: many(game, {
		relationName: "game_player1id_users_id",
	}),
	games_player2id: many(game, {
		relationName: "game_player2id_users_id",
	}),
}));
