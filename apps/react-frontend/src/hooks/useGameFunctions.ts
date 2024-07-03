import { Square } from "react-chessboard/dist/chessboard/types";
import {
	IGameFunctions,
	IGameFunctionsReturn,
} from "../libs/interfaceAndEnums";
import { Messages } from "../libs/interfaceAndEnums";

const useGameFunctions = ({
	game,
	setGame,
	socket,
}: IGameFunctions): IGameFunctionsReturn => {
	const makeAMove = (move: {
		from: Square;
		to: Square;
	}) => {
		const newGame = game.move(move);
		setGame(newGame);
	};

	const onDrop = (sourceSquare: Square, targetSquare: Square) => {
		console.log("onDrag ", sourceSquare, targetSquare);
	};

	return { onDrop };
};

export default useGameFunctions;
