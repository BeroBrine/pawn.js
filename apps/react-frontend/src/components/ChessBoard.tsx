import type { Color, PieceSymbol, Square, Chess } from "chess.js";
import { type SetStateAction, useState, useId } from "react";
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

const ChessBoard = ({
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

	const renderPiece = (elem: Board) => {
		if (elem?.color === "w") {
			switch (elem?.type) {
				case "p":
					return <WhitePawn />;

				case "b":
					return <WhiteBishop />;

				case "n":
					return <WhiteKnight />;

				case "r":
					return <WhiteRook />;

				case "q":
					return <WhiteQueen />;

				case "k":
					return <WhiteKing />;
			}
		}

		switch (elem?.type) {
			case "p":
				return <BlackPawn />;

			case "b":
				return <BlackBishop />;

			case "n":
				return <BlackKnight />;

			case "r":
				return <BlackRook />;

			case "q":
				return <BlackQueen />;

			case "k":
				return <BlackKing />;
		}
	};

	console.log(chess.ascii());
	return (
		<div className="w-full">
			{board.map((row, i) => {
				return (
					<div key={useId()} className="flex w-full">
						{row.map((elem, j) => {
							//biome-ignore format:
							const squareRep = `${String.fromCharCode(97 + (j % 8))}${8 - i}` as Square;
							const divId = squareRep as string;
							return (
								<div
									id={divId}
									onKeyUp={undefined}
									onKeyDown={undefined}
									onClick={(e: React.MouseEvent<HTMLDivElement>) => {
										e.preventDefault();
										const target = e.target as HTMLDivElement;
										console.log(target.id);
										if (!from) {
											setFrom(squareRep);
										} else {
											console.log("square rep is ", squareRep);
											socket.send(
												JSON.stringify({
													type: Messages.MOVE,
													payload: {
														from,
														to: squareRep,
													},
												}),
											);
											chess.move({ from, to: squareRep });
											console.log("reached setBoard");
											if (!setBoard) return new Error("setBoard error");
											setBoard(chess.board());
											setFrom(null);
										}
									}}
									key={useId()}
									className={`${
										//biome-ignore:format
										(i + j) % 2 === 0 ? "bg-red-200" : "bg-red-300"
									} w-20 h-20 justify-center flex items-center`}
								>
									{squareRep}
									{renderPiece(elem)}
								</div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default ChessBoard;
