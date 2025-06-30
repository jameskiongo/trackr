import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../../db/schema";

const sql = neon(String(process.env.DATABASE_URL));

const db = drizzle(sql, { schema });

export const testDirectory = async () => {
	const job = await db.query.jobDirectoryTable.findFirst({});
	console.log(job);
};
