import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  pgEnum,
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

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

export const userJobRelation = relations(usersTable, ({ many }) => ({
  jobDirectoryTable: many(jobDirectoryTable),
}));

export const jobDirectoryTable = pgTable("job_directory_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const directoryUserRelation = relations(
  jobDirectoryTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [jobDirectoryTable.userId],
      references: [usersTable.id],
    }),
  }),
);

export const directoryRelation = relations(jobDirectoryTable, ({ many }) => ({
  jobsTable: many(jobsTable),
}));

export const jobsTable = pgTable("jobs_table", {
  id: serial("id").primaryKey(),
  companyName: text("company_name"),
  positionName: text("position_name"),
  location: text("location"),
  description: text("description"),
  applicationUrl: text("applicationUrl").notNull().unique(),
  status: statusEnum("status").notNull().default("bookmarked"),
  directoryId: integer("directoryId")
    .notNull()
    .references(() => jobDirectoryTable.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});
export const jobUserRelation = relations(jobsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [jobsTable.userId],
    references: [usersTable.id],
  }),
}));
