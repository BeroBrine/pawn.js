import { Color, PieceSymbol, Square } from "chess.js";
import React, { useState } from "react";
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
}: { chess: any; setBoard: any; board: Board[][]; socket: WebSocket }) => {
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
					<div key={i} className="flex w-full">
						{row.map((elem, j) => {
							const squareRep = (String.fromCharCode(97 + (j % 8)) +
								"" +
								(8 - i)) as Square;
							const divId = squareRep as string;
							return (
								<div
									id={divId}
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
											setBoard(chess.board());
											setFrom(null);
										}
									}}
									key={j}
									className={`${
										// biome-ignore format
										(i + j) % 2 === 0 ? "bg-red-200" : "bg-red-300"
									} w-20 h-20 justify-center flex items-center`}
								>
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
