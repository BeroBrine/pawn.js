import type { clientSocket } from "@repo/interfaceAndEnums/IReceivedEvents";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const url = "ws://localhost:7777";

export const useSocket = () => {
	const [socket, setSocket] = useState<clientSocket | null>(null);
	const [loading, setLoading] = useState(true);
	console.log(url);
	if (!url) throw new Error("web sock url failed");
	useEffect(() => {
		const socket = io(url) as clientSocket;
		socket.on("connect", () => {
			setSocket(socket);
			setLoading(false);
		});
		socket.on("disconnect", () => {
			setSocket(null);
			setLoading(true);
		});
		return () => {
			socket.close();
		};
	}, []);

	return { socket, loading };
};
