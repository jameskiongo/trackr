CREATE TYPE "public"."status" AS ENUM('bookmarked', 'applied', 'rejected', 'ghosted', 'interviewing', 'offered', 'accepted');--> statement-breakpoint
CREATE TABLE "directoryTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "directoryTable_name_userId_unique" UNIQUE("userId","name")
);
--> statement-breakpoint
CREATE TABLE "jobsTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"companyName" text,
	"positionName" text,
	"location" text,
	"description" text,
	"applicationUrl" text NOT NULL,
	"status" "status" DEFAULT 'bookmarked' NOT NULL,
	"directoryId" integer NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "jobsTable_directoryId_applicationUrl_unique" UNIQUE("directoryId","applicationUrl")
);
--> statement-breakpoint
CREATE TABLE "usersTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "usersTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "directoryTable" ADD CONSTRAINT "directoryTable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobsTable" ADD CONSTRAINT "jobsTable_directoryId_directoryTable_id_fk" FOREIGN KEY ("directoryId") REFERENCES "public"."directoryTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobsTable" ADD CONSTRAINT "jobsTable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;