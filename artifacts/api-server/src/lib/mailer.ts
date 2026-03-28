import nodemailer from "nodemailer";

const {
  SMTP_HOST = "smtp.hostinger.com",
  SMTP_PORT = "465",
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
} = process.env;

if (!SMTP_USER || !SMTP_PASSWORD) {
  console.warn("[mailer] SMTP_USER or SMTP_PASSWORD not set — emails will not be sent.");
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const FROM = SMTP_FROM || SMTP_USER;

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendMail(opts: MailOptions) {
  return transporter.sendMail({
    from: `"合同会社SIN JAPAN" <${FROM}>`,
    ...opts,
  });
}

// ── Template helpers ─────────────────────────────────────────────

export function contactNotifyHtml(data: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
}) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>お問い合わせ通知</title></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:40px;">
    <p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 24px;">Contact Inquiry — 合同会社SIN JAPAN</p>
    <h1 style="font-size:20px;font-weight:900;color:#111827;margin:0 0 32px;">新しいお問い合わせがありました</h1>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;width:100px;vertical-align:top;">お名前</td>
        <td style="padding:10px 0;font-weight:700;">${data.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;vertical-align:top;">会社名</td>
        <td style="padding:10px 0;font-weight:700;">${data.company}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;vertical-align:top;">メール</td>
        <td style="padding:10px 0;font-weight:700;"><a href="mailto:${data.email}" style="color:#111827;">${data.email}</a></td>
      </tr>
      ${data.phone ? `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;vertical-align:top;">電話番号</td>
        <td style="padding:10px 0;font-weight:700;">${data.phone}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:10px 0;color:#6b7280;vertical-align:top;">お問い合わせ内容</td>
        <td style="padding:10px 0;white-space:pre-wrap;">${data.message}</td>
      </tr>
    </table>
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;">
      <p style="margin:0;">合同会社SIN JAPAN — info@sinjapanai.site</p>
    </div>
  </div>
</body>
</html>`;
}

export function contactAutoReplyHtml(name: string) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>お問い合わせありがとうございます</title></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:40px;">
    <p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 24px;">合同会社SIN JAPAN</p>
    <h1 style="font-size:20px;font-weight:900;color:#111827;margin:0 0 16px;">お問い合わせありがとうございます</h1>
    <p style="font-size:14px;color:#374151;line-height:1.8;margin:0 0 24px;">
      ${name} 様<br><br>
      お問い合わせいただき、誠にありがとうございます。<br>
      内容を確認の上、担当者より2営業日以内にご連絡いたします。<br><br>
      しばらくお待ちいただけますようお願い申し上げます。
    </p>
    <div style="background:#111827;color:#fff;padding:24px;margin:32px 0;">
      <p style="font-size:12px;font-weight:900;margin:0 0 12px;">合同会社SIN JAPAN</p>
      <p style="font-size:11px;color:#9ca3af;margin:0;line-height:1.8;">
        Tel: 050-5526-9906<br>
        Mail: info@sinjapanai.site<br>
        Web: sinjapanai.site
      </p>
    </div>
    <p style="font-size:11px;color:#9ca3af;margin:0;">© 2026 合同会社SIN JAPAN. All rights reserved.</p>
  </div>
</body>
</html>`;
}

export function downloadLeadNotifyHtml(data: {
  name: string;
  company: string;
  email: string;
  phone?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><title>資料ダウンロードリード</title></head>
<body style="font-family:'Noto Sans JP',Arial,sans-serif;background:#f8f9fa;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;padding:40px;">
    <p style="font-size:11px;font-weight:bold;letter-spacing:.15em;color:#9ca3af;text-transform:uppercase;margin:0 0 24px;">Download Lead — 合同会社SIN JAPAN</p>
    <h1 style="font-size:20px;font-weight:900;color:#111827;margin:0 0 32px;">資料ダウンロードがありました</h1>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;width:100px;">お名前</td>
        <td style="padding:10px 0;font-weight:700;">${data.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;">会社名</td>
        <td style="padding:10px 0;font-weight:700;">${data.company}</td>
      </tr>
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px 0;color:#6b7280;">メール</td>
        <td style="padding:10px 0;font-weight:700;"><a href="mailto:${data.email}" style="color:#111827;">${data.email}</a></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding:10px 0;color:#6b7280;">電話番号</td>
        <td style="padding:10px 0;font-weight:700;">${data.phone}</td>
      </tr>` : ""}
    </table>
    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f3f4f6;font-size:11px;color:#9ca3af;">
      <p style="margin:0;">合同会社SIN JAPAN — info@sinjapanai.site</p>
    </div>
  </div>
</body>
</html>`;
}
