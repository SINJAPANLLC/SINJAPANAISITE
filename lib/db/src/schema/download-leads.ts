import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const downloadLeadsTable = pgTable("download_leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  department: text("department"),
  purpose: text("purpose"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type DownloadLead = typeof downloadLeadsTable.$inferSelect;
