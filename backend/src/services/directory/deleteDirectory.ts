import { db } from "../../db/db";
import { jobDirectoryTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";
interface DeleteDirectoryRequest {
  userId: number;
  id: string;
}
const deleteDirectory = async ({ userId, id }: DeleteDirectoryRequest) => {
  const directoryId = Number(id);
  try {
    const existingDirectory = await db
      .select()
      .from(jobDirectoryTable)
      .where(eq(jobDirectoryTable.id, directoryId));
    if (existingDirectory.length === 0) {
      throw new Error("Directory not found");
    }
    const checkOwnership = await db
      .select()
      .from(jobDirectoryTable)
      .where(
        and(
          eq(jobDirectoryTable.id, directoryId),
          eq(jobDirectoryTable.userId, userId),
        ),
      );
    if (checkOwnership.length === 0) {
      throw new Error("Access denied");
    }
    const result = await db
      .delete(jobDirectoryTable)
      .where(eq(jobDirectoryTable.id, directoryId))
      .returning();
    if (result.length === 0) {
      throw new Error("Failed to delete directory");
    }
    return {
      message: "Directory deleted successfully",
    };
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred while editing the directory",
    );
  }
};
export default deleteDirectory;
