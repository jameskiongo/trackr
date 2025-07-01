import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobsTable } from "../../db/schema";
import type { EditJob } from "../../types";
const editJob = async (data: EditJob, userId: number, paramId: number) => {
	if (!data) {
		throw new Error("Data is required to edit a job");
	}
	try {
		const job = await db
			.select()
			.from(jobsTable)
			.where(eq(jobsTable.id, paramId));
		if (job.length === 0) {
			throw new Error("Job not found");
		}
		if (job[0].userId !== userId) {
			throw new Error("You are not authorized to edit this job");
		}
		if (
			data.applicationUrl &&
			data.applicationUrl.length > 0 &&
			data.applicationUrl !== job[0].applicationUrl
		) {
			const existingUrl = await db
				.select()
				.from(jobsTable)
				.where(
					and(
						eq(jobsTable.applicationUrl, data.applicationUrl),
						eq(jobsTable.userId, userId),
						eq(jobsTable.directoryId, job[0].directoryId),
					),
				);
			if (existingUrl.length > 0) {
				throw new Error("Job with this Url already exists");
			}
		}
		const updateJob = {
			companyName: data.companyName,
			positionName: data.positionName,
			status: data.status,
			description: data.description,
			applicationUrl: data.applicationUrl,
			location: data.location,
		};

		const result = await db
			.update(jobsTable)
			.set(updateJob)
			.where(eq(jobsTable.id, paramId))
			.returning();

		if (result.length === 0) {
			throw new Error("Failed to add job");
		}

		return {
			id: result[0].id,
			name: result[0].companyName || "",
			positionName: result[0].positionName || "",
			status: result[0].status,
			description: result[0].description || "",
			applicationUrl: result[0].applicationUrl,
			directoryId: result[0].directoryId,
			location: result[0].location || "",
			updatedAt: result[0].updatedAt.toISOString(),
		};
	} catch (error) {
		throw new Error(
			error instanceof Error
				? error.message
				: "An error occurred while editing the job",
		);
	}
};
export default editJob;
