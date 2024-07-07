import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

dotenv.config({ path: `${__dirname}/../.env` });

console.log(process.cwd());
console.log(process.env.DATABASE_URL);

const queryClient = postgres(process.env.DATABASE_URL ?? "");

export const db = drizzle(queryClient);
