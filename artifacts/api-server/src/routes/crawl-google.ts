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

const SKIP_DOMAINS = [
  "example", "sentry", "wix", "wordpress", "schema.org", "w3.org",
  "cloudflare", "google", "gstatic", "googleapis", "facebook", "twitter",
  "instagram", "linkedin", "youtube", "amazon", "rakuten", "wikipedia",
  "yahoo", "naver", "2x", "placeholder", "yoursite", "domain", "email",
  "test", "sample", "dummy", "noreply", "no-reply",
];

const SKIP_EXT = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js", ".pdf"];

const SKIP_URL_PATTERNS = [
  "wikipedia", "facebook", "twitter", "instagram", "linkedin",
  "youtube", "amazon", "rakuten", "yahoo", "naver", "google",
  "appstore", "play.google", "maps.google", "translate.google",
  "duckduckgo", "bing", "microsoft", "lycorp", "mlit.go.jp",
  "pref.", "city.", "town.", "go.jp", "yimg", "s.yimg", "baseconnect",
  "hakopro", "houjin.goo", "mapion", "freelance.web-box",
];

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function filterEmails(raw: string[]): string[] {
  return [...new Set(raw)].filter(e => {
    const lower = e.toLowerCase();
    if (SKIP_EXT.some(ext => lower.endsWith(ext))) return false;
    if (SKIP_DOMAINS.some(d => lower.includes(d))) return false;
    if (e.length > 100 || e.length < 6) return false;
    if (!e.includes("@") || !e.includes(".")) return false;
    const [local, domain] = e.split("@");
    if (!local || !domain || domain.split(".").length < 2) return false;
    return true;
  });
}

