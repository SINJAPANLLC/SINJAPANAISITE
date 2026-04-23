import nodemailer from "nodemailer";
import pg from "pg";

const { Pool } = pg;

const SMTP_HOST = process.env.SMTP_HOST || "smtp.hostinger.com";
const SMTP_PORT = process.env.SMTP_PORT || "465";
const SMTP_USER = process.env.SMTP_USER || "info@sinjapanai.site";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM = process.env.SMTP_FROM || "info@sinjapanai.site";
const DB_URL = process.env.NEON_DATABASE_URL;

if (!SMTP_PASSWORD || !DB_URL) {
  console.error("SMTP_PASSWORD or NEON_DATABASE_URL not set");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
});

const pool = new Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

function buildHtml(company) {
  return `
<!DOCTYPE html>
<html lang="ja">
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
<p>${company}<br>ご担当者様</p>
<p>突然のご連絡、失礼いたします。<br>合同会社SIN JAPANと申します。</p>
<p>「AIは気になるけど、何から始めればいいかわからない」<br>
「費用が高そう、専門知識がなければ使えない」<br>
そのようなお悩みをお持ちではないでしょうか？</p>
<p>弊社は<strong>中小企業専門のAI導入支援会社</strong>です。<br>
3つのことを徹底してサービスを提供しています。</p>
<p>
✅ <strong>安い</strong>　── 業界最安水準。まずは小さく始められます<br>
✅ <strong>早い</strong>　── 最短1週間で現場稼働。スモールスタートで効果を確認<br>
✅ <strong>簡単</strong>　── 社内にIT担当不要。使い方は丁寧に指導します
</p>
<p>実際にこんな変化が起きています：</p>
<ul>
<li>見積書・請求書作成が80%時間短縮</li>
<li>問い合わせ対応を24時間自動化、営業機会を逃さない</li>
<li>スケジュール管理・在庫最適化でミスがゼロに</li>
</ul>
<p><strong>初回のご相談・デモは完全無料です。</strong><br>
「話だけ聞いてみたい」でも大歓迎です。</p>
<p>まずは下記URLより詳細をご覧いただき、<br>
お気軽にお問い合わせください（所要30秒）：<br>
<a href="https://sinjapanai.site/">https://sinjapanai.site/</a></p>
<p>来週15分ほどオンラインでお話しできれば幸いです。<br>
貴社のご状況に合わせた活用方法をご提案いたします。</p>
<p>どうぞよろしくお願いいたします。</p>
<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
<p style="font-size:12px;color:#999;">
合同会社SIN JAPAN<br>
〒243-0303 神奈川県愛甲郡愛川町中津7287<br>
TEL: 050-5526-9906<br>
Email: info@sinjapanai.site<br>
URL: https://sinjapanai.site/
</p>
<p style="font-size:11px;color:#bbb;">
このメールが不要な場合は、返信にてお知らせください。
</p>
</body>
</html>`;
}

const INVALID_PATTERNS = [
  /xxxxx/i, /example/i, /test@/i, /no-reply/i, /noreply/i,
  /@gmail\.com$/i, /@yahoo\.co\.jp$/i, /@hotmail/i, /@outlook/i,
  /^contact@mail\.com$/i, /^info@mail\.com$/i,
];

function isValidBizEmail(email) {
  if (!email || !email.includes("@")) return false;
  for (const p of INVALID_PATTERNS) if (p.test(email)) return false;
  return true;
}

const SUBJECT = "AIで業務を自動化｜最短1週間で現場導入【SIN JAPAN AI】";
const DELAY_MS = 2000;
const LOG_FILE = "/tmp/bulk-email-progress.log";

import { writeFileSync, appendFileSync } from "fs";

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  appendFileSync(LOG_FILE, line + "\n");
}

writeFileSync(LOG_FILE, `=== 一括送信開始 ${new Date().toISOString()} ===\n`);

async function main() {
  const res = await pool.query("SELECT id, email, company FROM crawl_leads ORDER BY id");
  const all = res.rows;
  const valid = all.filter(r => isValidBizEmail(r.email));
  log(`全件: ${all.length}件 / 有効: ${valid.length}件 / 無効スキップ: ${all.length - valid.length}件`);

  let sent = 0, failed = 0;

  for (let i = 0; i < valid.length; i++) {
    const lead = valid[i];
    try {
      await transporter.sendMail({
        from: `"合同会社SIN JAPAN" <${FROM}>`,
        to: lead.email,
        subject: SUBJECT,
        html: buildHtml(lead.company || lead.email),
      });
      sent++;
      if (sent % 10 === 0) log(`進捗: ${i + 1}/${valid.length} 送信済: ${sent}件`);
    } catch (err) {
      failed++;
      log(`FAIL [${lead.email}]: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  log(`=== 完了 === 送信: ${sent}件 / 失敗: ${failed}件`);
  await pool.end();
}

main().catch(err => { log(`FATAL: ${err.message}`); process.exit(1); });
