import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { directoryTable } from "../db/schema";
interface DirectoryRequest {
	userId: number;
	paramId: number;
}
const directoryExists = async ({
	userId,
	paramId,
}: DirectoryRequest): Promise<boolean> => {
	const existingDirectory = await db
		.select()
		.from(directoryTable)
		.where(
			and(eq(directoryTable.id, paramId), eq(directoryTable.userId, userId)),
		);

	if (existingDirectory.length > 0) {
		return true;
	}
	return false;
};
export default directoryExists;
