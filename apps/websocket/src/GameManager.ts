import { db } from "@repo/db/db";
import { Game } from "./Game";
import type { User } from "./User";
import { game } from "@repo/db/game";
import { eq } from "drizzle-orm";
import { socketManager } from "./SocketManager";

export class GameManager {
	private games: Game[];
	private pendingGameid: string | null;
	private flag: boolean;
	private users: User[];

	constructor() {
		this.games = [];
		this.users = [];
		this.flag = false;
		this.pendingGameid = null;
	}

	addUser(user: User) {
		this.users.push(user);
		this.addHandler(user);
	}
	async removeUser(user: User) {
		const abandonGame = this.games.find(
			(elem) =>
				elem.player1.dbId === user.dbId || elem.player2?.dbId === user.dbId,
		);
		this.users = this.users.filter((elem) => elem !== user);
		if (!abandonGame) {
			return;
		}
		this.games = this.games.filter((elem) => elem !== abandonGame);
		socketManager.removeUser(abandonGame.id, user);
		await db
			.update(game)
			.set({ gameStatus: "ABANDON" })
			.where(eq(game.id, abandonGame?.id));
	}

	async finishGame(gameId: string, won: "w" | "b") {
		console.log("finishing the game");
		const finishGame = this.games.find((elem) => gameId === elem.id);
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
			if (this.pendingGameid) {
				const game = this.games.find((game) => game.id === this.pendingGameid);
				console.log(game?.id, game?.player1.dbId);
				if (!game) {
					console.log("couldn't find the game");
					return;
				}
				if (game.player1.dbId === user.dbId) {
					console.log("game.player1 ", game.player1.dbId);
					console.log("user dbId ", user.dbId);
					console.log("trying to play with yourself?");
					return;
				}
				console.log("game id added ", game.id);
				socketManager.addUser(game.id, user);
				this.pendingGameid = null;
				game.initSecondPlayer(user);
			} else {
				const game = new Game(user);
				this.games.push(game);
				this.pendingGameid = game.id;
				socketManager.addUser(game.id, user);
				console.log("new game created ", game.id);
			}
		});

		user.socket.on("custom_game", async (data) => {
			if (!data) return;
			console.log("data is ", data);
			if (this.flag) {
				console.log("p2 is here ");
				const game = this.games.find((elem) => elem.id === data);
				game?.initSecondPlayer(user);
				socketManager.addUser(data, user);
				this.flag = false;
			} else {
				console.log("data is ", data);
				console.log("p1 is here ");
				const custGame = new Game(user, data);
				this.games.push(custGame);
				socketManager.addUser(data, user);
				this.flag = true;
			}
		});

		user.socket.on("move", (data) => {
			const message = data;
			const game = this.games.find(
				(game) =>
					game.player1.dbId === user.dbId || game.player2?.dbId === user.dbId,
			);
			if (!game) {
				console.log("nogame");
				return;
			}
			if (!message.payload) {
				throw new Error("No Payload");
			}
			if (game) {
				game.makeMove(message.payload.move);
				if (game.status) {
					this.finishGame(game.id, game.status);
				}
			}
		});

		user.socket.on("disconnect", () => {
			console.log("removing the user");
			console.log(this.users.length);
			this.removeUser(user);
			console.log(this.users.length);
		});
	}
}
