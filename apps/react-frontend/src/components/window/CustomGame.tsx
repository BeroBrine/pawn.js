import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import Button from "../Button";
import { useSocket } from "../../hooks/useSockets";
import { Chessboard } from "react-chessboard";
import { Messages } from "@repo/interfaceAndEnums/Messages";
import type {
	BoardOrientation,
	Square,
} from "react-chessboard/dist/chessboard/types";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CustomGame = () => {
	const chess = useMemo(() => new Chess(), []);
	const [pos, setPos] = useState(chess.fen());
	const [render, setRender] = useState<boolean>(false);
	const [orientation, setOrientation] = useState<BoardOrientation | undefined>(
		undefined,
	);
	const param = useParams();
	console.log(param);
	const { dbId } = useParams();
	const token = localStorage.getItem("token");
	if (!token) {
		console.log("token not found");
		return;
	}
	const { socket, loading } = useSocket();
	const navigate = useNavigate();
	// TODO: Rememeber to uncomment this.
	useEffect(() => {
		(async () => {
			try {
				const axiosData = await useAxios({
					url: "http://localhost:3000/auth/loggedIn",
					method: "POST",
					axiosHeaders: {
						headers: {
							withAuthorization: true,
							Authorization: `token ${token}`,
						},
					},
				});
			} catch (e) {
				alert("please login");
				navigate("/login");
			}
		})();
	}, [navigate, token]);

	useEffect(() => {
		if (!dbId) {
			console.log("no db id");
			return;
		}
		socket?.emit("custom_game", dbId);
		socket?.on("init_game", (data) => {
			console.log("inside init game");
			if (data.payload.color === "b") setOrientation("black");
			else setOrientation("white");
			chess.reset();
			setPos(chess.fen());
			setRender(true);
		});

		socket?.on("move", (data) => {
			console.log("move");
			const { to, from } = data.payload.move;
			const result = chess.move({ to: to, from: from });
			console.log(result);
			setPos(chess.fen());
			console.log("on move turn before setting the board is ", chess?.turn());
			console.log("on move turn now is ", chess?.turn());
		});

		socket?.on("playerDisconnect", () => {
			alert("opponent has left the game");
			setRender(false);
		});

		socket?.on("game_over", (data) => {
			alert(`game over ${data.payload.winner} is the winner`);
			setRender(false);
			navigate("/");
		});
	}, [socket, chess, navigate, dbId]);

	const onDrop = (from: Square, to: Square) => {
		socket?.emit("move", {
			type: Messages.MOVE,
			payload: {
				move: {
					from: from,
					to: to,
				},
			},
		});

		chess?.move({ from: from, to: to });
		setPos(chess.fen());
		console.log("on drop turn before setting the board is ", chess?.turn());
		console.log("on drop turn now is ", chess?.turn());
		return true;
	};

	if (loading)
		return (
			<div className="bg-white text-4xl font-bold flex h-screen justify-center items-center">
				loading...
			</div>
		);
	if (!socket) return;
	return (
		<div className="h-screen p-8 flex justify-center items-center">
			{!render ? <div className="text-8xl text-white">WAITING.....</div> : null}
			{render ? (
				<div className="w-[400px] ">
					<Chessboard
						position={pos}
						boardOrientation={orientation}
						onPieceDrop={onDrop}
					/>
				</div>
			) : null}
		</div>
	);
};

export default CustomGame;
