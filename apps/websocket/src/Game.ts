import { Chess, type Move } from "chess.js";
import { Colors } from "@repo/interfaceAndEnums/Colors";
import { Messages } from "@repo/interfaceAndEnums/Messages";
import type { User } from "./User";
import { randomUUID } from "node:crypto";
import { db } from "@repo/db/db";
import {
	game,
	move,
	type PieceSymbolDb,
	type SquareDb,
	users,
} from "@repo/db/game";
import { eq, or } from "drizzle-orm";
import { socketManager } from "./SocketManager";
import { gameManager } from "./GameManager";

type Status = "w" | "b";

export class Game {
	public player1: User;
	public player2: User | null;
	public id: string;
	private board: Chess;
	public customGame?: boolean;
	public status: Status | null;
	private movesId: string[];

	constructor(player1: User, gameId?: string, customGame?: boolean) {
		this.id = gameId ?? randomUUID();
		this.player1 = player1;
		this.player2 = null;
		this.board = new Chess();
		this.board.reset();
		this.status = null;
		this.customGame = customGame;
		this.movesId = [];
	}

	initSecondPlayer(player2: User) {
		this.player2 = player2;

		try {
			this.player1.socket.emit("init_game", {
				type: Messages.INIT_GAME,
				payload: {
					color: Colors.WHITE,
				},
			});
			this.player2.socket.emit("init_game", {
				type: Messages.INIT_GAME,
				payload: {
					color: Colors.BLACK as string,
				},
			});
		} catch (e) {
			console.log(e);
			return;
		}
		if (this.customGame) this.customGameUpdate();
		else this.createGameInDb();

		this.player2.socket.on("disconnect", () => {
			this.player1.socket.emit("playerDisconnect");
		});

		this.player1.socket.on("disconnect", () => {
			this.player2?.socket.emit("playerDisconnect");
		});
	}

	makeMove(move: { from: string; to: string }) {
		try {
			const latestMove = this.board.move(move);
			console.log("moves ", latestMove.from, latestMove.to);
			this.updateMovesAndGame(latestMove);
		} catch (e) {
			console.error(e);
			return;
		}
		if (this.board.isGameOver()) {
			const winner = this.board.turn() === Colors.WHITE ? "black" : "white";
			this.player1.socket.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner,
				},
			});

			this.player2?.socket.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner,
				},
			});
			if (!this.player2) return;
			socketManager.removeUser(this.id, this.player1);
			socketManager.removeUser(this.id, this.player2);
			this.status = this.board.turn() === Colors.WHITE ? "b" : "w";
			gameManager.finishGame(
				this.id,
				this.board.turn() === Colors.WHITE ? "b" : "w",
			);
		}
		if (this.board.turn() === "w") {
			console.log("send to 1");
			this.player1.socket.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		} else {
			console.log("send to 2");
			this.player2?.socket.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		}
	}

	private async createGameInDb() {
		if (!this.player2) return;
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

	private async updateMovesAndGame(latestMove: Move) {
		const id = await db
			.insert(move)
			.values({
				color: latestMove.color as "w" | "b",
				gameId: this.id,
				from: latestMove.from as SquareDb,
				to: latestMove.to as SquareDb,
				piece: latestMove.piece as PieceSymbolDb,
				captured: latestMove.captured as PieceSymbolDb,
				promotion: latestMove.promotion as PieceSymbolDb,
				flags: latestMove.flags as string,
				san: latestMove.san as string,
				lan: latestMove.lan as string,
				before: latestMove.before as string,
				after: latestMove.after as string,
			})
			.returning({ mvId: move.id });
		this.movesId.push(id[0].mvId);
		await db
			.update(game)
			.set({
				moves: this.movesId,
				currentFen: this.board.fen(),
			})
			.where(eq(game.id, this.id));
	}

	async customGameUpdate() {
		if (!this.player2) return;
		const date = new Date();
		const isoDate = date.toISOString();
		await db
			.update(game)
			.set({
				player1id: this.player1.dbId,
				player2id: this.player2.dbId,
				gameStatus: "GOING_ON",
				currentFen: this.board.fen(),
				startAt: isoDate,
			})
			.where(eq(game.id, this.id));
		const userQuery = await db
			.select()
			.from(users)
			.where(
				or(eq(users.id, this.player1.dbId), eq(users.id, this.player2.dbId)),
			);
		const whiteUserArr = userQuery[0].gamesAsWhite;
		const blackUserArr = userQuery[1].gamesAsBlack;
		whiteUserArr.push(this.id);
		blackUserArr.push(this.id);
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
