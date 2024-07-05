import { PrismaClient } from "@prisma/client";
import { loginBodyZodType } from "@repo/zodValidation/loginBodyZodType";

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

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
