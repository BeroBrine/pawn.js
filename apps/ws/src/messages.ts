export enum Messages {
	INIT_GAME = "init_game",
	MOVE = "move",
	GAME_OVER = "game_over",
}

export enum Colors {
	WHITE = "w",
	BLACK = "b",
}

export type message = {
	type: string;
	payload: { from: string; to: string };
};
