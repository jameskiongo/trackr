ALTER TABLE "jobs_table" RENAME COLUMN "application_url" TO "applicationUrl";--> statement-breakpoint
ALTER TABLE "jobs_table" DROP CONSTRAINT "jobs_table_application_url_unique";--> statement-breakpoint
ALTER TABLE "jobs_table" ADD CONSTRAINT "jobs_table_applicationUrl_unique" UNIQUE("applicationUrl");