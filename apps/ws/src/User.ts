import { prisma } from "@repo/db/client";
import type { Socket } from "@repo/interfaceAndEnums/IReceivedEvents";
import { randomUUID } from "node:crypto";
import { Game } from "./Game";

export class User {
	public socket: Socket;
	public color: "white" | "black" | "";
	public dbId: string;
	public id: string;

	constructor(s: Socket, u: string) {
		this.socket = s;
		this.dbId = u;
		this.color = "";
		this.id = randomUUID();
	}

	async addGameToDb(game: Game, secondPlayer: User) {
		// try {
		//   const game = prisma.game.create({
		//     data: {
		//       whitePlayerId: this.dbId,
		//
		//
		//     }
		//   })
		// }
		console.log(this.dbId, this.color);
	}
}
