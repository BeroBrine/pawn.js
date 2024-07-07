import { defineConfig } from "drizzle-kit";
import "dotenv/config";

console.log(process.env.DATABASE_URL);

export default defineConfig({
	schema: "./src/drizzle/schema.ts",
	out: "./src/drizzle/migrations",
	dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
});
