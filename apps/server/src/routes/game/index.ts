import { randomUUID } from "node:crypto";
import { Router } from "express";
import { db } from "@repo/db/db";
import { game } from "@repo/db/game";
import { STATUS_CODES } from "@repo/interfaceAndEnums/IReceivedEvents";
import { authMiddleware } from "../../middlewares";

const gameRouter = Router();

gameRouter.post("/generateGame", authMiddleware, async (req, res) => {
	const randomId = randomUUID();
	try {
		const result = await db
			.insert(game)
			.values({
				id: randomId,
			})
			.returning({ gameId: game.id });
		console.log("the generated id is ", result[0].gameId);
		console.log("random id is ", result);

		return res.status(STATUS_CODES.OK).json({ randomId });
	} catch (e) {
		console.log(e);
		return res
			.status(STATUS_CODES.SERVER_ERROR)
			.json({ msg: "game generation failed" });
	}
});

gameRouter.post;

export default gameRouter;
