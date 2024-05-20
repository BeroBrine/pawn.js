import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import "dotenv/config";
import prisma from "@repo/db/client";
import type { loginBodyZodType } from "@repo/zodValidation/loginBodyZodType";
import type { dbUserZodType } from "@repo/zodValidation/dbUserZodType";
import { STATUS_CODES } from "@repo/statusCode/STATUS_CODES";

interface IJwtToken {
	userId: string;
	iat: number;
	eat: number;
}

export interface ILoginUser extends Request {
	user: dbUserZodType;
}

interface ICookie {
	_jwtToken: string;
}

const authMiddleware = (req: ILoginUser, res: Response, next: NextFunction) => {
	const body: loginBodyZodType = req.body;
	const cookie = req.cookies as ICookie;
	const token = cookie._jwtToken;
	if (!token)
		return res.status(STATUS_CODES.UNAUTH).json({ msg: "Unauthorized" });
	const secret = process.env.JWT_SECRET ?? "";
	const verified = verify(token, secret) as IJwtToken;
	console.log(verified);
	if (!verified)
		return res.status(STATUS_CODES.UNAUTH).json({ msg: "Unauthorized" });
	(async () => {
		try {
			const dbUser = (await prisma.user.findFirst({
				where: {
					id: verified.userId,
				},
			})) as dbUserZodType;
			console.log(dbUser);
			req.user = dbUser;
			next();
		} catch (e) {
			console.log(e);
			return res
				.status(STATUS_CODES.SERVER_ERROR)
				.json({ msg: "internal server error while validating" });
		}
	})();
};

export default authMiddleware;
