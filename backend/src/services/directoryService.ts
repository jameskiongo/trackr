import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { jobDirectoryTable } from "../db/schema";
import { config } from "dotenv";
import { GetDirectoryResponse, TDirectoryRequest } from "../types";

config({ path: ".env" });

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

export default { addDirectory, getDirectories };
