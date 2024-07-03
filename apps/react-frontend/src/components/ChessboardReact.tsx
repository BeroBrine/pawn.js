import type { Color, PieceSymbol, Square, Chess } from "chess.js";
import { type SetStateAction, useState, useId, useEffect } from "react";
import { ChessBoard } from "chessboard-ts";
import { Messages } from "./window/Game";
import {
	BlackBishop,
	BlackKing,
	BlackKnight,
	BlackPawn,
	BlackQueen,
	BlackRook,
} from "../assets/chessPieces/black";
import {
	WhiteBishop,
	WhiteKing,
	WhiteKnight,
	WhitePawn,
	WhiteQueen,
	WhiteRook,
} from "../assets/chessPieces/white";

type Board = {
	square: Square;
	type: PieceSymbol;
	color: Color;
} | null;

const ChessboardReact = ({
	chess,
	setBoard,
	board,
	socket,
}: {
	chess: Chess;
	setBoard: React.Dispatch<SetStateAction<(Board | null)[][]>>;
	board: Board[][];
	socket: WebSocket;
}) => {
	const [from, setFrom] = useState<Square | null>(null);

	useEffect(() => {
		const chessboard = new ChessBoard({
			selector: "board",
			config: {
				position: "start",
				draggable: true,
				onDragStart: dragStart,
			},
		});
	}, []);

	return <div id="board" className="w-[400px]"></div>;
};

export default ChessboardReact;
