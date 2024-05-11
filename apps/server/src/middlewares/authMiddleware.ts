import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import "dotenv/config";
import prisma from "@repo/db/client";
import type { loginBodyType } from "@repo/zodValidation/loginBody";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const header = req.headers.authorization;
	const body: loginBodyType = req.body;
	if (!header) return res.json({ msg: "no auth token found" });
	const token = header[1] ?? "";
	const secret = process.env.JWT_SECRET ?? "";
	const verified = verify(token, secret);
};

export default authMiddleware;
