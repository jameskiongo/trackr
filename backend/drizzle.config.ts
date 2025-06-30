import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const databaseUrl = String(process.env.DATABASE_URL);

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
