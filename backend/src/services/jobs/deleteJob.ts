import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobsTable } from "../../db/schema";
interface DeleteJobRequest {
	userId: number;
	id: string;
}
const deleteJob = async ({ userId, id }: DeleteJobRequest) => {
	const jobId = Number(id);
	try {
		const existingJob = await db
			.select()
			.from(jobsTable)
			.where(eq(jobsTable.id, jobId));
		if (existingJob.length === 0) {
			throw new Error("Directory not found");
		}
		const checkOwnership = await db
			.select()
			.from(jobsTable)
			.where(and(eq(jobsTable.id, jobId), eq(jobsTable.userId, userId)));
		if (checkOwnership.length === 0) {
			throw new Error("Access denied");
		}
		const result = await db
			.delete(jobsTable)
			.where(eq(jobsTable.id, jobId))
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
export default deleteJob;
