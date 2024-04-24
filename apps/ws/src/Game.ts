import { Chess, Move } from "chess.js";
import { WebSocket } from "ws";
import { Colors, Messages } from "./messages";

export class Game {
	public player1: WebSocket;
	public player2: WebSocket;
	private board: Chess;
	private moveHistory: Move[];
	private startTime: Date;

	constructor(player1: WebSocket, player2: WebSocket) {
		console.log("init the game");

		this.player1 = player1;
		this.player2 = player2;
		console.log(!player1);
		console.log(!player2);
		this.board = new Chess();
		this.moveHistory = [];

		this.startTime = new Date();
		try {
			this.player1.send(
				JSON.stringify({
					type: "hello",
					payload: {
						color: Colors.WHITE as string,
					},
				}),
			);
		} catch (e) {
			console.error(e);
		}
		this.player2.send(
			JSON.stringify({
				type: "hello",
				payload: {
					color: Colors.BLACK as string,
				},
			}),
		);
	}

	makeMove(socket: WebSocket, move: { from: string; to: string }) {
		try {
			// add strictness here by including the strict flag
			const latestMove = this.board.move(move);
			this.moveHistory.push(latestMove);
		} catch (e) {
			console.error(e);
			return;
		}

		if (this.board.isGameOver()) {
			this.player1.send(
				JSON.stringify({
					type: Messages.GAME_OVER,
					payload: {
						winner: this.board.turn() === Colors.WHITE ? "black" : "white",
					},
				}),
			);

			this.player2.send(
				JSON.stringify({
					type: Messages.GAME_OVER,
					payload: {
						winner: this.board.turn() === Colors.WHITE ? "black" : "white",
					},
				}),
			);
		}
		if (this.moveHistory.length % 2 === 0) {
			console.log("send to 1");
			this.player1.send(
				JSON.stringify({
					type: Messages.MOVE,
					payload: {
						move,
						moveHistory: this.moveHistory,
					},
					turn: this.board.turn() === "w" ? "white" : "black",
				}),
			);
		} else {
			console.log("send to 2");
			this.player2.send(
				JSON.stringify({
					type: Messages.MOVE,
					payload: {
						move,
						moveHistory: this.moveHistory,
					},

					turn: this.board.turn() === "w" ? "white" : "black",
				}),
			);
		}
	}
}
