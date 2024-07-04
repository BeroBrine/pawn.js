import { Game } from "./Game";
import type { User } from "./User";

export class GameManager {
	private games: Game[];
	private pendingUser: User | null;
	private users: User[];

	constructor() {
		this.games = [];
		this.users = [];
		this.pendingUser = null;
	}

	addUser(user: User) {
		this.users.push(user);
		console.log("added user");

		this.addHandler(user);
	}

	removeUser(user: User) {
		console.log("user ", user.id, " has left the game");
		const game = this.games.find(
			(elem) => elem.player1.id === user.id || elem.player2.id === user.id,
		);
		this.users = this.users.filter((elem) => elem !== user);
		this.games = this.games.filter((elem) => elem !== game);
	}

	private addHandler(user: User) {
		user.socket.on("init_game", (data) => {
			const message = data;
			if (!message) throw new Error("invalid message");
			if (!this.pendingUser) {
				this.pendingUser = user;
			} else {
				console.log("preparing new game with ", user.id, this.pendingUser.id);
				const game = new Game(this.pendingUser, user);
				this.games.push(game);
				this.pendingUser = null;
			}
		});

		user.socket.on("move", (data) => {
			console.log("move");
			const message = data;
			const game = this.games.find(
				(game) => game.player1 === user || game.player2 === user,
			);
			if (!game) throw new Error("NO GAME FOUND");
			if (!message.payload) {
				throw new Error("No Payload");
			}
			game.makeMove(user.socket, message.payload.move);
		});

		user.socket.on("disconnect", () => {
			console.log("removing the user");

			console.log(this.users.length);
			this.removeUser(user);
			console.log(this.users.length);
		});
	}
}
