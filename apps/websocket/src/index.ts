import { Server } from "socket.io";

import type { IReceivedEvents } from "@repo/interfaceAndEnums/IReceivedEvents";
import type { ISentEvents } from "@repo/interfaceAndEnums/ISentEvents";
import { User } from "./User";
import getUserId from "./utils/getUserId";
import { gameManager } from "./GameManager";

const port = 7777;

const io = new Server<IReceivedEvents, ISentEvents>(port, {
	cors: {
		origin: ["http://localhost:7173"],
	},
});

io.on("connection", (socket) => {
	const token = socket.handshake.headers.authorization;
	const userId = getUserId(token as string);
	if (!userId) return;
	gameManager.addUser(new User(socket, userId));
});

console.log(`starting the server at port ${port}`);
