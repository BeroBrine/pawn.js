import type { WebSocket } from "ws";
import { Messages, type message } from "./messages";
import { Game } from "./Game";

export class GameManager {
	private games: Game[];
	private pendingUser: WebSocket | null;
	private users: WebSocket[];

	constructor() {
		this.games = [];
		this.users = [];
		this.pendingUser = null;
	}

	addUser(socket: WebSocket) {
		this.users.push(socket);
		console.log("added user");
		this.addHandler(socket);
	}

	removeUser(socket: WebSocket) {
		this.users = this.users.filter((elem) => elem !== socket);
		// stop the game here because the user left
	}

	private addHandler(socket: WebSocket) {
		socket.on("message", (data) => {
			console.log("the message is ", data.toString());
			const message = ((): message | null => {
				try {
					const parse = JSON.parse(data.toString());
					return parse;
				} catch (e) {
					console.log(e);
				}
				return null;
			})();
			if (!message) throw new Error("invalid message");
			if (message.type === (Messages.INIT_GAME as string)) {
				console.log("in the init game");
				if (!this.pendingUser) this.pendingUser = socket;
				else {
					const game = new Game(this.pendingUser, socket);
					this.games.push(game);
					this.pendingUser = null;
				}
			}

			if (message.type === (Messages.MOVE as string)) {
				const game = this.games.find(
					(game) => game.player1 === socket || game.player2 === socket,
				);
				if (!game) return console.log("game was not found");
				console.log("the game is", game);
				if (!message.payload) {
					console.log("what is up");
					return;
				}
				game.makeMove(socket, message.payload);
			}
		});
	}
}
