import { Router } from "express";
import cron from "node-cron";
import { logger } from "../lib/logger";
import { adminAuth } from "./crawl-job";
import { runSilentCrawl } from "./crawl-job";

const router = Router();

// ============================================================
// 業種×地域の組み合わせリスト（100件以上）
// 毎日5件ずつローテーション → 20日で全クエリ網羅
// ============================================================
const QUERY_LIST = [
  // 関東エリア
  "東京 製造業", "東京 建設業", "東京 印刷業", "東京 食品加工",
  "東京 物流業", "東京 卸売業", "東京 IT企業 中小",
  "神奈川 製造業", "神奈川 建設業", "神奈川 運送業", "神奈川 印刷業",
  "神奈川 食品加工", "神奈川 卸売業",
  "埼玉 製造業", "埼玉 建設業", "埼玉 物流", "埼玉 食品業",
  "千葉 製造業", "千葉 建設業", "千葉 農業法人", "千葉 水産",
  "茨城 製造業", "茨城 農業法人", "茨城 建設業",
  "栃木 製造業", "栃木 建設業", "栃木 農業法人",
  "群馬 製造業", "群馬 建設業", "群馬 繊維業",
  // 中部エリア
  "愛知 製造業", "愛知 自動車部品", "愛知 金属加工", "愛知 建設業",
  "静岡 製造業", "静岡 食品業", "静岡 プラスチック加工",
  "岐阜 製造業", "岐阜 建設業", "岐阜 繊維業",
  "三重 製造業", "三重 水産", "三重 建設業",
  "新潟 食品業", "新潟 製造業", "新潟 建設業",
  "長野 製造業", "長野 農業法人", "長野 建設業",
  "富山 製造業", "石川 製造業", "福井 製造業",
  // 近畿エリア
  "大阪 製造業", "大阪 建設業", "大阪 卸売業", "大阪 印刷業",
  "大阪 食品加工", "大阪 物流業",
  "兵庫 製造業", "兵庫 建設業", "兵庫 物流", "兵庫 食品業",
  "京都 製造業", "京都 印刷業", "京都 食品加工", "京都 建設業",
  "滋賀 製造業", "滋賀 建設業",
  "奈良 製造業", "和歌山 製造業",
  // 中国・四国エリア
  "広島 製造業", "広島 建設業", "広島 卸売業",
  "岡山 製造業", "岡山 建設業",
  "山口 製造業", "鳥取 農業法人", "島根 製造業",
  "愛媛 水産", "愛媛 製造業", "高知 農業法人",
  "徳島 製造業", "香川 製造業",
  // 九州・沖縄エリア
  "福岡 製造業", "福岡 建設業", "福岡 運送業", "福岡 食品業",
  "熊本 製造業", "熊本 農業法人", "熊本 建設業",
  "鹿児島 農業法人", "鹿児島 食品業",
  "長崎 水産", "長崎 製造業",
  "大分 製造業", "宮崎 農業法人",
  "沖縄 製造業", "沖縄 建設業",
  // 東北・北海道エリア
  "仙台 製造業", "仙台 建設業", "仙台 食品業",
  "宮城 農業法人", "宮城 製造業",
  "福島 製造業", "福島 農業法人",
  "山形 農業法人", "山形 製造業",
  "秋田 農業法人", "岩手 製造業",
  "青森 水産", "青森 農業法人",
  "札幌 製造業", "札幌 建設業", "北海道 農業法人",
  "北海道 水産", "北海道 食品加工",
];

// ============================================================
// スケジューラー状態トラッキング
// ============================================================
export interface SchedulerStatus {
  enabled: boolean;
  lastRunAt: number | null;
  lastRunQueries: string[];
  lastRunEmailsFound: number;
  nextQueryIndex: number;
  queriesPerRun: number;
  totalQueries: number;
  isRunning: boolean;
}

const status: SchedulerStatus = {
  enabled: true,
  lastRunAt: null,
  lastRunQueries: [],
  lastRunEmailsFound: 0,
  nextQueryIndex: 0,
  queriesPerRun: 5,
  totalQueries: QUERY_LIST.length,
  isRunning: false,
};

// ============================================================
// 自動クロール実行ロジック
// ============================================================
async function runDailySchedule() {
  if (status.isRunning) {
    logger.warn("Daily crawl already running, skipping");
    return;
  }
  status.isRunning = true;

  const queries: string[] = [];
  for (let i = 0; i < status.queriesPerRun; i++) {
    const idx = (status.nextQueryIndex + i) % QUERY_LIST.length;
    queries.push(QUERY_LIST[idx]);
  }

  status.lastRunAt = Date.now();
  status.lastRunQueries = queries;
  status.lastRunEmailsFound = 0;

  logger.info({ queries }, "Daily auto-crawl started");

  for (const q of queries) {
    try {
      const found = await runSilentCrawl(q);
      status.lastRunEmailsFound += found;
      logger.info({ query: q, found }, "Daily crawl: query done");
    } catch (err) {
      logger.error({ err, query: q }, "Daily crawl: query failed");
    }
  }

  status.nextQueryIndex = (status.nextQueryIndex + status.queriesPerRun) % QUERY_LIST.length;
  status.isRunning = false;
  logger.info({ totalFound: status.lastRunEmailsFound }, "Daily auto-crawl complete");
}

// ============================================================
// Cron: 毎朝3時JST = 18時UTC
// ============================================================
cron.schedule("0 18 * * *", () => {
  if (status.enabled) {
    runDailySchedule().catch(err => logger.error({ err }, "Daily crawl cron error"));
  }
});

// ============================================================
// API routes
// ============================================================
router.get("/crawl-scheduler/status", (req, res) => {
  if (!adminAuth(req, res)) return;

  const nextRun = (() => {
    const now = new Date();
    const next = new Date();
    next.setUTCHours(18, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next.getTime();
  })();

  res.json({ ...status, nextRunAt: nextRun });
});

router.post("/crawl-scheduler/enable", (req, res) => {
  if (!adminAuth(req, res)) return;
  status.enabled = true;
  res.json({ enabled: true });
});

router.post("/crawl-scheduler/disable", (req, res) => {
  if (!adminAuth(req, res)) return;
  status.enabled = false;
  res.json({ enabled: false });
});

router.post("/crawl-scheduler/run-now", (req, res) => {
  if (!adminAuth(req, res)) return;
  if (status.isRunning) {
    res.status(409).json({ error: "Already running" });
    return;
  }
  runDailySchedule().catch(err => logger.error({ err }, "Manual daily crawl error"));
  res.json({ message: "started" });
});

router.post("/crawl-scheduler/config", (req, res) => {
  if (!adminAuth(req, res)) return;
  const { queriesPerRun } = req.body as { queriesPerRun?: number };
  if (queriesPerRun && queriesPerRun >= 1 && queriesPerRun <= 20) {
    status.queriesPerRun = queriesPerRun;
  }
  res.json({ queriesPerRun: status.queriesPerRun });
});

export default router;
