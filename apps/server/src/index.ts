import express from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: express.Express = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
	console.log("setting the heaers");
	res.header("Access-Control-Allow-Origin", "http://localhost:7173");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin , X-Requested-With , Content-Type, Accept",
	);
	next();
});

app.use("/auth", authRouter);

app.listen(port, () => {
	console.log(`started the server at port ${3000}`);
});
