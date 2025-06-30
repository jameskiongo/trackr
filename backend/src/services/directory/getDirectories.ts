import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { directoryTable } from "../../db/schema";
import type { GetDirectoryResponse } from "../../types";

const getDirectories = async (
	userId: number,
): Promise<GetDirectoryResponse[]> => {
	const directories = await db
		.select()
		.from(directoryTable)
		.where(and(eq(directoryTable.userId, userId)));
	return directories.map((directory) => ({
		id: directory.id,
		name: directory.name,
		createdAt: directory.createdAt.toISOString(),
		updatedAt: directory.updatedAt.toISOString(),
	}));
};
export default getDirectories;
