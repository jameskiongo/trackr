import { db } from "../../db/db";
import { jobsTable } from "../../db/schema";
import { and, eq } from "drizzle-orm";
interface GetJobResponse {
  id: number;
  company_name: string;
  position_name: string;
  status: string;
  description: string;
  application_url: string;
  createdAt: string;
  updatedAt: string;
  location: string;
}
const getJobs = async (userId: number): Promise<GetJobResponse[]> => {
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(and(eq(jobsTable.userId, userId)));
  if (jobs.length === 0) {
    throw new Error("No jobs found");
  }
  return jobs.map((job) => ({
    id: job.id,
    company_name: job.company_name || "",
    position_name: job.position_name || "",
    status: job.status,
    description: job.description || "",
    application_url: job.application_url,
    location: job.location || "",
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }));
};
export default getJobs;
