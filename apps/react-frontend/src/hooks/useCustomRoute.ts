import Game from "../components/window/Game";
import Landing from "../components/window/Landing";

export interface CustomRoute {
	id: number;
	route: string;
	element: React.FC;
}

export const useCustomRoute = (): CustomRoute[] => {
	return [
		{
			id: 1,
			route: "/",
			element: Landing,
		},

		{
			id: 2,
			route: "/game",
			element: Game,
		},
	];
};
