import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { directoryTable } from "../../db/schema";

interface GetDirectoryRequest {
	userId: number;
	paramId: number;
}
const getDirectory = async ({ userId, paramId }: GetDirectoryRequest) => {
	const directories = await db
		.select()
		.from(directoryTable)
		.where(
			and(eq(directoryTable.userId, userId), eq(directoryTable.id, paramId)),
		);
	if (directories.length === 0) {
		throw new Error("Directory not found");
	}
	return directories.map((directory) => ({
		id: directory.id,
		name: directory.name,
		createdAt: directory.createdAt.toISOString(),
		updatedAt: directory.updatedAt.toISOString(),
	}));
};
export default getDirectory;
