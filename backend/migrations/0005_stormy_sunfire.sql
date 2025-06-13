ALTER TABLE "job_directory_table" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "jobs_table" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "job_directory_table" DROP CONSTRAINT "job_directory_table_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs_table" DROP CONSTRAINT "jobs_table_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "job_directory_table" ADD CONSTRAINT "job_directory_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_table" ADD CONSTRAINT "jobs_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;