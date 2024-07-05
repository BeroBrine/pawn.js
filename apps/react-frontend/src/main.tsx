import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");

//@ts-ignore
ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
