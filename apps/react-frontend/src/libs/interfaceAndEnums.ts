import type { Piece, Square } from "react-chessboard/dist/chessboard/types";
import type { Chess } from "chess.js";

export interface IGameFunctions {
	game: Chess;
	setGame: React.Dispatch<React.SetStateAction<Chess>>;
	socket: WebSocket;
}

export interface IGameFunctionsReturn {
	onDrop: (
		sourceSquare: Square,
		targetSquare: Square,
		Piece?: Piece,
	) => boolean;
}

export interface ISocket {
	type: string;
	data: {
		move: {
			from: Square;
			to: Square;
		};
	};
}
