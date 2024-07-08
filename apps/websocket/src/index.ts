import { Server } from "socket.io";
import { GameManager } from "./GameManager";

import {
	Messages,
	type IReceivedEvents,
} from "@repo/interfaceAndEnums/IReceivedEvents";
import type { ISentEvents } from "@repo/interfaceAndEnums/ISentEvents";
import { User } from "./User";

const port = 7777;
const io = new Server<IReceivedEvents, ISentEvents>(port, {
	cors: {
		origin: ["http://localhost:7173"],
	},
});

const gameManager = new GameManager();

io.on("connection", (socket) => {
	socket.on("userid", (data) => {
		if (data.type !== Messages.USER_DATA) return;
		gameManager.addUser(new User(socket, data.payload.userid));
	});
});

io.on("error", () => {
	console.log("disconnect");
});

console.log(`starting the server at port ${port}`);
