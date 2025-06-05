import { db } from "../db/db";
import { jobDirectoryTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
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
    .from(jobDirectoryTable)
    .where(
      and(
        eq(jobDirectoryTable.id, paramId),
        eq(jobDirectoryTable.userId, userId),
      ),
    );

  if (existingDirectory.length > 0) {
    return true;
  }
  return false;
};
export default directoryExists;
