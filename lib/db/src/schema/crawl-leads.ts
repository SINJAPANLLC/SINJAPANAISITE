import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const crawlLeadsTable = pgTable("crawl_leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  company: text("company"),
  name: text("name"),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CrawlLead = typeof crawlLeadsTable.$inferSelect;
