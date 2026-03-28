import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/news", async (_req, res) => {
  try {
    const items = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
    res.json(items);
  } catch (err) {
    logger.error({ err }, "Failed to fetch news");
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

router.post("/news", async (req, res) => {
  const secret = req.headers["x-admin-token"];
  if (!secret || secret !== process.env.VITE_ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" }); return;
  }
  const { date, category, title } = req.body;
  if (!date || !category || !title) {
    res.status(400).json({ error: "date, category, title required" }); return;
  }
  try {
    const [row] = await db.insert(newsTable).values({ date, category, title }).returning();
    res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to create news");
    res.status(500).json({ error: "Failed to create news" });
  }
});

router.delete("/news/:id", async (req, res) => {
  const secret = req.headers["x-admin-token"];
  if (!secret || secret !== process.env.VITE_ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" }); return;
  }
  try {
    await db.delete(newsTable).where(eq(newsTable.id, Number(req.params.id)));
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to delete news");
    res.status(500).json({ error: "Failed to delete news" });
  }
});

export default router;
