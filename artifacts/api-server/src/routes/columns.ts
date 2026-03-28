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
  "小売業のAI導入：在庫管理から接客まで自動化する方法",
  "AIを使ったコンテンツマーケティングの効率化術",
  "建設業でAIを活用した安全管理と品質向上",
  "飲食業のAI活用：注文管理・需要予測・スタッフシフト最適化",
  "不動産業界のAI革命：物件マッチングと価格査定の自動化",
  "AI導入コストの正しい試算方法と費用対効果の見極め方",
  "自動化できる業務・できない業務の見分け方",
  "生成AIで企画書・提案書を10倍速く作る方法",
  "社員研修・人材育成にAIを活用する最新事例",
  "AIで顧客データを活用してリピート率を上げる方法",
  "中小企業がAIで大手に勝てる3つの戦略",
  "AIチャットボット比較：ChatGPT・Gemini・Claudeを使い分ける方法",
  "業務自動化RPAとAIの組み合わせで実現する次世代オフィス",
  "農業×AI：スマート農業の最新導入事例と効果",
  "観光・ホテル業界のAI活用：予約最適化からサービス向上まで",
  "AIで売上予測の精度を高める：経営に役立つ需要予測入門",
  "法務・コンプライアンス業務にAIを活用する実践事例",
  "会計・経理業務のAI自動化：月次決算を半分の時間で終わらせる",
  "製品開発にAIを取り入れたイノベーション事例",
  "顧客サポートAI導入ガイド：問い合わせ対応を80%削減する方法",
  "AIによる在庫最適化：欠品と過剰在庫をゼロに近づける方法",
  "マーケティングオートメーションとAIの融合事例",
  "AIを活用した新規顧客獲得：リード獲得からクロージングまで",
  "中小企業のデジタル化：Excel脱却からAI活用への道筋",
  "AIアシスタント導入で社内情報検索を劇的に効率化する方法",
  "音声AIを活用した電話対応自動化の最新事例",
  "社内データ活用のためのAI導入ロードマップ",
  "AIで競合分析を自動化して戦略立案を加速させる方法",
  "中小企業のサイバーセキュリティとAIの組み合わせ対策",
  "AIツール導入後に失敗する企業の共通パターンと対策",
  "AIで請求書・契約書処理を自動化する実践ガイド",
  "SNSマーケティングとAIの組み合わせで集客を倍増させる方法",
  "AIを活用した品質管理：製造業での不良品ゼロへの挑戦",
  "教育・研修業界のAI革命：パーソナライズ学習の実現",
  "AIで競争力を高める！中小企業のDX成功事例10選",
  "ChatGPT APIを使って自社業務ツールを低コストで作る方法",
  "AIによるSEO最適化：検索上位表示を実現するコンテンツ戦略",
  "人手不足を解決するAI自動化の導入ステップ",
  "AIコンシェルジュで社員の生産性を150%に引き上げる方法",
  "2026年最新：日本企業のAI活用状況と成功のカギ",
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
- 最後にSIN JAPANへの相談を自然に促すCTA
コードブロックやマークダウンのフェンス（\`\`\`）は絶対に使わないこと。`,
      },
      { role: "user", content: `テーマ: ${t}` },
    ],
    max_tokens: 2000,
  });

  let content = completion.choices[0].message.content || "";
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

// POST /api/columns/generate — admin, AI generate (supports count param)
router.post("/columns/generate", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { topic, count = 1 } = req.body as { topic?: string; count?: number };
  const n = Math.min(Math.max(Number(count) || 1, 1), 20);
  try {
    const results = [];
    for (let i = 0; i < n; i++) {
      const data = await generateColumn(n === 1 ? topic : undefined);
      const [row] = await db.insert(columnsTable).values(data).returning();
      logger.info({ id: row.id, title: row.title }, "Column generated");
      results.push(row);
      if (i < n - 1) await new Promise(r => setTimeout(r, 800));
    }
    res.json(n === 1 ? results[0] : results);
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

// Daily auto-generation at 7:00 AM JST (22:00 UTC) — 10 articles per day
cron.schedule("0 22 * * *", async () => {
  logger.info("Running daily column generation (10 articles)");
  const results = { success: 0, failed: 0 };
  for (let i = 0; i < 10; i++) {
    try {
      const data = await generateColumn();
      const [row] = await db.insert(columnsTable).values(data).returning();
      logger.info({ id: row.id, title: row.title, index: i + 1 }, "Daily column generated");
      results.success++;
    } catch (err) {
      logger.error({ err, index: i + 1 }, "Daily column generation failed");
      results.failed++;
    }
    if (i < 9) await new Promise(r => setTimeout(r, 3000));
  }
  logger.info(results, "Daily column generation complete");
});

export default router;
