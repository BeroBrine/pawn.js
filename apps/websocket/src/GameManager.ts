import { db } from "@repo/db/db";
import { Game } from "./Game";
import type { User } from "./User";
import { game } from "@repo/db/game";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

export class GameManager {
	public static instance: GameManager;
	public id: string;
	public games: Game[];
	private pendingUser: User | null;
	public users: User[];

	constructor() {
		this.games = [];
		this.users = [];
		this.id = randomUUID();
		this.pendingUser = null;
	}

	static getInstance() {
		if (GameManager.instance) {
			console.log("hhhhhh");
			return GameManager.instance;
		}
		console.log("returning new instance");
		GameManager.instance = new GameManager();
		return GameManager.instance;
	}

	addUser(user: User) {
		this.users.push(user);
		console.log(user.dbId);
		this.addHandler(user);
	}

	async removeUser(user: User) {
		console.log("user ", user.id, " has left the game");
		const abandonGame = this.games.find(
			(elem) => elem.player1.id === user.id || elem.player2.id === user.id,
		);
		if (!abandonGame) return;
		this.users = this.users.filter((elem) => elem !== user);
		this.games = this.games.filter((elem) => elem !== abandonGame);
		await db
			.update(game)
			.set({ gameStatus: "ABANDON" })
			.where(eq(game.id, abandonGame?.id));
	}
	async finishGame(user: User, won: "b" | "w") {
		console.log("finishing the game");
		const finishGame = this.games.find(
			(elem) => elem.player1.id === user.id || elem.player2.id === user.id,
		);

		if (!finishGame) {
			console.log("no game found");
			return;
		}
		this.games = this.games.filter((elem) => elem !== finishGame);
		console.log("db update on ", finishGame.id);
		await db
			.update(game)
			.set({ gameStatus: "COMPLETED", result: won })
			.where(eq(game.id, finishGame?.id));
	}
	private addHandler(user: User) {
		user.socket.on("init_game", (data) => {
			const message = data;
			if (!message) throw new Error("invalid message");
			console.log("in the init game");

			console.log("in the init game");
			if (!this.pendingUser) {
				this.pendingUser = user;
			} else {
				console.log("preparing new game with ", user.id, this.pendingUser.id);
				if (this.pendingUser.dbId === user.dbId) {
					console.log("trying to play with yourself?");
					this.pendingUser = null;
					return;
				}
				const game = new Game(this.pendingUser, user);
				this.pendingUser.color = "white";
				user.color = "black";
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
			if (!game) {
				console.log("nogame");
				return;
			}
			if (!message.payload) {
				throw new Error("No Payload");
			}
			game.makeMove(message.payload.move);
		});

		user.socket.on("disconnect", () => {
			console.log("removing the user");

			console.log(this.users.length);
			this.removeUser(user);
			console.log(this.users.length);
		});
	}
}
export const gameManager = GameManager.instance;
