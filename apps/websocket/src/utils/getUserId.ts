import { verify } from "jsonwebtoken";
import type { IJwtToken } from "@repo/interfaceAndEnums/IReceivedEvents";
import * as dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });

const getUserId = (token: string) => {
	try {
		const verifiedObj = verify(
			token,
			process.env.JWT_SECRET ?? "",
		) as IJwtToken;
		return verifiedObj.userId;
	} catch (e) {
		console.log(e);
		return;
	}
};

export default getUserId;
