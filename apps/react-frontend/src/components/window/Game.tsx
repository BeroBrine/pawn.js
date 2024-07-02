import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import Button from "../Button";
import { useSocket } from "../../hooks/useSockets";
import ChessBoard from "../ChessBoard";

// TODO: Monorepofy this
export enum Messages {
	INIT_GAME = "init_game",
	MOVE = "move",
	GAME_OVER = "game_over",
}

const Game = () => {
	const chess = new Chess();
	const [board, setBoard] = useState(chess.board());
	const { socket, loading } = useSocket();

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log(message.type);
			switch (message.type) {
				case Messages.INIT_GAME: {
					const newChess = new Chess();
					setBoard(newChess.board());
					break;
				}
				case Messages.MOVE: {
					const move = message.payload;
					console.log(move.move);
					const { to, from } = move.move;

					chess.move({ to: to, from: from });
					setBoard(chess.board());
					break;
				}
				case Messages.GAME_OVER: {
					console.log("game over");
					break;
				}
				default:
					break;
			}
		};
	}, [socket, board]);

	// TODO: cleanup fn

	console.log(loading);
	if (loading)
		return (
			<div className="bg-white text-4xl font-bold flex h-screen justify-center items-center">
				loading...
			</div>
		);
	if (!socket) return;
	return (
		<div className="h-fit p-8">
			<div className="w-1/2">
				<ChessBoard
					chess={chess}
					setBoard={setBoard}
					socket={socket}
					board={board}
				/>
			</div>

			<div className="flex items-center justify-center">
				<Button
					handleClick={() => {
						socket?.send(
							JSON.stringify({
								type: Messages.INIT_GAME,
							}),
						);
					}}
				>
					Join
				</Button>
			</div>
		</div>
	);
};

export default Game;
