import { db } from "@repo/db/db";
import { Game } from "./Game";
import type { User } from "./User";
import { game } from "@repo/db/game";
import { eq } from "drizzle-orm";
import { socketManager } from "./SocketManager";

class GameManager {
	private static instance: GameManager;
	private games: Game[];
	private pendingGameid: string | null;
	private flag: boolean;
	private users: User[];

	private constructor() {
		this.games = [];
		this.users = [];
		this.flag = false;
		this.pendingGameid = null;
	}
	static getInstance() {
		if (GameManager.instance) return GameManager.instance;
		GameManager.instance = new GameManager();
		return GameManager.instance;
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
		console.warn(
			"DEBUGPRINT[9]: GameManager.ts:51 (after async finishGame(gameId: string, won: w …)",
		);
		const finishGame = this.games.find((elem) => gameId === elem.id);
		if (!finishGame) {
			console.warn(
				"DEBUGPRINT[10]: GameManager.ts:54 (after if (!finishGame) )",
			);
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
				console.warn("DEBUGPRINT[4]: GameManager.ts:67: game=", game);
				if (!game) {
					console.log("couldn't find the game");
					return;
				}
				if (game.player1.dbId === user.dbId) {
					console.warn(
						"DEBUGPRINT[6]: GameManager.ts:73: user.dbId)=",
						user.dbId,
					);
					console.warn(
						"DEBUGPRINT[5]: GameManager.ts:73: game.player1.dbId=",
						game.player1.dbId,
					);
					console.log("trying to play with yourself?");
					return;
				}
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
			console.warn("DEBUGPRINT[7]: GameManager.ts:98: data=", data);
			if (this.flag) {
				console.warn("p2 is here ");
				const game = this.games.find((elem) => elem.id === data);
				game?.initSecondPlayer(user);
				socketManager.addUser(data, user);
				this.flag = false;
			} else {
				console.warn("data is ", data);
				console.warn("p1 is here ");
				const custGame = new Game(user, data, true);
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
				console.warn("DEBUGPRINT[8]: GameManager.ts:122 (after if (!game) )");
				return;
			}
			if (!message.payload) {
				throw new Error("No Payload");
			}
			game.makeMove(message.payload.move);
		});

		user.socket.on("disconnect", () => {
			this.removeUser(user);
		});
	}
}

export const gameManager = GameManager.getInstance();
