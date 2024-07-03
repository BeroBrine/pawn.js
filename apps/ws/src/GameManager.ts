import { Messages } from "@repo/interfaceAndEnums/Messages";
import { Game } from "./Game";
import type { Socket } from "@repo/interfaceAndEnums/Socket";

export class GameManager {
	private games: Game[];
	private pendingUser: Socket | null;
	private users: Socket[];

	constructor() {
		this.games = [];
		this.users = [];
		this.pendingUser = null;
	}

	addUser(socket: Socket) {
		this.users.push(socket);
		console.log("added user");

		this.addHandler(socket);
	}

	removeUser(socket: Socket) {
		console.log("user ", socket.id, " has left the game");
		const game = this.games.find(
			(elem) => elem.player1.id === socket.id || elem.player2.id === socket.id,
		);
		this.users = this.users.filter((elem) => elem !== socket);
		this.games = this.games.filter((elem) => elem !== game);
	}

	private addHandler(socket: Socket) {
		socket.on("init_game", (data) => {
			const message = data;
			if (!message) throw new Error("invalid message");
			if (!this.pendingUser) {
				this.pendingUser = socket;
			} else {
				console.log("preparing new game with ", socket.id, this.pendingUser.id);
				const game = new Game(this.pendingUser, socket);
				this.games.push(game);
				this.pendingUser = null;
			}
		});

		socket.on("move", (data) => {
			console.log("move");
			const message = data;
			const game = this.games.find(
				(game) => game.player1 === socket || game.player2 === socket,
			);
			if (!game) throw new Error("NO GAME FOUND");
			if (!message.payload) {
				throw new Error("No Payload");
			}
			game.makeMove(socket, message.payload.move);
		});

		socket.on("disconnect", () => {
			console.log("removing the user");

			console.log(this.users.length);
			this.removeUser(socket);
			console.log(this.users.length);
		});
	}
}
