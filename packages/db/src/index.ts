import { PrismaClient } from "@prisma/client";
import type { loginBodyZodType } from "@repo/zodValidation/loginBodyZod";

const prismaSingletonClient = () => {
	return new PrismaClient();
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaSingletonClient>;
}

export const prisma = globalThis.prismaGlobal ?? prismaSingletonClient();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export const findUserInDb = async (body: loginBodyZodType) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});
		return user;
	} catch (e) {
		console.log(e);
		throw new Error("Internal Db Error");
	}
};
