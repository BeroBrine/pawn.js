import express from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: express.Express = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use(
	cors({
		credentials: true,
		origin: "http://localhost:7173",
	}),
);

app.listen(port, () => {
	console.log(`started the server at port ${3000}`);
});
