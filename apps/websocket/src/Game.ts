import { Chess, type Move } from "chess.js";
import { Colors } from "@repo/interfaceAndEnums/Colors";
import { Messages } from "@repo/interfaceAndEnums/Messages";
import type { User } from "./User";
import { randomUUID } from "node:crypto";
import { db } from "@repo/db/db";
import { game, users } from "@repo/db/game";
import { eq, or } from "drizzle-orm";

export class Game {
	public player1: User;
	public player2: User;
	public id: string;
	private board: Chess;
	private moveHistory: Move[];
	private startTime: Date;

	constructor(player1: User, player2: User) {
		console.log("init the game");
		this.id = randomUUID();
		this.player1 = player1;
		this.player2 = player2;
		this.board = new Chess();
		this.moveHistory = [];
		this.startTime = new Date();

		try {
			this.player1.socket.emit("init_game", {
				type: Messages.INIT_GAME,
				payload: {
					color: Colors.WHITE,
				},
			});
		} catch (e) {
			console.error(e);
		}
		this.player2.socket.emit("init_game", {
			type: Messages.INIT_GAME,
			payload: {
				color: Colors.BLACK as string,
			},
		});
		this.createGameInDb();
	}

	makeMove(move: { from: string; to: string }) {
		try {
			console.log(this.board.turn());
			const latestMove = this.board.move(move);
			console.log(latestMove);
			this.moveHistory.push(latestMove);
		} catch (e) {
			console.error(e);
			return;
		}

		if (this.board.isGameOver()) {
			this.player1.socket.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner: this.board.turn() === Colors.WHITE ? "black" : "white",
				},
			});

			this.player2.socket.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner: this.board.turn() === Colors.WHITE ? "black" : "white",
				},
			});
		}
		if (this.board.turn() === "w") {
			console.log("send to 1");
			this.player1.socket.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					moveHistory: this.moveHistory,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		} else {
			console.log("send to 2");
			this.player2.socket.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					moveHistory: this.moveHistory,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		}
	}

	private async createGameInDb() {
		const query = await db
			.insert(game)
			.values({
				id: this.id,
				player1id: this.player1.dbId,
				player2id: this.player2.dbId,
				gameStatus: "GOING_ON",
				currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
			})
			.returning({ gameId: game.id });
		const userQuery = await db
			.select()
			.from(users)
			.where(
				or(eq(users.id, this.player1.dbId), eq(users.id, this.player2.dbId)),
			);
		const whiteUserArr = userQuery[0].gamesAsWhite;
		const blackUserArr = userQuery[1].gamesAsBlack;
		whiteUserArr.push(query[0].gameId);
		blackUserArr.push(query[0].gameId);
		await db
			.update(users)
			.set({
				gamesAsWhite: whiteUserArr,
			})
			.where(eq(users.id, userQuery[0].id));

		await db
			.update(users)
			.set({
				gamesAsBlack: blackUserArr,
			})
			.where(eq(users.id, userQuery[1].id));
	}
}
