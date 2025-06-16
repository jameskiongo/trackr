import { and, eq } from "drizzle-orm";
import { db } from "../../db/db";
import { jobsTable } from "../../db/schema";
interface GetJobResponse {
	id: number;
	companyName: string;
	positionName: string;
	status: string;
	description: string;
	applicationUrl: string;
	createdAt: string;
	updatedAt: string;
	location: string;
}
const getJobs = async (userId: number): Promise<GetJobResponse[]> => {
	const jobs = await db
		.select()
		.from(jobsTable)
		.where(and(eq(jobsTable.userId, userId)));
	return jobs.map((job) => ({
		id: job.id,
		companyName: job.companyName || "",
		positionName: job.positionName || "",
		status: job.status,
		description: job.description || "",
		directoryId: job.directoryId,
		applicationUrl: job.applicationUrl,
		location: job.location || "",
		createdAt: job.createdAt.toISOString(),
		updatedAt: job.updatedAt.toISOString(),
	}));
};
export default getJobs;
