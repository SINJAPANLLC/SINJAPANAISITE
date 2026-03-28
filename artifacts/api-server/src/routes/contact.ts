import { Router } from "express";
import { z } from "zod";
import { sendMail, contactNotifyHtml, contactAutoReplyHtml } from "../lib/mailer";
import { logger } from "../lib/logger";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

router.post("/contact", async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", details: result.error.flatten() });
    return;
  }

  const data = result.data;

  try {
    await Promise.all([
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
    ]);

    logger.info({ email: data.email }, "Contact form email sent");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
