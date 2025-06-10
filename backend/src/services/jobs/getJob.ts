import { db } from "../../db/db";
import { jobsTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";

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
interface GetJobRequest {
  userId: number;
  paramId: number;
}

const getJob = async ({
  userId,
  paramId,
}: GetJobRequest): Promise<GetJobResponse[]> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(and(and(eq(jobsTable.userId, userId), eq(jobsTable.id, paramId))));
  if (jobs.length === 0) {
    throw new Error("Not found");
  }
  return jobs.map((job) => ({
    id: job.id,
    companyName: job.companyName || "",
    positionName: job.positionName || "",
    status: job.status,
    description: job.description || "",
    applicationUrl: job.applicationUrl,
    location: job.location || "",
    directoryId: job.directoryId,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));
};
export default getJob;
