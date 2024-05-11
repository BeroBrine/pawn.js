import express from "express";
import authRouter from "./routes/auth";

const app: express.Express = express();
const port = 3000;

app.use(express.json());
app.use("/auth", authRouter);

app.listen(port, () => {
	console.log(`started the server at port ${3000}`);
});
