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
const BAD_DOMAINS = ["example", "sentry", "wix", "wordpress", "schema.org", "w3.org", "cloudflare", "@2x", "google", "gstatic", "googleapis"];

function filterEmails(raw: string[]): string[] {
  return [...new Set(raw)].filter(e => {
    const lower = e.toLowerCase();
    if (BAD_EXTENSIONS.some(ext => lower.endsWith(ext))) return false;
    if (BAD_DOMAINS.some(d => lower.includes(d))) return false;
    if (e.length > 100) return false;
    return true;
  });
}

// POST /api/crawl-google
router.post("/crawl-google", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { query } = req.body as { query?: string };
  if (!query?.trim()) { res.status(400).json({ error: "query is required" }); return; }

  try {
    const searchQuery = encodeURIComponent(`${query.trim()} メール email contact`);
    const googleUrl = `https://www.google.co.jp/search?q=${searchQuery}&num=30&hl=ja`;

    const response = await fetch(googleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      res.status(422).json({ error: `Google検索に失敗しました (HTTP ${response.status})` });
      return;
    }

    const html = await response.text();

    const raw1 = html.match(EMAIL_RE) || [];

    const decoded = html
      .replace(/&amp;/g, "&")
      .replace(/&#64;/g, "@")
      .replace(/\[at\]/gi, "@")
      .replace(/\[dot\]/gi, ".")
      .replace(/\\u0040/g, "@");
    const raw2 = decoded.match(EMAIL_RE) || [];

    const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/g;
    const raw3: string[] = [];
    let m;
    while ((m = mailtoRe.exec(html)) !== null) raw3.push(m[1]);

    const emails = filterEmails([...raw1, ...raw2, ...raw3]);

    logger.info({ query: query.trim(), count: emails.length }, "Google crawled emails");
    res.json({ emails, count: emails.length });
  } catch (err: any) {
    logger.error({ err, query }, "crawl-google failed");
    const msg = err?.name === "TimeoutError"
      ? "タイムアウト：Googleの応答が遅すぎます"
      : "Google検索クロール失敗。しばらく後に再試行してください。";
    res.status(500).json({ error: msg });
  }
});

export default router;
