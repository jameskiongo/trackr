import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobDirectoryTable } from "../../db/schema";
import type { TDirectoryRequest } from "../../types";
const addDirectory = async ({ name, userId }: TDirectoryRequest) => {
	try {
		const existingDirectory = await db
			.select()
			.from(jobDirectoryTable)
			.where(
				and(
					eq(jobDirectoryTable.name, name),
					eq(jobDirectoryTable.userId, userId),
				),
			);

		if (existingDirectory.length > 0) {
			throw new Error("Directory already exists");
		}
		const newDirectory = {
			name,
			userId,
		};

		const result = await db
			.insert(jobDirectoryTable)
			.values(newDirectory)
			.returning();

		if (result.length === 0) {
			throw new Error("Failed to add directory");
		}

		return {
			id: result[0].id,
			name: result[0].name,
		};
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An error occurred while adding the directory",
		);
	}
};
export default addDirectory;
