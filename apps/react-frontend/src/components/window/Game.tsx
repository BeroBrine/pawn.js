import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Button from "../Button";
import { useSocket } from "../../hooks/useSockets";
import { Chessboard } from "react-chessboard";
import { Messages } from "@repo/interfaceAndEnums/Messages";
import type {
	BoardOrientation,
	Square,
} from "react-chessboard/dist/chessboard/types";

const Game = () => {
	const [chess, setChess] = useState(new Chess());
	const [board, setBoard] = useState(chess.board());
	const [render, setRender] = useState<boolean>(false);
	const [orientation, setOrientation] = useState<BoardOrientation | undefined>(
		undefined,
	);
	const { socket, loading } = useSocket();

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

		const result = chess.move({ from: from, to: to });
		console.log("on drop turn before setting the board is ", chess.turn());
		setBoard(chess.board());
		console.log("on drop turn now is ", chess.turn());
		return true;
	};

	useEffect(() => {
		socket?.on("init_game", (data) => {
			console.log("inside init game");
			if (data.payload.color === "b") setOrientation("black");
			else setOrientation("white");
			setRender(true);
		});

		socket?.on("move", (data) => {
			console.log("move");
			const { to, from } = data.payload.move;
			const result = chess.move({ to: to, from: from });
			console.log(result);

			console.log("on move turn before setting the board is ", chess.turn());
			setBoard(chess.board());
			console.log("on move turn now is ", chess.turn());
		});

		socket?.on("game_over", (data) => {
			console.log("game over");
		});
	}, [chess, socket]);
	// TODO: cleanup fn

	console.log(loading);
	if (loading)
		return (
			<div className="bg-white text-4xl font-bold flex h-screen justify-center items-center">
				loading...
			</div>
		);
	if (!socket) return;
	console.log("render is ", render);
	return (
		<div className="h-screen p-8">
			{render && board ? (
				<div className="w-[400px] ">
					<Chessboard
						position={chess.fen()}
						boardOrientation={orientation}
						onPieceDrop={onDrop}
					/>
				</div>
			) : null}
			<div className="flex items-center justify-center">
				<Button
					handleClick={() => {
						socket?.emit("init_game", {
							type: Messages.INIT_GAME,
						});
					}}
				>
					Join
				</Button>
			</div>
		</div>
	);
};

export default Game;
