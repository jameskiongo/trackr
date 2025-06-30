import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
	"bookmarked",
	"applied",
	"rejected",
	"ghosted",
	"interviewing",
	"offered",
	"accepted",
]);

export const usersTable = pgTable("usersTable", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	password: text("password").notNull(),
	email: text("email").notNull().unique(),
});

export const directoryTable = pgTable("directoryTable", {
	id: serial("id").primaryKey(),
	name: text("name").notNull().unique(),
	userId: integer("userId")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
		.notNull()
		.$onUpdate(() => new Date()),
});

export const jobsTable = pgTable("jobsTable", {
	id: serial("id").primaryKey(),
	companyName: text("companyName"),
	positionName: text("positionName"),
	location: text("location"),
	description: text("description"),
	applicationUrl: text("applicationUrl").notNull().unique(),
	status: statusEnum("status").notNull().default("bookmarked"),
	directoryId: integer("directoryId")
		.notNull()
		.references(() => directoryTable.id, { onDelete: "cascade" }),
	userId: integer("userId")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
		.notNull()
		.$onUpdate(() => new Date()),
});

/** * Define relations for the tables
User to  Directory relation */
export const user_to_directory_relations = relations(
	usersTable,
	({ many }) => ({
		directories: many(directoryTable),
	}),
);

export const directory_to_user_relations = relations(
	directoryTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [directoryTable.userId],
			references: [usersTable.id],
		}),
	}),
);

/** Directory to job relation */
export const directory_to_jobs_relations = relations(
	directoryTable,
	({ many }) => ({
		jobs: many(jobsTable),
	}),
);

export const job_to_directory_relations = relations(jobsTable, ({ one }) => ({
	directory: one(directoryTable, {
		fields: [jobsTable.directoryId],
		references: [directoryTable.id],
	}),
}));
