import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";

const wss = new WebSocketServer({ port: 7777 });
const gameManager = new GameManager();

wss.on("connection", (ws) => {
	console.log(ws.url);
	console.log("connection made");
	ws.on("error", console.error);
	ws.on("open", () => {
		console.log("what");
	});
	gameManager.addUser(ws);
	ws.on("close", () => gameManager.removeUser(ws));
});
