import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobDirectoryTable } from "../../db/schema";

interface GetDirectoryRequest {
	userId: number;
	paramId: number;
}
//PERF: Return the jobs under the directory id
const getDirectory = async ({ userId, paramId }: GetDirectoryRequest) => {
	const directories = await db
		.select()
		.from(jobDirectoryTable)
		.where(
			and(
				eq(jobDirectoryTable.userId, userId),
				eq(jobDirectoryTable.id, paramId),
			),
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
