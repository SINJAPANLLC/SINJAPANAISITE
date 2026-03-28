import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const visitorLogsTable = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  title: text("title"),
  ip: text("ip"),
  country: text("country"),
  countryCode: text("country_code"),
  region: text("region"),
  city: text("city"),
  lat: text("lat"),
  lon: text("lon"),
  userAgent: text("user_agent"),
  browser: text("browser"),
  device: text("device"),
  referrer: text("referrer"),
  sessionId: text("session_id"),
  timeOnPage: integer("time_on_page"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type VisitorLog = typeof visitorLogsTable.$inferSelect;
