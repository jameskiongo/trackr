import { db } from "../../db/db";
import { jobDirectoryTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";

interface GetDirectoryRequest {
  userId: number;
  paramId: number;
}
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
