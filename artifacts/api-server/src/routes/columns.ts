import { Router } from "express";
import { db, columnsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { openai } from "../lib/openai";
import { logger } from "../lib/logger";
import cron from "node-cron";

const router = Router();

const adminAuth = (req: any, res: any): boolean => {
  const secret = req.headers["x-admin-token"];
  if (!secret || secret !== process.env.VITE_ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

const TOPICS = [
  "中小企業のAI導入で失敗しない5つのポイント",
  "ChatGPTを業務に活用する具体的な方法",
  "製造業でAIを使って生産効率を上げる事例",
  "AIチャットボット導入で顧客対応を自動化する方法",
  "物流業界におけるAI活用の最新トレンド",
  "医療・介護現場でAIが変える業務フロー",
  "AIで経営判断を支援するデータ分析の実践",
  "DX推進の第一歩：AIツール選びの基準とは",
  "HR・採用業務にAIを活用する新しいアプローチ",
  "AIと人間の協働モデル：2026年の働き方の未来",
];

export async function generateColumn(topic?: string) {
  const t = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const slug = t.slice(0, 30).replace(/[^\w\u3040-\u9fff]/g, "-").replace(/-+/g, "-") + "-" + Date.now().toString(36);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `あなたは合同会社SIN JAPANのAIコンサルタントです。
SEO対策された日本語のコラム記事を書いてください。
記事は以下の形式でMarkdown形式で書いてください：
- 見出し（##）を使った明確な構成
- 具体的な事例や数字を含む
- 読みやすい段落構成
- 1200〜1800文字程度
- 最後にSIN JAPANへの相談を自然に促すCTA`,
      },
      { role: "user", content: `テーマ: ${t}` },
    ],
    max_tokens: 2000,
  });

  let content = completion.choices[0].message.content || "";
  // Strip markdown code fences if present
  content = content.replace(/^```(?:markdown)?\n?/i, "").replace(/\n?```\s*$/, "").trim();
  const metaDesc = `${t}について詳しく解説。合同会社SIN JAPANのAI導入支援専門家がわかりやすく説明します。`;

  return { slug, title: t, content, metaDescription: metaDesc, category: "AI活用" };
}

// GET /api/columns — public
router.get("/columns", async (_req, res) => {
  try {
    const items = await db.select().from(columnsTable).orderBy(desc(columnsTable.createdAt));
    res.json(items);
  } catch (err) {
    logger.error({ err }, "Failed to fetch columns");
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

// GET /api/columns/:slug — public
router.get("/columns/:slug", async (req, res) => {
  try {
    const [item] = await db.select().from(columnsTable).where(eq(columnsTable.slug, req.params.slug));
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch (err) {
    logger.error({ err }, "Failed to fetch column");
    res.status(500).json({ error: "Failed to fetch column" });
  }
});

// POST /api/columns/generate — admin, AI generate
router.post("/columns/generate", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { topic } = req.body;
  try {
    const data = await generateColumn(topic);
    const [row] = await db.insert(columnsTable).values(data).returning();
    logger.info({ id: row.id, title: row.title }, "Column generated");
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to generate column");
    res.status(500).json({ error: "Failed to generate column" });
  }
});

// DELETE /api/columns/:id — admin
router.delete("/columns/:id", async (req, res) => {
  if (!adminAuth(req, res)) return;
  try {
    await db.delete(columnsTable).where(eq(columnsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to delete column");
    res.status(500).json({ error: "Failed to delete column" });
  }
});

// Daily auto-generation at 7:00 AM JST (22:00 UTC)
cron.schedule("0 22 * * *", async () => {
  logger.info("Running daily column generation");
  try {
    const data = await generateColumn();
    const [row] = await db.insert(columnsTable).values(data).returning();
    logger.info({ id: row.id, title: row.title }, "Daily column generated");
  } catch (err) {
    logger.error({ err }, "Daily column generation failed");
  }
});

export default router;
