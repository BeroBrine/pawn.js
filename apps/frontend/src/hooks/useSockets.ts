import { useEffect, useState } from "react";

const url = "ws://localhost:7777";

export const useSocket = () => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [loading, setLoading] = useState(true);
	console.log(url);
	if (!url) throw new Error("web sock url failed");
	useEffect(() => {
		const ws = new WebSocket(url, "echo-protocol");
		ws.onopen = () => {
			console.log("opening");
			setSocket(ws);
			setLoading(false);
		};

		ws.onclose = () => {
			console.log("closing");
			setSocket(null);

			setLoading(true);
		};
		return () => {
			ws.close();
		};
	}, []);

	return { socket, loading };
};
