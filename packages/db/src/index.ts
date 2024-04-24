import { PrismaClient } from "@prisma/client";

const prismaSingletonClient = () => {
	return new PrismaClient();
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaSingletonClient>;
}

const prisma = globalThis.prismaGlobal ?? prismaSingletonClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
