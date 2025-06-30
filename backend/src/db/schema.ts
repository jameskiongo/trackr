import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
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

export const directoryTable = pgTable(
	"directoryTable",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull().unique(),
		userId: integer("userId")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt")
			.notNull()
			.$onUpdate(() => new Date()),
	},
	// Udemy can be present in both user 1 and 2
	(t) => [unique().on(t.userId, t.name)],
);

export const jobsTable = pgTable(
	"jobsTable",
	{
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
	},
	// the constraint is where an the same applicationUrl can be present in both directory 1 and directory 2
	(t) => [unique().on(t.directoryId, t.applicationUrl)],
);

/** * Define relations for the tables
User to  Directory relation */
export const userToDirectoryRelations = relations(usersTable, ({ many }) => ({
	directories: many(directoryTable),
}));

export const directoryToUserRelations = relations(
	directoryTable,
	({ one }) => ({
		user: one(usersTable, {
			fields: [directoryTable.userId],
			references: [usersTable.id],
		}),
	}),
);

/** Directory to job relation */
export const directoryToJobsRelations = relations(
	directoryTable,
	({ many }) => ({
		jobs: many(jobsTable),
	}),
);

export const jobToDirectoryRelations = relations(jobsTable, ({ one }) => ({
	directory: one(directoryTable, {
		fields: [jobsTable.directoryId],
		references: [directoryTable.id],
	}),
}));
/** User to Jobs relation */
export const userToJobsRelations = relations(usersTable, ({ many }) => ({
	jobs: many(jobsTable),
}));
export const jobToUserRelations = relations(jobsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [jobsTable.userId],
		references: [usersTable.id],
	}),
}));
