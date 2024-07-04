import type { ClientExpressSocket } from "@repo/interfaceAndEnums/IReceivedEvents";
import { io } from "socket.io-client";
const expressSocket = io("http://localhost:3000") as ClientExpressSocket;

const useExpressSocket = () => {
	return expressSocket;
};

export default useExpressSocket;
