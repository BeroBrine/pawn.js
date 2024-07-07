import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

console.log(process.env.DATABASE_URL);
const migrationClient = postgres(process.env.DATABASE_URL ?? "", { max: 1 });
migrate(drizzle(migrationClient), {
	migrationsFolder: "./src/drizzle/migrations",
});
