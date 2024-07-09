import type { Socket } from "@repo/interfaceAndEnums/IReceivedEvents";
import { randomUUID } from "node:crypto";

export class User {
	public socket: Socket;
	public dbId: string;

	constructor(s: Socket, u: string) {
		this.socket = s;
		this.dbId = u;
	}
}
