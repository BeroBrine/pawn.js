import { type Request, type Response, Router } from "express";
import { z } from "zod";
import { verify } from "jsonwebtoken";
import findUserInDb from "../../utils/findUserInDb";
import {
	loginBodyZod,
	signupBodyZod,
	type signUpBodyZodType,
	type loginBodyZodType,
} from "@repo/zodValidation/loginBodyZod";
import type { dbUserZodType } from "@repo/zodValidation/dbUserZodType";
import { STATUS_CODES } from "../../utils/statusCodes";
import "dotenv/config";
import prisma from "@repo/db/client";
import { generateHash } from "../../utils/hashGen";
const authRouter = Router();

interface ILoginUser extends Request {
	user?: dbUserZodType;
}

authRouter.get("/login", async (req: ILoginUser, res: Response) => {
	const authHeader = req.headers.authorization;
	const body = req.body;
	const { success } = loginBodyZod.safeParse(body);
	if (!success)
		return res
			.status(STATUS_CODES.FORBIDDEN)
			.json({ msg: "sent body is not valid" });
	if (!authHeader) return res.json({ msg: "no auth header found" });
	const token = authHeader.split(" ")[1];
	const JWT_SEC = process.env.JWT_SECRET;
	if (!JWT_SEC || !token)
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });
	let verified = false;
	verify(token, JWT_SEC, (err, decoded) => {
		if (err) {
			console.log(err);
		}
		if (decoded) verified = true;
	});
	if (!verified) return res.json({ msg: "user not found" });
	const user = await findUserInDb(body);
	if (!user)
		return res.status(STATUS_CODES.UNAUTH).json({ msg: "no user found" });
	req.user = user;
	return res.status(STATUS_CODES.OK).json({ msg: "login successfull" });
});

authRouter.post("/signup", async (req: Request, res: Response) => {
	const body = req.body as signUpBodyZodType;
	if (!body)
		return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "no body found" });
	const { success } = signupBodyZod.safeParse(body);
	const genHash = await generateHash(body.password);
	if (!success)
		return res
			.status(STATUS_CODES.FORBIDDEN)
			.json({ msg: "the sent body is wrong" });
	const user = prisma.user.create({
		data: {
			username: body.username,
			name: body.name,
			email: body.email,
		},
	});
});

export default authRouter;
