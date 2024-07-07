import {
	type Request,
	type Response,
	Router,
	type RequestHandler,
} from "express";
import { sign } from "jsonwebtoken";

import { STATUS_CODES } from "@repo/interfaceAndEnums/STATUS_CODES";
import "dotenv/config";
import { db } from "@repo/db/db";
import { generateHash, verifyPassword } from "../../utils/passUtil";
import { authMiddleware } from "../../middlewares";
import type { ILoginUser } from "../../middlewares/authMiddleware";
import {
	type dbUserZod,
	dbUserZodSchema,
	loginSchema,
	users,
} from "@repo/db/game";
import { eq } from "drizzle-orm";

const authRouter = Router();

authRouter.post(
	"/loggedIn",
	authMiddleware as RequestHandler,
	(req: ILoginUser, res: Response) => {
		return res
			.status(STATUS_CODES.OK)
			.json({ msg: "loggedIn", userId: req.userId });
	},
);

authRouter.post("/login", async (req: ILoginUser, res: Response) => {
	console.log("inside the login ");
	const body = req.body;
	console.log(body);
	const { error, success } = loginSchema.safeParse(body);
	console.log(error);
	const JWT_SEC = process.env.JWT_SECRET;
	console.log(success);
	if (!success)
		return res
			.status(STATUS_CODES.FORBIDDEN)
			.json({ msg: "sent body is not valid" });
	if (!JWT_SEC)
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });

	try {
		console.log("finding user in db");
		console.log("the body is", body);
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, body.email));

		if (!user)
			return res.status(STATUS_CODES.UNAUTH).json({ msg: "no user found" });

		const verify = await verifyPassword(user[0].password, body.password);
		console.log("the verify is ", verify);
		if (!verify)
			return res.status(STATUS_CODES.UNAUTH).json({ msg: "unauthorized" });
		console.log("everything successfull");
		req.userId = user[0].id;
		const date = new Date();
		const strDate = date.toISOString();
		try {
			await db
				.update(users)
				.set({ lastLogin: strDate })
				.where(eq(users.id, user[0].id));
		} catch (e) {
			console.log(e);
			return res
				.status(STATUS_CODES.SERVER_ERROR)
				.json({ msg: "internal server error" });
		}
		const token = sign({ userId: user[0].id }, JWT_SEC, { expiresIn: "1hr" });
		return res.status(STATUS_CODES.OK).json({ token: token });
	} catch (e) {
		console.log(e);
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });
	}
});

authRouter.post("/signup", async (req: Request, res: Response) => {
	console.log("signup req");
	if (!req.body)
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "no body found" });
	const { success } = dbUserZodSchema.safeParse(req.body);
	const body = req.body as dbUserZod;
	if (!success)
		return res
			.status(STATUS_CODES.FORBIDDEN)
			.json({ msg: "the sent body is wrong" });
	if (!process.env.PASS_SALT)
		return res
			.status(STATUS_CODES.SERVER_ERROR)
			.json({ msg: "server error has occurred" });
	const uint8Salt = Uint8Array.from(
		Array.from(process.env.PASS_SALT).map((letter) => letter.charCodeAt(0)),
	);
	const genHash = await generateHash(body.password, uint8Salt);
	try {
		const user = await db.insert(users).values({
			email: body.email,
			username: body.username,
			password: genHash,
			gamesAsBlack: new Array<string>(),
			gamesAsWhite: new Array<string>(),
		});
		console.log(user);
	} catch (e) {
		return res
			.status(STATUS_CODES.SERVER_ERROR)
			.json({ msg: "internal server error" });
	}
	return res
		.status(STATUS_CODES.OK)
		.json({ msg: "user has been created successfully" });
});

export default authRouter;
