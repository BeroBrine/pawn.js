import prisma from "@repo/db/prisma";
import type { Socket } from "@repo/interfaceAndEnums/IReceivedEvents";
import { randomUUID } from "node:crypto";
import { Game } from "./Game";

export class User {
	public socket: Socket;
	public color: "white" | "black" | "";
	public dbId: string;
	public id: string;
	private flag: boolean;

	constructor(s: Socket, u: string) {
		this.socket = s;
		this.dbId = u;
		this.color = "";
		this.flag = false;
		this.id = randomUUID();
	}

	//  async addGameToDb(game: Game, secondPlayer: User) {
	//
	//    try {
	//      const user = prisma.user.findFirst({
	//        where: {
	//          id: this.dbId
	//        }
	//      })
	//      if (this.flag) {
	//
	//      }
	//    }
	// }
}
