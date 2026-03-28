import { Router } from "express";
import { db, columnsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

const BASE_URL = "https://sinjapanai.site";

const STATIC_PAGES = [
  { loc: "/",          changefreq: "weekly",  priority: "1.0" },
  { loc: "/column",    changefreq: "daily",   priority: "0.9" },
  { loc: "/brochure",  changefreq: "monthly", priority: "0.7" },
  { loc: "/download",  changefreq: "monthly", priority: "0.7" },
  { loc: "/privacy",   changefreq: "yearly",  priority: "0.3" },
  { loc: "/terms",     changefreq: "yearly",  priority: "0.3" },
];

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const columns = await db.select({
      slug: columnsTable.slug,
      updatedAt: columnsTable.createdAt,
    }).from(columnsTable).orderBy(desc(columnsTable.createdAt));

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = STATIC_PAGES.map(p => `
  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

    const columnUrls = columns.map(c => `
  <url>
    <loc>${BASE_URL}/column/${c.slug}</loc>
    <lastmod>${c.updatedAt ? new Date(c.updatedAt).toISOString().split("T")[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${columnUrls}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Sitemap generation failed");
  }
});

export default router;
