import { Router } from "express";
import { z } from "zod";
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

router.post("/download-lead", async (req, res) => {
  const result = leadSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", details: result.error.flatten() });
    return;
  }

  const data = result.data;

  try {
    await sendMail({
      to: process.env.SMTP_USER!,
      subject: `【資料DL】${data.company} ${data.name} 様`,
      html: downloadLeadNotifyHtml(data),
    });

    logger.info({ email: data.email }, "Download lead email sent");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send download lead email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
