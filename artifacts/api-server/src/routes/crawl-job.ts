import { Router } from "express";
import { logger } from "../lib/logger";
import { db, crawlLeadsTable } from "@workspace/db";

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
  "test", "sample", "dummy", "noreply", "no-reply", "donotreply",
  "support", "mailer-daemon", "postmaster", "webmaster", "abuse",
];

const SKIP_EXT = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".css", ".js", ".pdf"];

const SKIP_URL_PATTERNS = [
  "wikipedia", "facebook.com", "twitter.com", "instagram.com", "linkedin.com",
  "youtube.com", "amazon.co.jp", "amazon.com", "rakuten.co.jp",
  "search.yahoo", "yahoo.co.jp", "naver.com", "google.com", "google.co.jp",
  "appstore", "play.google", "maps.google", "translate.google",
  "duckduckgo", "bing.com", "microsoft.com", "lycorp", "mlit.go.jp",
  "pref.", "city.", "town.", "go.jp", "yimg", "s.yimg", "baseconnect",
  "hakopro", "houjin.goo", "mapion", "freelance.web-box",
  "tabelog", "hotpepper", "jalan.net", "gurunavi",
  "indeed.com", "recruit.co.jp", "mynavi.jp",
  "doubleclick", "googletagmanager",
];

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

interface CrawlJob {
  id: string;
  status: "running" | "done" | "error";
  query: string;
  phase: string;
  progress: {
    sitesScanned: number;
    sitesTotal: number;
    emailsFound: number;
    currentSite: string;
  };
  startedAt: number;
  finishedAt?: number;
  error?: string;
}

const jobs = new Map<string, CrawlJob>();

function newJobId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

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

