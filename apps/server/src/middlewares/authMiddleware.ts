import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import "dotenv/config";
import prisma from "@repo/db/prisma";
import type { dbUserZodType } from "@repo/zodValidation/dbUserZodType";
import { STATUS_CODES } from "@repo/interfaceAndEnums/STATUS_CODES";

interface IJwtToken {
	userId: string;
	iat: number;
	eat: number;
}

export interface ILoginUser extends Request {
	user?: dbUserZodType;
}

const authMiddleware = (req: ILoginUser, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return res.status(STATUS_CODES.UNAUTH).json({ msg: "Unauthorized" });
	const token = authHeader.split(" ")[1];
	if (!token || token === "null")
		return res.status(STATUS_CODES.UNAUTH).json({ msg: "Unauthorized" });
	console.log("still running");
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
