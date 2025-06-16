import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobDirectoryTable } from "../../db/schema";
import type { GetDirectoryResponse } from "../../types";

const getDirectories = async (
	userId: number,
): Promise<GetDirectoryResponse[]> => {
	const directories = await db
		.select()
		.from(jobDirectoryTable)
		.where(and(eq(jobDirectoryTable.userId, userId)));
	return directories.map((directory) => ({
		id: directory.id,
		name: directory.name,
		createdAt: directory.createdAt.toISOString(),
		updatedAt: directory.updatedAt.toISOString(),
	}));
};
export default getDirectories;
