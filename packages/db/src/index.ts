import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import fs from "node:fs";

dotenv.config({ path: `${__dirname}/../.env` });
const client = new Client({
	user: process.env.USER ?? "",
	password: process.env.PASSWORD ?? "",
	host: process.env.HOST ?? "",
	port: 23371,
	database: process.env.DATABASE ?? "",
	ssl: {
		rejectUnauthorized: true,
		ca: fs.readFileSync(`${__dirname}/../ca.pem`).toString(),
	},
});

async function main() {
	await client.connect();
	return;
}

main();

export const db = drizzle(client);
