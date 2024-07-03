import { Chess, type Move } from "chess.js";
import { Colors } from "@repo/interfaceAndEnums/Colors";
import { Messages } from "@repo/interfaceAndEnums/Messages";
import type { Socket } from "@repo/interfaceAndEnums/Socket";

export class Game {
	public player1: Socket;
	public player2: Socket;
	private board: Chess;
	private moveHistory: Move[];
	private startTime: Date;

	constructor(player1: Socket, player2: Socket) {
		console.log("init the game");

		this.player1 = player1;
		this.player2 = player2;
		this.board = new Chess();
		this.moveHistory = [];

		this.startTime = new Date();
		try {
			this.player1.emit("init_game", {
				type: Messages.INIT_GAME,
				payload: {
					color: Colors.WHITE,
				},
			});
		} catch (e) {
			console.error(e);
		}
		this.player2.emit("init_game", {
			type: Messages.INIT_GAME,
			payload: {
				color: Colors.BLACK as string,
			},
		});
	}

	makeMove(socket: Socket, move: { from: string; to: string }) {
		try {
			// add strictness here by including the strict flag
			console.log(this.board.turn());
			const latestMove = this.board.move(move);
			console.log(latestMove);
			this.moveHistory.push(latestMove);
		} catch (e) {
			console.error(e);
			return;
		}

		if (this.board.isGameOver()) {
			this.player1.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner: this.board.turn() === Colors.WHITE ? "black" : "white",
				},
			});

			this.player2.emit("game_over", {
				type: Messages.GAME_OVER,
				payload: {
					winner: this.board.turn() === Colors.WHITE ? "black" : "white",
				},
			});
		}
		if (this.board.turn() === "w") {
			console.log("send to 1");
			this.player1.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					moveHistory: this.moveHistory,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		} else {
			console.log("send to 2");
			this.player2.emit("move", {
				type: Messages.MOVE,
				payload: {
					move,
					moveHistory: this.moveHistory,
					turn: this.board.turn() === "w" ? "white" : "black",
				},
			});
		}
	}
}
