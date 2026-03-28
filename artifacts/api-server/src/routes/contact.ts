import { Router } from "express";
import { z } from "zod";
import { db, contactsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { sendMail, contactNotifyHtml, contactAutoReplyHtml } from "../lib/mailer";
import { logger } from "../lib/logger";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

// POST /api/contact — submit from HP contact form
router.post("/contact", async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", details: result.error.flatten() });
    return;
  }

  const data = result.data;

  // Save to DB
  let saved;
  try {
    const [row] = await db.insert(contactsTable).values(data).returning();
    saved = row;
  } catch (err) {
    logger.error({ err }, "Failed to save contact to DB");
    res.status(500).json({ error: "Failed to save contact" });
    return;
  }

  // Send emails (fire and forget — don't block the response)
  Promise.all([
    sendMail({
      to: process.env.SMTP_USER!,
      subject: `【お問い合わせ】${data.company} ${data.name} 様`,
      html: contactNotifyHtml(data),
    }),
    sendMail({
      to: data.email,
      subject: "お問い合わせを受け付けました — 合同会社SIN JAPAN",
      html: contactAutoReplyHtml(data.name),
    }),
  ]).catch(err => logger.error({ err }, "Failed to send contact email"));

  logger.info({ id: saved.id, email: data.email }, "Contact saved");
  res.json({ ok: true, id: saved.id });
});

// GET /api/contacts — fetch all contacts for admin dashboard
router.get("/contacts", async (req, res) => {
  const secret = req.headers["x-admin-token"];
  const expected = process.env.VITE_ADMIN_PASSWORD;
  if (!expected || secret !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const contacts = await db
      .select()
      .from(contactsTable)
      .orderBy(desc(contactsTable.createdAt));
    res.json(contacts);
  } catch (err) {
    logger.error({ err }, "Failed to fetch contacts");
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

export default router;
