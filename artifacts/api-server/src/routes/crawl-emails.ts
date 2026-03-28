import { Router } from "express";
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

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const BAD_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js"];
const BAD_DOMAINS = ["example", "sentry", "wix", "wordpress", "schema.org", "w3.org", "cloudflare", "@2x"];

function filterEmails(raw: string[]): string[] {
  return [...new Set(raw)].filter(e => {
    const lower = e.toLowerCase();
    if (BAD_EXTENSIONS.some(ext => lower.endsWith(ext))) return false;
    if (BAD_DOMAINS.some(d => lower.includes(d))) return false;
    if (e.length > 100) return false;
    return true;
  });
}

// POST /api/crawl-emails
router.post("/crawl-emails", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { url } = req.body as { url?: string };
  if (!url) { res.status(400).json({ error: "url is required" }); return; }

  try {
    const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja,en;q=0.8",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      res.status(422).json({ error: `サイトの取得に失敗しました (HTTP ${response.status})` });
      return;
    }

    const html = await response.text();

    // 1. Direct regex matches in raw HTML
    const raw1 = html.match(EMAIL_RE) || [];

    // 2. Decode HTML entities like &amp; → & and &#64; → @ then re-scan
    const decoded = html
      .replace(/&amp;/g, "&")
      .replace(/&#64;/g, "@")
      .replace(/\[at\]/gi, "@")
      .replace(/\[dot\]/gi, ".")
      .replace(/\s+at\s+/gi, "@")
      .replace(/\s+dot\s+/gi, ".");
    const raw2 = decoded.match(EMAIL_RE) || [];

    // 3. mailto: links
    const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
    const raw3: string[] = [];
    let m;
    while ((m = mailtoRe.exec(html)) !== null) raw3.push(m[1]);

    const emails = filterEmails([...raw1, ...raw2, ...raw3]);

    logger.info({ url: targetUrl, count: emails.length }, "Crawled emails");
    res.json({ emails, count: emails.length, source: targetUrl });
  } catch (err: any) {
    logger.error({ err, url }, "crawl-emails failed");
    const msg = err?.name === "TimeoutError"
      ? "タイムアウト：サイトの応答が遅すぎます"
      : "クロール失敗。URLを確認してください。";
    res.status(500).json({ error: msg });
  }
});

export default router;
