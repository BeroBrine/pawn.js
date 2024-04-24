import { Route, Routes } from "react-router-dom";
import { useCustomRoute } from "./hooks/useCustomRoute";

function App() {
	const customRoute = useCustomRoute();
	return (
		<div className="bg-slate-700">
			<Routes>
				{customRoute.map((route) => {
					return (
						<Route
							key={route.id}
							path={route.route}
							element={<route.element />}
						/>
					);
				})}
			</Routes>
		</div>
	);
}
export default App;
