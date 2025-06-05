ALTER TABLE "jobs_table" ALTER COLUMN "company_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs_table" ALTER COLUMN "position_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs_table" ALTER COLUMN "status" SET DEFAULT 'bookmarked';--> statement-breakpoint
ALTER TABLE "jobs_table" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "jobs_table" ADD COLUMN "description" text;