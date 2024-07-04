import type { Socket as socket } from "socket.io";
import type { Socket as clSocket } from "socket.io-client";
import type { Move } from "chess.js";
import type { dbUserZodType } from "@repo/zodValidation/dbUserZodType";

export interface IReceivedEvents {
	basicEmit: (emit: string, callback: (e: number) => void) => void;
	init_game: (data: {
		// the logic is written in such a way that it
		// conditonally checks on init_game that if it is a move or init game.
		type: Messages.INIT_GAME;
	}) => void;
	userid: (data: {
		type: Messages.USER_DATA;
		payload: {
			userid: string;
		};
	}) => void;
	move: (data: {
		type: Messages.MOVE;
		payload: {
			move: {
				from: string;
				to: string;
			};
		};
	}) => void;
}

export interface ISentEvents {
	sendGameToDb: () => void;
	userid: (data: {
		type: Messages.USER_DATA;
		payload: {
			userid: string;
		};
	}) => void;
	init_game: (data: {
		type: Messages.INIT_GAME;
		payload: {
			color: string;
		};
	}) => void;
	move: (data: {
		type: Messages.MOVE;
		payload: {
			move: {
				from: string;
				to: string;
			};
			moveHistory: Move[];

			turn: "white" | "black";
		};
	}) => void;
	game_over: (data: {
		type: Messages.GAME_OVER;
		payload: {
			winner: "white" | "black";
		};
	}) => void;
}

export type Socket = socket<IReceivedEvents, ISentEvents>;
export type clientSocket = clSocket<ISentEvents, IReceivedEvents>;

// express  socket
export interface IExpressSendEvents {
	setUserData: (data: dbUserZodType) => void;
}

export interface IExpressReceiveEvents {
	getUserData: () => void;
}

export type ExpressSocket = socket<IExpressReceiveEvents, IExpressSendEvents>;

export type ClientExpressSocket = clSocket<
	IExpressSendEvents,
	IExpressReceiveEvents
>;

// enums
export enum Messages {
	INIT_GAME = "init_game",
	MOVE = "move",
	GAME_OVER = "game_over",
	USER_DATA = "userdata",
}

export enum Colors {
	WHITE = "w",
	BLACK = "b",
}

export type TMessage = {
	type: string;
	payload: { from: string; to: string };
};

export enum STATUS_CODES {
	OK = 200,
	UNAUTH = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	SERVER_ERROR = 500,
}
