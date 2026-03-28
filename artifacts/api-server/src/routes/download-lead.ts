import { Router } from "express";
import { z } from "zod";
import { db, downloadLeadsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { sendMail, downloadLeadNotifyHtml } from "../lib/mailer";
import { logger } from "../lib/logger";

const router = Router();

const leadSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  department: z.string().optional(),
  purpose: z.string().optional(),
});

// POST /api/download-lead — record lead from brochure download
router.post("/download-lead", async (req, res) => {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", details: result.error.flatten() });
    return;
  }

  const data = result.data;

  // Save to DB
  let saved;
  try {
    const [row] = await db.insert(downloadLeadsTable).values(data).returning();
    saved = row;
  } catch (err) {
    logger.error({ err }, "Failed to save download lead to DB");
    res.status(500).json({ error: "Failed to save lead" });
    return;
  }

  // Send notification email
  sendMail({
    to: process.env.SMTP_USER!,
    subject: `【資料DL】${data.company} ${data.name} 様`,
    html: downloadLeadNotifyHtml(data),
  }).catch(err => logger.error({ err }, "Failed to send download lead email"));

  logger.info({ id: saved.id, email: data.email }, "Download lead saved");
  res.json({ ok: true, id: saved.id });
});

// GET /api/download-leads — fetch all leads for admin dashboard
router.get("/download-leads", async (req, res) => {
  const secret = req.headers["x-admin-token"];
  const expected = process.env.VITE_ADMIN_PASSWORD;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const leads = await db
      .select()
      .from(downloadLeadsTable)
      .orderBy(desc(downloadLeadsTable.createdAt));
    res.json(leads);
  } catch (err) {
    logger.error({ err }, "Failed to fetch download leads");
    res.status(500).json({ error: "Failed to fetch download leads" });
  }
});

export default router;
