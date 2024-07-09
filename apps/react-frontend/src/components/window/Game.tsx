import { useEffect, useMemo, useState } from "react";
import { Chess, type PieceSymbol, type Color } from "chess.js";
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

const Game = () => {
	const chess = useMemo(() => new Chess(), []);
	const [pos, setPos] = useState(chess.fen());
	const [render, setRender] = useState<boolean>(false);
	const [orientation, setOrientation] = useState<BoardOrientation | undefined>(
		undefined,
	);
	const token = localStorage.getItem("token");
	if (!token) {
		console.log("token not found");
		return;
	}
	const { socket, loading } = useSocket();
	const navigate = useNavigate();

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
	}, [socket, chess, navigate]);

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
		<div className="h-screen p-8">
			{render ? (
				<div className="w-[400px] ">
					<Chessboard
						position={pos}
						boardOrientation={orientation}
						onPieceDrop={onDrop}
					/>
				</div>
			) : null}
			<div className="flex flex-col items-center justify-center">
				<Button
					handleClick={() => {
						socket?.emit("init_game", {
							type: Messages.INIT_GAME,
						});
					}}
				>
					Join
				</Button>

				<button
					type="button"
					onClick={() => {
						navigate("/");
					}}
					className="bg-black text-white rounded-lg m-2 p-3"
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default Game;
