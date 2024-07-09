import express from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "@repo/db/db";
import gameRouter from "./routes/game";

const app: express.Express = express();
interface Iparam {
	type: string;
}

const port = 3000;
console.log("starting");
app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:7173",
	}),
);

app.use("/auth", authRouter);
app.use("/game", gameRouter);

app.get("/db", async (req, res) => {
	try {
		const query = await db.query.users.findMany({
			with: {
				allGamesAsBlack: true,
				allGamesAsWhite: true,
			},
		});

		query.map((elem) => {
			console.log(
				"============================BLACK================================",
			);
			console.log(elem.allGamesAsBlack);
			console.log(
				"===================WHITE====================================",
			);
			console.log(elem.allGamesAsWhite);
		});
	} catch (e) {
		console.error(e);
	}
	return res.status(200).send();
});
app.listen(port, () => {
	console.log(`started the server at port ${port}`);
});
