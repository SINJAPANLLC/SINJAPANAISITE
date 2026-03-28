import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const columnsTable = pgTable("columns", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("AI活用"),
  content: text("content").notNull(),
  metaDescription: text("meta_description"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Column = typeof columnsTable.$inferSelect;
export type InsertColumn = typeof columnsTable.$inferInsert;
