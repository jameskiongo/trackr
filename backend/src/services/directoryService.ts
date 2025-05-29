import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { jobDirectoryTable } from "../db/schema";

import { config } from "dotenv";
import { TDirectoryRequest } from "../types";

config({ path: ".env" });

const addDirectory = async ({ name, userId }: TDirectoryRequest) => {
  try {
    const existingDirectory = await db
      .select()
      .from(jobDirectoryTable)
      .where(eq(jobDirectoryTable.name, name));

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
    // throw new Error(error as string);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An error occurred while adding the directory",
    );
  }
};

export default { addDirectory };
