import prisma from "@repo/db/client";
import type { loginBodyZodType } from "@repo/zodValidation/loginBodyZodType";

const findUserInDb = async (body: loginBodyZodType) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});
		return user;
	} catch (e) {
		console.log(e);
		throw new Error("error while finding user");
	}
};

export default findUserInDb;
