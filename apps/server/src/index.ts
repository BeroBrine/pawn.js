import prisma from "@repo/db/client";
import express from "express";

const app: express.Express = express();
const port = 3000;

app.get("/", (req: express.Request, res: express.Response) => {
	return res.json({ msg: "heelo ji" });
});

app.listen(port, () => {
	console.log(`running on port ${port}`);
});
