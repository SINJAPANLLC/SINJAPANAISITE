import { Router } from "express";
import { db, visitorLogsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

interface GeoResult {
  country?: string; countryCode?: string; regionName?: string;
  city?: string; lat?: number; lon?: number; status?: string;
}

const geoCache = new Map<string, GeoResult>();

async function geoLookup(ip: string): Promise<GeoResult> {
  if (geoCache.has(ip)) return geoCache.get(ip)!;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon&lang=ja`);
    const data = await res.json() as GeoResult;
    if (data.status === "success") {
      geoCache.set(ip, data);
      return data;
    }
  } catch { /* ignore geo errors */ }
  return {};
}

function getBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "その他";
}

function getDevice(ua: string): string {
  if (/iPad/.test(ua)) return "タブレット";
  if (/iPhone|Android.*Mobile/.test(ua)) return "スマートフォン";
  return "PC";
}

function getClientIp(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0]).trim();
  return req.socket?.remoteAddress || req.ip || "";
}

// POST /api/track — called by frontend on each page load
router.post("/track", async (req, res) => {
  const { path, title, referrer, sessionId, timeOnPage } = req.body;
  const ua = req.headers["user-agent"] || "";
  const ip = getClientIp(req);

  // Fire-and-forget geo lookup and DB insert
  (async () => {
    const geo = await geoLookup(ip);
    try {
      await db.insert(visitorLogsTable).values({
        path: path || "/",
        title: title || "",
        ip: ip || null,
        country: geo.country || null,
        countryCode: geo.countryCode || null,
        region: geo.regionName || null,
        city: geo.city || null,
        lat: geo.lat?.toString() || null,
        lon: geo.lon?.toString() || null,
        userAgent: ua || null,
        browser: getBrowser(ua),
        device: getDevice(ua),
        referrer: referrer || null,
        sessionId: sessionId || null,
        timeOnPage: timeOnPage ? Number(timeOnPage) : null,
      });
    } catch (err) {
      logger.error({ err }, "Failed to save visitor log");
    }
  })();

  res.json({ ok: true });
});

// GET /api/track — admin fetch visitor logs
router.get("/track", async (req, res) => {
  const secret = req.headers["x-admin-token"];
  if (!secret || secret !== process.env.VITE_ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" }); return;
  }
  try {
    const logs = await db
      .select()
      .from(visitorLogsTable)
      .orderBy(desc(visitorLogsTable.createdAt))
      .limit(500);
    res.json(logs);
  } catch (err) {
    logger.error({ err }, "Failed to fetch visitor logs");
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
