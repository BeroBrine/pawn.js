import { type Request, type Response, Router } from "express";
import { z } from "zod";
import { sign } from "jsonwebtoken";
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
import { generateHash, verifyPassword } from "../../utils/hashGen";
const authRouter = Router();

interface ILoginUser extends Request {
  user?: dbUserZodType;
}

authRouter.get("/login", async (req: ILoginUser, res: Response) => {
  const authHeader = req.headers.authorization;
  const body = req.body as loginBodyZodType;
  const { success } = loginBodyZod.safeParse(body);
  const JWT_SEC = process.env.JWT_SECRET;
  if (!success)
    return res
      .status(STATUS_CODES.FORBIDDEN)
      .json({ msg: "sent body is not valid" });
  if (!authHeader) return res.json({ msg: "no auth header found" });
  if (!JWT_SEC)
    return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });

  try {
    const user = await findUserInDb(body);

    console.log(user);
    if (!user)
      return res.status(STATUS_CODES.UNAUTH).json({ msg: "no user found" });

    const verify = verifyPassword(user.password, body.password);
    if (!verify)
      return res.status(STATUS_CODES.UNAUTH).json({ msg: "unauthorized" });

    req.user = user;
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
    return res
      .status(STATUS_CODES.OK)
      .json({ msg: "login successfull", token });
  } catch (e) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ msg: "server error" });
  }
});

authRouter.post("/signup", async (req: Request, res: Response) => {
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
