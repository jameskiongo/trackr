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

export const jobDirectoryTable = pgTable("jobDirectoryTable", {
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
		.references(() => jobDirectoryTable.id, { onDelete: "cascade" }),
	userId: integer("userId")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: timestamp("createdAt").notNull().defaultNow(),
	updatedAt: timestamp("updatedAt")
		.notNull()
		.$onUpdate(() => new Date()),
});

/** * Define relations for the tables
User to Job Directory relation */
// export const users_to_directory
