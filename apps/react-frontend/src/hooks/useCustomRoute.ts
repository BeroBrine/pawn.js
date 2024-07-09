import Game from "../components/window/Game";
import LandingPage from "../components/window/LandingPage";
import Login from "../components/window/Login";
import SignUp from "../components/window/SignUp";

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

		{
			id: 3,
			route: "/signup",
			element: SignUp,
		},

		{
			id: 4,
			route: "/",
			element: LandingPage,
		},
	];
};
