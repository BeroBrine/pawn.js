import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import "dotenv/config";

export default defineConfig({
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dialect: "postgresql",

	dbCredentials: {
		user: process.env.USER ?? "",
		password: process.env.PASSWORD ?? "",
		host: (process.env.HOST as string) ?? "",
		port: 23371,
		database: (process.env.DATABASE as string) ?? "",
		ssl: {
			rejectUnauthorized: true,
			ca: fs.readFileSync(`${__dirname}/ca.pem`).toString(),
		},
	},

	// dbCredentials: {
	//   user: "avnadmin",
	//   password: "AVNS_smxDbBtKUBEygUN7Yx6",
	//   host: "pg-2671a67f-abhishekrana8818-3277.b.aivencloud.com",
	//   port: 23371,
	//   database: "website_db",
	//   ssl: {
	//     rejectUnauthorized: true,
	//     ca: fs.readFileSync(`${__dirname}/ca.pem`).toString(),
	//   },
	// },
});
