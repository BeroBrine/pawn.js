import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import "dotenv/config";
import { STATUS_CODES } from "@repo/interfaceAndEnums/STATUS_CODES";
import { db } from "@repo/db/db";
import { users } from "@repo/db/game";
import { eq } from "drizzle-orm";
import type { IJwtToken } from "@repo/interfaceAndEnums/IJwtToken";

export interface ILoginUser extends Request {
	userId?: string;
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
			const dbUser = await db
				.select({
					field: users.id,
				})
				.from(users)
				.where(eq(users.id, verified.userId));
			req.userId = dbUser[0].field;
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
