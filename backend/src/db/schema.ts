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
  company_name: text("company_name").notNull(),
  position_name: text("position_name").notNull(),
  application_url: text("application_url").notNull().unique(),
  status: statusEnum("status").notNull(),
  directory_id: integer("directory_id")
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