function extractCompanyName(html: string, siteUrl: string): string {
  // Try og:site_name first (most reliable)
  const ogSite = html.match(/property=["']og:site_name["'][^>]*content=["']([^"']{2,60})["']/i)
    || html.match(/content=["']([^"']{2,60})["'][^>]*property=["']og:site_name["']/i);
  if (ogSite) {
    const name = ogSite[1].trim().slice(0, 40);
    if (name.length >= 2) return name;
  }

  // Try <title> tag
  const titleM = html.match(/<title[^>]*>([^<]{2,100})<\/title>/i);
  if (titleM) {
    let t = titleM[1]
      // Decode HTML entities
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#?\w+;/g, "")
      // Strip everything after separators (keep the LAST meaningful segment which is often the company name)
      // Pattern: "Page title | Company Name" → keep "Company Name"
      .replace(/^.*[\|｜│\-–—]\s*/u, "")
      .replace(/\s+/g, " ")
      .trim();
    // If company-type words are in original, try to extract them
    if (t.length < 2 && titleM[1]) {
      // Try first segment before separator
      t = titleM[1].split(/[\|｜│\-–—]/u)[0].trim().replace(/\s+/g, " ");
    }
    if (t.length >= 2 && !/(top|home|index|ホーム|トップ|公式サイト|official|サービス紹介|フォーム|contact|お問い合わせ)/i.test(t)) {
      return t.slice(0, 40);
    }
  }

  // Fall back to domain (e.g. example.co.jp → example)
  try {
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, "");
    const parts = hostname.split(".");
    return parts[0].slice(0, 40);
  } catch {
    return "";
  }
}

function extractEmailsFromHtml(html: string): string[] {
  const decoded = html
    .replace(/&amp;/g, "&")
    .replace(/&#64;/g, "@")
    .replace(/\[at\]/gi, "@")
    .replace(/\[dot\]/gi, ".")
    .replace(/\\u0040/g, "@")
    .replace(/%40/g, "@");

  const raw1 = html.match(EMAIL_RE) || [];
  const raw2 = decoded.match(EMAIL_RE) || [];

  const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi;
  const raw3: string[] = [];
  let m;
  while ((m = mailtoRe.exec(html)) !== null) raw3.push(m[1]);

  return filterEmails([...raw1, ...raw2, ...raw3]);
}

async function fetchPage(url: string, timeout = 10000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(timeout),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractUrlsFromYahoo(html: string): string[] {
  const urls: string[] = [];

  // Extract all href="https://..." links from Yahoo Japan search HTML
  // Yahoo Japan returns direct company URLs (no tracking redirects for organic results)
  const hrefRe = /href="(https?:\/\/[^"#?]{8,})"/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    urls.push(m[1]);
  }

  // Also extract http:// links (some old Japanese sites use http)
  const httpRe = /href="(http:\/\/[^"#?]{8,})"/gi;
  while ((m = httpRe.exec(html)) !== null) {
    urls.push(m[1]);
  }

  // Deduplicate, filter skip patterns
  const seen = new Set<string>();
  return urls.filter(u => {
    const lower = u.toLowerCase();
    if (seen.has(lower)) return false;
    if (SKIP_URL_PATTERNS.some(p => lower.includes(p))) return false;
    if (!lower.includes(".")) return false;
    // Keep only proper domain URLs
    try {
      const hostname = new URL(u).hostname;
      if (hostname.split(".").length < 2) return false;
    } catch { return false; }
    seen.add(lower);
    return true;
  }).slice(0, 20);
}

function extractContactUrls(baseUrl: string, html: string): string[] {
  const contactPaths = ["/contact", "/contact.html", "/contact/", "/お問い合わせ", "/inquiry", "/inquiry.html", "/aboutus/contact"];
  const contactKeywords = ["contact", "お問い合わせ", "inquiry", "contact-us", "contactus"];

  const base = new URL(baseUrl);
  const found: string[] = [];

  const hrefRe = /href="([^"]+)"/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    const lower = href.toLowerCase();
    if (contactKeywords.some(k => lower.includes(k))) {
      try {
        const full = new URL(href, base.origin).toString();
        if (full.startsWith(base.origin)) found.push(full);
      } catch {}
    }
  }

  // Also add standard contact paths
  for (const path of contactPaths) {
    found.push(base.origin + path);
  }

  return [...new Set(found)].slice(0, 4);
}

// POST /api/crawl-google
router.post("/crawl-google", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { query } = req.body as { query?: string };
  if (!query?.trim()) { res.status(400).json({ error: "query is required" }); return; }

  try {
    const searchQ = `${query.trim()} お問い合わせ`;
    const yahooUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQ)}&n=20`;

    logger.info({ query: searchQ }, "Yahoo Japan search start");

    const yahooHtml = await fetchPage(yahooUrl, 15000);
    if (!yahooHtml) {
      res.status(422).json({ error: "検索エンジンへの接続に失敗しました。しばらく後に再試行してください。" });
      return;
    }

    const siteUrls = extractUrlsFromYahoo(yahooHtml);
    logger.info({ count: siteUrls.length, urls: siteUrls.slice(0, 5) }, "Extracted site URLs from Yahoo");

    if (siteUrls.length === 0) {
      res.json({ emails: [], count: 0, sources: [], message: "検索結果からURLを取得できませんでした。検索キーワードを変更してみてください。" });
      return;
    }

    // Crawl each site and contact pages concurrently (max 12 sites)
    const targetUrls = siteUrls.slice(0, 12);
    const allLeads: { email: string; company: string; source: string }[] = [];
    const sources: string[] = [];

    await Promise.allSettled(
      targetUrls.map(async (siteUrl) => {
        try {
          const pageHtml = await fetchPage(siteUrl, 8000);
          if (!pageHtml) return;

          sources.push(siteUrl);
          const company = extractCompanyName(pageHtml, siteUrl);

          // Extract from main page
          const mainEmails = extractEmailsFromHtml(pageHtml);
          mainEmails.forEach(e => allLeads.push({ email: e, company, source: siteUrl }));

          // If no emails found on main page, try contact subpages
          if (mainEmails.length === 0) {
            const contactUrls = extractContactUrls(siteUrl, pageHtml);
            await Promise.allSettled(
              contactUrls.slice(0, 2).map(async (cUrl) => {
                const cHtml = await fetchPage(cUrl, 6000);
                if (!cHtml) return;
                const cEmails = extractEmailsFromHtml(cHtml);
                cEmails.forEach(e => allLeads.push({ email: e, company, source: cUrl }));
              })
            );
          }
        } catch (err) {
          logger.warn({ siteUrl, err }, "Site crawl failed");
        }
      })
    );

    // Deduplicate by email
    const seenEmails = new Set<string>();
    const uniqueLeads = allLeads.filter(({ email }) => {
      const lower = email.toLowerCase();
      if (seenEmails.has(lower)) return false;
      seenEmails.add(lower);
      return true;
    });

    const emails = uniqueLeads.map(r => r.email);
    const leads = uniqueLeads.map(r => ({ email: r.email, company: r.company }));

    logger.info({ query: query.trim(), emailCount: emails.length, sitesScanned: sources.length }, "Google crawl complete");
    res.json({
      emails,
      leads,
      count: emails.length,
      sitesScanned: sources.length,
      sources: sources.slice(0, 10),
    });
  } catch (err: any) {
    logger.error({ err, query }, "crawl-google failed");
    const msg = err?.name === "TimeoutError"
      ? "タイムアウト：処理に時間がかかりすぎました"
      : "クロール失敗。しばらく後に再試行してください。";
    res.status(500).json({ error: msg });
  }
});

export default router;
