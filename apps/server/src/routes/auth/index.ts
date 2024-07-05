import {
	type Request,
	type Response,
	Router,
	type RequestHandler,
} from "express";
import { sign } from "jsonwebtoken";

import {
	loginBodyZod,
	signupBodyZod,
	type signUpBodyZodType,
	type loginBodyZodType,
} from "@repo/zodValidation/loginBodyZod";
import { STATUS_CODES } from "@repo/interfaceAndEnums/STATUS_CODES";
import "dotenv/config";
import { prisma, findUserInDb } from "@repo/db/client";
import { generateHash, verifyPassword } from "../../utils/passUtil";
import { authMiddleware } from "../../middlewares";
import type { ILoginUser } from "../../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post(
	"/loggedIn",
	authMiddleware as RequestHandler,
	(req: ILoginUser, res: Response) => {
		return res
			.status(STATUS_CODES.OK)
			.json({ msg: "loggedIn", userId: req.user?.id });
	},
);

authRouter.post("/login", async (req: ILoginUser, res: Response) => {
	console.log("inside the login ");
	const body = req.body as loginBodyZodType;
	console.log(body);
	const { error, success } = loginBodyZod.safeParse(body);
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
		const user = await findUserInDb(body);

		if (!user)
			return res.status(STATUS_CODES.UNAUTH).json({ msg: "no user found" });

		const verify = await verifyPassword(user.password, body.password);
		console.log("the verify is ", verify);
		if (!verify)
			return res.status(STATUS_CODES.UNAUTH).json({ msg: "unauthorized" });
		console.log("everything successfull");
		req.user = user;
		console.log(req.user);
		const date = new Date();
		date.toISOString();
		try {
			await prisma.user.update({
				where: {
					username: user.username,
					email: user.email,
				},
				data: {
					lastLogin: date,
				},
			});
		} catch (e) {
			console.log(e);
			return res
				.status(STATUS_CODES.SERVER_ERROR)
				.json({ msg: "internal server error" });
		}
		const token = sign({ userId: user.id }, JWT_SEC, { expiresIn: "1hr" });
		return res.status(STATUS_CODES.OK).json({ token: token });
	} catch (e) {
		console.log(e);
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });
	}
});

authRouter.post("/signup", async (req: Request, res: Response) => {
	console.log("signup req");
	const body = req.body as signUpBodyZodType;
	if (!body)
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "no body found" });
	const { success } = signupBodyZod.safeParse(body);
	if (!process.env.PASS_SALT)
		return res
			.status(STATUS_CODES.SERVER_ERROR)
			.json({ msg: "server error has occurred" });
	const uint8Salt = Uint8Array.from(
		Array.from(process.env.PASS_SALT).map((letter) => letter.charCodeAt(0)),
	);
	const genHash = await generateHash(body.password, uint8Salt);
	if (!success)
		return res
			.status(STATUS_CODES.FORBIDDEN)
			.json({ msg: "the sent body is wrong" });
	const date = new Date();
	date.toISOString();
	try {
		const user = await prisma.user.create({
			data: {
				username: body.username,
				name: body.name,
				email: body.email,
				password: genHash,
				lastLogin: date,
			},
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
