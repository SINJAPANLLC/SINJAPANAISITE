import { Router } from "express";
import cron from "node-cron";
import { logger } from "../lib/logger";
import { adminAuth } from "./crawl-job";
import { runSilentCrawl, runLimitedCrawl } from "./crawl-job";
import { sendMail } from "../lib/mailer";

const router = Router();

// ============================================================
// 業種×地域クエリリスト（100件以上・全国網羅）
// ============================================================
const QUERY_LIST = [
  "東京 製造業", "東京 建設業", "東京 印刷業", "東京 食品加工",
  "東京 物流業", "東京 卸売業", "東京 IT企業 中小",
  "神奈川 製造業", "神奈川 建設業", "神奈川 運送業", "神奈川 印刷業",
  "神奈川 食品加工", "神奈川 卸売業",
  "埼玉 製造業", "埼玉 建設業", "埼玉 物流", "埼玉 食品業",
  "千葉 製造業", "千葉 建設業", "千葉 農業法人", "千葉 水産",
  "茨城 製造業", "茨城 農業法人", "茨城 建設業",
  "栃木 製造業", "栃木 建設業", "栃木 農業法人",
  "群馬 製造業", "群馬 建設業", "群馬 繊維業",
  "愛知 製造業", "愛知 自動車部品", "愛知 金属加工", "愛知 建設業",
  "静岡 製造業", "静岡 食品業", "静岡 プラスチック加工",
  "岐阜 製造業", "岐阜 建設業", "岐阜 繊維業",
  "三重 製造業", "三重 水産", "三重 建設業",
  "新潟 食品業", "新潟 製造業", "新潟 建設業",
  "長野 製造業", "長野 農業法人", "長野 建設業",
  "富山 製造業", "石川 製造業", "福井 製造業",
  "大阪 製造業", "大阪 建設業", "大阪 卸売業", "大阪 印刷業",
  "大阪 食品加工", "大阪 物流業",
  "兵庫 製造業", "兵庫 建設業", "兵庫 物流", "兵庫 食品業",
  "京都 製造業", "京都 印刷業", "京都 食品加工", "京都 建設業",
  "滋賀 製造業", "滋賀 建設業",
  "奈良 製造業", "和歌山 製造業",
  "広島 製造業", "広島 建設業", "広島 卸売業",
  "岡山 製造業", "岡山 建設業",
  "山口 製造業", "鳥取 農業法人", "島根 製造業",
  "愛媛 水産", "愛媛 製造業", "高知 農業法人",
  "徳島 製造業", "香川 製造業",
  "福岡 製造業", "福岡 建設業", "福岡 運送業", "福岡 食品業",
  "熊本 製造業", "熊本 農業法人", "熊本 建設業",
  "鹿児島 農業法人", "鹿児島 食品業",
  "長崎 水産", "長崎 製造業",
  "大分 製造業", "宮崎 農業法人",
  "沖縄 製造業", "沖縄 建設業",
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
// 初回アプローチ HTMLメール生成
// ============================================================
const AUTO_EMAIL_SUBJECT = "AIで業務を自動化｜最短1週間で現場導入【SIN JAPAN AI】";

function buildApproachHtml(company: string): string {
  const bodyMain = `突然のご連絡、失礼いたします。<br>合同会社SIN JAPANと申します。<br><br>
「AIは気になるけど、何から始めればいいかわからない」<br>
「費用が高そう、専門知識がなければ使えない」<br>
そのようなお悩みをお持ちではないでしょうか？<br><br>
弊社は中小企業専門のAI導入支援会社です。<br>
3つのことを徹底してサービスを提供しています。<br><br>
☑️ 安い　── 業界最安水準。まずは小さく始められます<br>
☑️ 早い　── 最短1週間で現場稼働。スモールスタートで効果を確認<br>
☑️ 簡単　── 社内にIT担当不要。使い方は丁寧に指導します<br><br>
実際にこんな変化が起きています：<br><br>
・見積書・請求書作成が80%時間短縮<br>
・問い合わせ対応を24時間自動化、営業機会を逃さない<br>
・スケジュール管理・在庫最適化でミスがゼロに<br><br>
初回のご相談・デモは完全無料です。<br>
「話だけ聞いてみたい」でも大歓迎です。<br><br>
まずは下記URLより詳細をご覧いただき、<br>
お気軽にお問い合わせください：<br>
<a href="https://sinjapanai.site/" style="color:#000;">https://sinjapanai.site/</a>`;

  return `<!DOCTYPE html>
<html lang="ja" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${AUTO_EMAIL_SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Helvetica,Arial,'Hiragino Kaku Gothic ProN',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f0;">
<tr><td align="center" style="padding:40px 16px;">
<table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#ffffff;">
  <tr><td style="background:#000;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr>
    <td style="padding:28px 40px 24px;border-bottom:1px solid #e8e8e8;">
      <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.3em;color:#999;text-transform:uppercase;">合同会社 SIN JAPAN</p>
      <p style="margin:4px 0 0;font-size:9px;letter-spacing:.15em;color:#ccc;">AI INTEGRATION &amp; DEVELOPMENT</p>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 40px 0;">
      <p style="margin:0 0 8px;font-size:9px;font-weight:700;letter-spacing:.3em;color:#bbb;text-transform:uppercase;">MESSAGE</p>
      <h1 style="margin:0;font-size:19px;font-weight:900;color:#000;line-height:1.4;">${AUTO_EMAIL_SUBJECT}</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 40px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:2px;background:#000;padding:0;">&nbsp;</td>
          <td style="padding:0 0 0 16px;">
            <p style="margin:0;font-size:11px;font-weight:700;color:#888;">${company}</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#000;">ご担当者様</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="padding:0 40px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#ebebeb;font-size:0;">&nbsp;</td></tr></table></td></tr>
  <tr>
    <td style="padding:28px 40px 36px;">
      <p style="margin:0;font-size:14px;color:#333;line-height:2.1;">${bodyMain}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 44px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td style="background:#000;padding:0;">
            <a href="https://sinjapanai.site/" style="display:block;padding:14px 36px;font-size:12px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:.08em;">まずは無料相談する &nbsp;&rsaquo;&nbsp; sinjapanai.site</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr><td style="padding:0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#e0e0e0;font-size:0;">&nbsp;</td></tr></table></td></tr>
  <tr>
    <td style="padding:20px 40px;background:#fafafa;">
      <p style="margin:0;font-size:11px;font-weight:900;color:#000;">合同会社SIN JAPAN</p>
      <p style="margin:6px 0 0;font-size:10px;color:#999;line-height:1.9;">〒243-0303 神奈川県愛甲郡愛川町中津7287<br>Tel 050-5526-9906　Fax 046-212-2326<br>info@sinjapanai.site　sinjapanai.site</p>
    </td>
  </tr>
  <tr>
    <td style="background:#000;padding:16px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td><p style="margin:0;font-size:9px;color:#555;letter-spacing:.05em;">このメールは合同会社SIN JAPANより送信されています。</p></td>
          <td align="right"><p style="margin:0;font-size:11px;font-weight:900;color:#333;letter-spacing:.1em;">SIN JAPAN</p></td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ============================================================
// スケジューラー状態
// ============================================================
export interface AutoRunRecord {
  runAt: number;
  query: string;
  leadsCollected: number;
  emailsSent: number;
  label: string;
}

export interface SchedulerStatus {
  enabled: boolean;
  isRunning: boolean;
  nextQueryIndex: number;
  totalQueries: number;
  queriesPerRun: number;
  leadsPerRun: number;
  history: AutoRunRecord[];
  totalEmailsSent: number;
  lastRunAt: number | null;
  lastRunEmailsFound: number;
  lastRunQueries: string[];
  nextRunAt: number;
}

const status: SchedulerStatus = {
  enabled: true,
  isRunning: false,
  nextQueryIndex: 0,
  totalQueries: QUERY_LIST.length,
  queriesPerRun: 1,
  leadsPerRun: 10,
  history: [],
  totalEmailsSent: 0,
  lastRunAt: null,
  lastRunEmailsFound: 0,
  lastRunQueries: [],
  nextRunAt: 0,
};

// ============================================================
// コア実行ロジック: 10件収集→全件メール送信
// ============================================================
async function runAutoSession(label: string) {
  if (status.isRunning) {
    logger.warn({ label }, "Auto session: already running, skipping");
    return;
  }
  status.isRunning = true;

  const query = QUERY_LIST[status.nextQueryIndex % QUERY_LIST.length];
  status.nextQueryIndex = (status.nextQueryIndex + 1) % QUERY_LIST.length;
  status.lastRunAt = Date.now();
  status.lastRunQueries = [query];
  status.lastRunEmailsFound = 0;

  logger.info({ label, query, leadsPerRun: status.leadsPerRun }, "Auto session started");

  try {
    const leads = await runLimitedCrawl(query, status.leadsPerRun);
    status.lastRunEmailsFound = leads.length;
    logger.info({ label, leadsFound: leads.length }, "Auto session: crawl complete");

    let sent = 0;
    for (const lead of leads) {
      try {
        const html = buildApproachHtml(lead.company || lead.email);
        await sendMail({ to: lead.email, subject: AUTO_EMAIL_SUBJECT, html });
        sent++;
        logger.info({ to: lead.email, company: lead.company }, "Auto session: email sent");
        await new Promise(r => setTimeout(r, 1500));
      } catch (err) {
        logger.warn({ err, email: lead.email }, "Auto session: email send failed");
      }
    }

    status.totalEmailsSent += sent;
    const record: AutoRunRecord = {
      runAt: Date.now(),
      query,
      leadsCollected: leads.length,
      emailsSent: sent,
      label,
    };
    status.history.unshift(record);
    if (status.history.length > 30) status.history = status.history.slice(0, 30);

    logger.info({ label, leadsCollected: leads.length, emailsSent: sent }, "Auto session complete");
  } catch (err) {
    logger.error({ err, label }, "Auto session failed");
  } finally {
    status.isRunning = false;
  }
}

// ============================================================
// Cron スケジュール（JST = UTC+9）
// 朝9時  JST = 0:00 UTC
// 昼12時 JST = 3:00 UTC
// 17時   JST = 8:00 UTC
// ============================================================
cron.schedule("0 0 * * *", () => {
  if (status.enabled) runAutoSession("朝9時").catch(err => logger.error({ err }, "Cron 9am error"));
});
cron.schedule("0 3 * * *", () => {
  if (status.enabled) runAutoSession("昼12時").catch(err => logger.error({ err }, "Cron 12pm error"));
});
cron.schedule("0 8 * * *", () => {
  if (status.enabled) runAutoSession("17時").catch(err => logger.error({ err }, "Cron 5pm error"));
});

// 毎日深夜（旧・バックグラウンドクロール用） — 大量収集
cron.schedule("0 18 * * *", async () => {
  if (!status.enabled) return;
  const q = QUERY_LIST[status.nextQueryIndex % QUERY_LIST.length];
  status.nextQueryIndex = (status.nextQueryIndex + 1) % QUERY_LIST.length;
  await runSilentCrawl(q).catch(err => logger.error({ err }, "Nightly bulk crawl error"));
});

// ============================================================
// API routes
// ============================================================
function computeNextRun(): number {
  const now = new Date();
  const utcH = now.getUTCHours();
  const utcM = now.getUTCMinutes();
  const todayMinutes = utcH * 60 + utcM;
  const slots = [0, 180, 480]; // 0:00, 3:00, 8:00 UTC in minutes
  let nextSlot = slots.find(s => s > todayMinutes);
  const next = new Date(now);
  if (nextSlot !== undefined) {
    next.setUTCHours(Math.floor(nextSlot / 60), nextSlot % 60, 0, 0);
  } else {
    next.setUTCDate(next.getUTCDate() + 1);
    next.setUTCHours(0, 0, 0, 0);
  }
  return next.getTime();
}

router.get("/crawl-scheduler/status", (req, res) => {
  if (!adminAuth(req, res)) return;
  res.json({ ...status, nextRunAt: computeNextRun() });
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
  const label = req.body?.label || "手動実行";
  runAutoSession(label).catch(err => logger.error({ err }, "Manual run error"));
  res.json({ message: "started" });
});

router.post("/crawl-scheduler/config", (req, res) => {
  if (!adminAuth(req, res)) return;
  const { leadsPerRun } = req.body as { leadsPerRun?: number };
  if (leadsPerRun && leadsPerRun >= 1 && leadsPerRun <= 50) {
    status.leadsPerRun = leadsPerRun;
  }
  res.json({ leadsPerRun: status.leadsPerRun });
});

export default router;
