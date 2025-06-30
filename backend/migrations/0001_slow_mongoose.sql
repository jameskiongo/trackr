ALTER TABLE "jobDirectoryTable" RENAME TO "directoryTable";--> statement-breakpoint
ALTER TABLE "directoryTable" DROP CONSTRAINT "jobDirectoryTable_name_unique";--> statement-breakpoint
ALTER TABLE "directoryTable" DROP CONSTRAINT "jobDirectoryTable_userId_usersTable_id_fk";
--> statement-breakpoint
ALTER TABLE "jobsTable" DROP CONSTRAINT "jobsTable_directoryId_jobDirectoryTable_id_fk";
--> statement-breakpoint
ALTER TABLE "directoryTable" ADD CONSTRAINT "directoryTable_userId_usersTable_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobsTable" ADD CONSTRAINT "jobsTable_directoryId_directoryTable_id_fk" FOREIGN KEY ("directoryId") REFERENCES "public"."directoryTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "directoryTable" ADD CONSTRAINT "directoryTable_name_unique" UNIQUE("name");