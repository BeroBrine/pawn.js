import express from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cors from "cors";
import { createServer } from "node:http";
import type {
	IExpressReceiveEvents,
	IExpressSendEvents,
} from "@repo/interfaceAndEnums/IReceivedEvents";

const app: express.Express = express();

const port = 3000;

const server = createServer(app);

const io = new Server<IExpressReceiveEvents, IExpressSendEvents>(server);

app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:7173",
	}),
);

app.use("/auth", authRouter);

io.on("connection", (socket) => {
	console.log("connected with socket id %s", socket.id);
});

server.listen(port, () => {
	console.log(`started the server at port ${port}`);
});
