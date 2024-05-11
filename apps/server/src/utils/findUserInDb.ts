import prisma from "@repo/db/client";
import type { loginBodyZodType } from "@repo/zodValidation/loginBodyZodType";

const findUserInDb = async (body: loginBodyZodType) => {
	const user = await prisma.user.findFirst({
		where: {
			email: body.email,
		},
	});
	return user;
};

export default findUserInDb;
