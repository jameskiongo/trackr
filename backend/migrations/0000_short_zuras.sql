CREATE TYPE "public"."status" AS ENUM('bookmarked', 'applied', 'rejected', 'ghosted', 'interviewing', 'offered', 'accepted');--> statement-breakpoint
CREATE TABLE "job_directory_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "job_directory_table_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jobs_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"position_name" text NOT NULL,
	"application_url" text NOT NULL,
	"status" "status" NOT NULL,
	"directory_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "jobs_table_application_url_unique" UNIQUE("application_url")
);
--> statement-breakpoint
CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "job_directory_table" ADD CONSTRAINT "job_directory_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_table" ADD CONSTRAINT "jobs_table_directory_id_job_directory_table_id_fk" FOREIGN KEY ("directory_id") REFERENCES "public"."job_directory_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_table" ADD CONSTRAINT "jobs_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
