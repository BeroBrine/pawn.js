import Game from "../components/window/Game";
import Login from "../components/window/Login";
import Landing from "../components/window/Login";

export interface CustomRoute {
	id: number;
	route: string;
	element: React.FC;
}

export const useCustomRoute = (): CustomRoute[] => {
	return [
		{
			id: 1,
			route: "/login",
			element: Login,
		},

		{
			id: 2,
			route: "/game",
			element: Game,
		},
	];
};
