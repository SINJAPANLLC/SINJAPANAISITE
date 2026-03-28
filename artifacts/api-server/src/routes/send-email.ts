import { Router } from "express";
import { z } from "zod";
import { sendMail } from "../lib/mailer";
import { openai } from "../lib/openai";
import { logger } from "../lib/logger";

const router = Router();

const adminAuth = (req: any, res: any): boolean => {
  const secret = req.headers["x-admin-token"];
  if (!secret || secret !== process.env.VITE_ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

const sendSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

// POST /api/send-email — admin in-app email send
router.post("/send-email", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const result = sendSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input" }); return;
  }
  try {
    await sendMail({
      to: result.data.to,
      subject: result.data.subject,
      html: result.data.html,
    });
    logger.info({ to: result.data.to }, "Admin email sent");
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to send admin email");
    res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/compose-email — AI compose email draft
router.post("/compose-email", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { name, company, purpose, tone, templateType } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは合同会社SIN JAPANの営業担当者です。
AI導入支援・AI開発の会社として、丁寧でプロフェッショナルな日本語のビジネスメールを書いてください。
件名と本文を以下のJSON形式で返してください：
{"subject": "件名", "body": "本文"}
署名は不要です。送信者情報なしで本文のみ書いてください。`,
        },
        {
          role: "user",
          content: `
宛先: ${company} ${name}様
目的: ${purpose || "AI導入の提案"}
トーン: ${tone || "丁寧・ビジネスライク"}
テンプレートタイプ: ${templateType || "初回アプローチ"}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });
    const result = JSON.parse(completion.choices[0].message.content || "{}");
    res.json({ subject: result.subject, body: result.body });
  } catch (err) {
    logger.error({ err }, "Failed to compose email");
    res.status(500).json({ error: "Failed to compose email" });
  }
});

export default router;
