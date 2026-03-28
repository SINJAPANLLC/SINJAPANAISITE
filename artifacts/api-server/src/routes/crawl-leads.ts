import { Router } from "express";
import { db, crawlLeadsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/crawl-leads", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(crawlLeadsTable)
      .orderBy(crawlLeadsTable.createdAt);
    res.json({ leads: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/crawl-leads", async (req, res) => {
  const items: { email: string; company?: string; name?: string; source?: string }[] =
    Array.isArray(req.body) ? req.body : [req.body];

  if (items.length === 0 || !items[0]?.email) {
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const inserted = await db
      .insert(crawlLeadsTable)
      .values(items.map(i => ({
        email: i.email.trim().toLowerCase(),
        company: i.company?.trim() || null,
        name: i.name?.trim() || null,
        source: i.source?.trim() || null,
      })))
      .onConflictDoNothing()
      .returning();
    res.json({ inserted: inserted.length, leads: inserted });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/crawl-leads/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });
  try {
    await db.delete(crawlLeadsTable).where(eq(crawlLeadsTable.id, id));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/crawl-leads", async (_req, res) => {
  try {
    await db.delete(crawlLeadsTable);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