function extractCompanyName(html: string, siteUrl: string): string {
  const ogSite = html.match(/property=["']og:site_name["'][^>]*content=["']([^"']{2,60})["']/i)
    || html.match(/content=["']([^"']{2,60})["'][^>]*property=["']og:site_name["']/i);
  if (ogSite) {
    const name = ogSite[1].trim().slice(0, 40);
    if (name.length >= 2) return name;
  }

  const titleM = html.match(/<title[^>]*>([^<]{2,100})<\/title>/i);
  if (titleM) {
    let t = titleM[1]
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#?\w+;/g, "")
      .replace(/^.*[\|｜│\-–—]\s*/u, "")
      .replace(/\s+/g, " ")
      .trim();
    if (t.length < 2 && titleM[1]) {
      t = titleM[1].split(/[\|｜│\-–—]/u)[0].trim().replace(/\s+/g, " ");
    }
    if (t.length >= 2 && !/(top|home|index|ホーム|トップ|公式サイト|official|サービス紹介|フォーム|contact|お問い合わせ)/i.test(t)) {
      return t.slice(0, 40);
    }
  }

  try {
    const hostname = new URL(siteUrl).hostname.replace(/^www\./, "");
    return hostname.split(".")[0].slice(0, 40);
  } catch {
    return "";
  }
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
  const hrefRe = /href="(https?:\/\/[^"#?]{8,})"/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) urls.push(m[1]);

  const seen = new Set<string>();
  return urls.filter(u => {
    const lower = u.toLowerCase();
    if (seen.has(lower)) return false;
    if (SKIP_URL_PATTERNS.some(p => lower.includes(p))) return false;
    if (!lower.includes(".")) return false;
    try {
      const hostname = new URL(u).hostname;
      if (hostname.split(".").length < 2) return false;
    } catch { return false; }
    seen.add(lower);
    return true;
  });
}

function extractSubpages(baseUrl: string, html: string): string[] {
  const standardPaths = [
    "/contact", "/contact.html", "/contact/index.html", "/contact/",
    "/お問い合わせ", "/inquiry", "/inquiry.html",
    "/company", "/company.html", "/company/",
    "/about", "/about.html", "/about/",
    "/会社概要", "/profile", "/profile.html",
    "/corporate", "/corporate/index.html",
    "/aboutus", "/about-us",
  ];
  const keywords = [
    "contact", "お問い合わせ", "inquiry", "contact-us", "contactus",
    "company", "会社概要", "about", "profile", "corporate", "aboutus",
  ];

  let base: URL;
  try { base = new URL(baseUrl); } catch { return []; }

  const found: string[] = [];
  const hrefRe = /href="([^"]+)"/gi;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    const lower = href.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      try {
        const full = new URL(href, base.origin).toString();
        if (full.startsWith(base.origin)) found.push(full);
      } catch {}
    }
  }

  for (const path of standardPaths) {
    found.push(base.origin + path);
  }

  return [...new Set(found)].slice(0, 8);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCrawlJob(job: CrawlJob, query: string) {
  try {
    job.phase = "Yahoo検索中 (1/3ページ)";

    const allUrls: string[] = [];

    for (let page = 1; page <= 3; page++) {
      job.phase = `Yahoo検索中 (${page}/3ページ)`;
      const start = (page - 1) * 20 + 1;
      const yahooUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(query + " お問い合わせ メール")}&n=20&b=${start}`;

      const html = await fetchPage(yahooUrl, 15000);
      if (html) {
        const pageUrls = extractUrlsFromYahoo(html);
        allUrls.push(...pageUrls);
        logger.info({ page, urlsFound: pageUrls.length }, "Yahoo page crawled");
      }

      if (page < 3) await sleep(1500);
    }

    // Deduplicate by domain, cap at 40 sites
    const seenDomains = new Set<string>();
    const targetUrls: string[] = [];
    for (const u of allUrls) {
      try {
        const domain = new URL(u).hostname;
        if (!seenDomains.has(domain) && targetUrls.length < 40) {
          seenDomains.add(domain);
          targetUrls.push(u);
        }
      } catch {}
    }

    job.progress.sitesTotal = targetUrls.length;
    job.phase = "サイトクロール中";
    logger.info({ query, sitesTotal: targetUrls.length }, "Deep crawl job started");

    const seenEmails = new Set<string>();

    for (const siteUrl of targetUrls) {
      if (job.status !== "running") break;

      try {
        const hostname = new URL(siteUrl).hostname;
        job.progress.currentSite = hostname;
      } catch {}

      try {
        const pageHtml = await fetchPage(siteUrl, 10000);
        if (!pageHtml) {
          job.progress.sitesScanned++;
          await sleep(400);
          continue;
        }

        const company = extractCompanyName(pageHtml, siteUrl);
        const mainEmails = extractEmailsFromHtml(pageHtml);
        const newEmails = mainEmails.filter(e => !seenEmails.has(e.toLowerCase()));

        if (newEmails.length > 0) {
          await db.insert(crawlLeadsTable).values(
            newEmails.map(e => ({
              email: e.toLowerCase(),
              company: company || null,
              name: null,
              source: siteUrl,
            }))
          ).onConflictDoNothing();
          newEmails.forEach(e => seenEmails.add(e.toLowerCase()));
          job.progress.emailsFound += newEmails.length;
        }

        if (mainEmails.length === 0) {
          const subpages = extractSubpages(siteUrl, pageHtml);
          let foundOnSub = false;

          for (const subUrl of subpages.slice(0, 6)) {
            if (foundOnSub) break;
            await sleep(600);

            const subHtml = await fetchPage(subUrl, 8000);
            if (!subHtml) continue;

            const subEmails = extractEmailsFromHtml(subHtml);
            const newSubEmails = subEmails.filter(e => !seenEmails.has(e.toLowerCase()));

            if (newSubEmails.length > 0) {
              await db.insert(crawlLeadsTable).values(
                newSubEmails.map(e => ({
                  email: e.toLowerCase(),
                  company: company || null,
                  name: null,
                  source: subUrl,
                }))
              ).onConflictDoNothing();
              newSubEmails.forEach(e => seenEmails.add(e.toLowerCase()));
              job.progress.emailsFound += newSubEmails.length;
              foundOnSub = true;
            }
          }
        }
      } catch (err) {
        logger.warn({ siteUrl, err }, "Site crawl error");
      }

      job.progress.sitesScanned++;
      await sleep(800);
    }

    job.status = "done";
    job.phase = "完了";
    job.finishedAt = Date.now();
    logger.info({ query, emailsFound: job.progress.emailsFound, sitesScanned: job.progress.sitesScanned }, "Deep crawl job complete");
  } catch (err: any) {
    job.status = "error";
    job.phase = "エラー";
    job.error = err?.message || "Unknown error";
    job.finishedAt = Date.now();
    logger.error({ err, query }, "Crawl job failed");
  }
}

router.post("/crawl-job/start", async (req, res) => {
  if (!adminAuth(req, res)) return;
  const { query } = req.body as { query?: string };
  if (!query?.trim()) {
    res.status(400).json({ error: "query is required" });
    return;
  }

  const id = newJobId();
  const job: CrawlJob = {
    id,
    status: "running",
    query: query.trim(),
    phase: "開始中",
    progress: {
      sitesScanned: 0,
      sitesTotal: 0,
      emailsFound: 0,
      currentSite: "",
    },
    startedAt: Date.now(),
  };

  jobs.set(id, job);

  runCrawlJob(job, query.trim()).catch(err => {
    logger.error({ err }, "Crawl job unhandled error");
  });

  res.json({ jobId: id, status: "running" });
});

router.get("/crawl-job/:id", (req, res) => {
  if (!adminAuth(req, res)) return;
  const job = jobs.get(req.params.id);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(job);
});

export default router;
