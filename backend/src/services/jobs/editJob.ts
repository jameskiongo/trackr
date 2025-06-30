import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { directoryTable } from "../../db/schema";
import type { EditDirectoryRequest } from "../../types";
const editJob = async ({ userId, name, id }: EditDirectoryRequest) => {
	const paramId = Number(id);
	try {
		const existingDirectory = await db
			.select()
			.from(directoryTable)
			.where(eq(directoryTable.id, paramId));
		if (existingDirectory.length === 0) {
			throw new Error("Directory not found");
		}
		const checkUser = await db
			.select()
			.from(directoryTable)
			.where(
				and(eq(directoryTable.id, paramId), eq(directoryTable.userId, userId)),
			);
		console.log(checkUser);
		if (checkUser.length === 0) {
			throw new Error("You are not authorized to edit");
		}
		const existingName = await db
			.select()
			.from(directoryTable)
			.where(
				and(eq(directoryTable.name, name), eq(directoryTable.userId, userId)),
			);
		if (existingName.length > 0) {
			throw new Error("Directory with this name already exists");
		}
		const updateDirectory = {
			name,
			userId,
		};

		const result = await db
			.update(directoryTable)
			.set(updateDirectory)
			.where(eq(directoryTable.id, paramId))
			.returning();

		if (result.length === 0) {
			throw new Error("Failed to add directory");
		}

		return {
			id: result[0].id,
			name: result[0].name,
			updatedAt: result[0].updatedAt.toISOString(),
		};
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An error occurred while editing the directory",
		);
	}
};
export default editJob;
