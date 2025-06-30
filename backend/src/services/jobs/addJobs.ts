import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { directoryTable, jobsTable } from "../../db/schema";

export interface AddJob {
	companyName: string;
	positionName: string;
	status:
		| "bookmarked"
		| "applied"
		| "rejected"
		| "ghosted"
		| "interviewing"
		| "offered"
		| "accepted";
	description: string;
	applicationUrl: string;
	location: string;
}

const addJob = async (data: AddJob, userId: number, paramId: number) => {
	const existingDirectory = await db
		.select()
		.from(directoryTable)
		.where(eq(directoryTable.id, paramId));
	if (existingDirectory.length === 0) {
		throw new Error("Directory does not exist");
	}

	const directoryOwner = await db
		.select()
		.from(directoryTable)
		.where(
			and(eq(directoryTable.id, paramId), eq(directoryTable.userId, userId)),
		);
	if (directoryOwner.length === 0) {
		throw new Error("You are not authorized");
	}

	const existingUrl = await db
		.select()
		.from(jobsTable)
		.where(
			and(
				eq(jobsTable.applicationUrl, data.applicationUrl),
				eq(jobsTable.userId, userId),
				eq(jobsTable.directoryId, paramId),
			),
		);
	if (existingUrl.length > 0) {
		throw new Error("Job with this application URL already exists");
	}
	const newJob = {
		companyName: data.companyName,
		positionName: data.positionName,
		status: data.status,
		description: data.description,
		applicationUrl: data.applicationUrl,
		location: data.location,
		directoryId: paramId,
		userId: userId,
	};

	const results = await db.insert(jobsTable).values(newJob).returning();
	if (results.length === 0) {
		throw new Error("Failed to add job");
	}
	return {
		id: results[0].id,
		companyName: results[0].companyName || "",
		positionName: results[0].positionName || "",
		status: results[0].status,
		description: results[0].description || "",
		applicationUrl: results[0].applicationUrl,
		directoryId: results[0].directoryId,
		location: results[0].location || "",
		createdAt: results[0].createdAt.toISOString(),
		updatedAt: results[0].updatedAt.toISOString(),
	};
};
export default addJob;
