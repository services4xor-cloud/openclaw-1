/**
 * Media Worker — FFmpeg Processing API
 *
 * RESPONSIBILITY: Video/image processing ONLY.
 *   - Apply watermarks
 *   - Create slideshows from images
 *   - Resize for each platform
 *   - Probe media metadata
 *
 * CALLED BY: n8n (via HTTP)
 * DOES NOT: Generate content, call AI, publish anything
 */

import express from "express";
import multer from "multer";
import { Worker } from "bullmq";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { processWatermark } from "./processors/watermark.mjs";
import { processSlideshow } from "./processors/slideshow.mjs";
import { processResize } from "./processors/resize.mjs";
import { probeMedia } from "./processors/probe.mjs";

const app = express();
const PORT = process.env.PORT || 3001;
const MEDIA_DIR = process.env.MEDIA_DIR || "/data/media";
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";

// Parse Redis connection for BullMQ
const redisUrl = new URL(REDIS_URL);
const redisConnection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || "6379"),
};

app.use(express.json({ limit: "10mb" }));

// File upload middleware
const upload = multer({
  dest: `${MEDIA_DIR}/inbox/`,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

// In-memory job status tracking
const jobs = new Map();

// ── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "media-worker", jobs: jobs.size });
});

// ── Upload media files (dashboard → server storage) ─────────────────────────
app.post("/api/upload", upload.array("files", 50), (req, res) => {
  const files = req.files?.map((f) => ({
    id: f.filename,
    originalName: f.originalname,
    path: f.path,
    size: f.size,
    mimeType: f.mimetype,
  }));
  res.json({ ok: true, files });
});

// ── Upload watermark (persists as default watermark) ─────────────────────────
const watermarkUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = `${MEDIA_DIR}/watermarks`;
      mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, _file, cb) => cb(null, "watermark.png"),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.post("/api/upload-watermark", watermarkUpload.single("watermark"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "No file received" });
  res.json({
    ok: true,
    path: req.file.path,
    serverPath: `${MEDIA_DIR}/watermarks/watermark.png`,
  });
});

// ── Probe media metadata ────────────────────────────────────────────────────
app.post("/api/probe", async (req, res) => {
  try {
    const { inputPath } = req.body;
    const metadata = await probeMedia(inputPath);
    res.json({ ok: true, metadata });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Apply watermark ─────────────────────────────────────────────────────────
app.post("/api/watermark", async (req, res) => {
  const jobId = randomUUID();
  const { inputPath, watermarkPath, position, opacity } = req.body;

  jobs.set(jobId, { status: "processing", progress: 0, startedAt: Date.now() });

  // Process async — return job ID immediately
  processWatermark({
    inputPath,
    watermarkPath: watermarkPath || `${MEDIA_DIR}/watermarks/default.png`,
    outputDir: `${MEDIA_DIR}/processed`,
    position: position || "bottom-right",
    opacity: opacity ?? 0.7,
    jobId,
  })
    .then((result) => {
      jobs.set(jobId, { status: "completed", ...result });
    })
    .catch((err) => {
      jobs.set(jobId, { status: "failed", error: err.message });
    });

  res.json({ ok: true, jobId });
});

// ── Create slideshow from images ────────────────────────────────────────────
app.post("/api/slideshow", async (req, res) => {
  const jobId = randomUUID();
  const { images, watermarkPath, musicPath, durationPerSlide, resolution } =
    req.body;

  jobs.set(jobId, { status: "processing", progress: 0, startedAt: Date.now() });

  processSlideshow({
    images,
    watermarkPath,
    musicPath,
    durationPerSlide: durationPerSlide || 3,
    resolution: resolution || "1080x1920",
    outputDir: `${MEDIA_DIR}/processed`,
    jobId,
  })
    .then((result) => {
      jobs.set(jobId, { status: "completed", ...result });
    })
    .catch((err) => {
      jobs.set(jobId, { status: "failed", error: err.message });
    });

  res.json({ ok: true, jobId });
});

// ── Resize for specific platform ────────────────────────────────────────────
app.post("/api/resize", async (req, res) => {
  const jobId = randomUUID();
  const { inputPath, platform } = req.body;

  jobs.set(jobId, { status: "processing", progress: 0, startedAt: Date.now() });

  processResize({
    inputPath,
    platform,
    outputDir: `${MEDIA_DIR}/output`,
    jobId,
  })
    .then((result) => {
      jobs.set(jobId, { status: "completed", ...result });
    })
    .catch((err) => {
      jobs.set(jobId, { status: "failed", error: err.message });
    });

  res.json({ ok: true, jobId });
});

// ── Batch process (watermark + resize all platforms) ────────────────────────
app.post("/api/batch", async (req, res) => {
  const jobId = randomUUID();
  const { inputPath, watermarkPath, position, opacity, platforms } = req.body;

  const targetPlatforms = platforms || [
    "instagram",
    "tiktok",
    "youtube",
    "facebook",
    "whatsapp",
  ];

  jobs.set(jobId, {
    status: "processing",
    progress: 0,
    totalSteps: targetPlatforms.length + 1,
    startedAt: Date.now(),
  });

  (async () => {
    try {
      // Step 1: Watermark
      const watermarked = await processWatermark({
        inputPath,
        watermarkPath: watermarkPath || `${MEDIA_DIR}/watermarks/default.png`,
        outputDir: `${MEDIA_DIR}/processed`,
        position: position || "bottom-right",
        opacity: opacity ?? 0.7,
        jobId: `${jobId}-watermark`,
      });

      jobs.set(jobId, { ...jobs.get(jobId), progress: 1 });

      // Step 2: Resize for each platform
      const outputs = {};
      for (let i = 0; i < targetPlatforms.length; i++) {
        const platform = targetPlatforms[i];
        outputs[platform] = await processResize({
          inputPath: watermarked.outputPath,
          platform,
          outputDir: `${MEDIA_DIR}/output`,
          jobId: `${jobId}-${platform}`,
        });
        jobs.set(jobId, { ...jobs.get(jobId), progress: i + 2 });
      }

      jobs.set(jobId, { status: "completed", watermarked, outputs });
    } catch (err) {
      jobs.set(jobId, { status: "failed", error: err.message });
    }
  })();

  res.json({ ok: true, jobId });
});

// ── Job status ──────────────────────────────────────────────────────────────
app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ ok: false, error: "Job not found" });
  res.json({ ok: true, ...job });
});

// ── Clean old jobs from memory ──────────────────────────────────────────────
setInterval(() => {
  const oneHourAgo = Date.now() - 3600_000;
  for (const [id, job] of jobs) {
    if (
      job.startedAt < oneHourAgo &&
      (job.status === "completed" || job.status === "failed")
    ) {
      jobs.delete(id);
    }
  }
}, 60_000);

// ── Queue API (direct DB access for dashboard) ─────────────────────────────
import pg from "pg";
const pool = new pg.Pool({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "openclaw_automation",
  user: process.env.DB_USER || "openclaw",
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
});

app.delete("/api/queue/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) return res.status(400).json({ ok: false, error: "Invalid ID" });
    await pool.query("DELETE FROM content_queue WHERE id = $1", [id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Team status for dashboard roster ─────────────────────────────────────
app.get("/api/team-status", async (_req, res) => {
  try {
    // Run all queries in parallel for speed
    const [
      queueStats,
      lastCaption,
      lastPublished,
      lastSprint,
      processingJobs,
    ] = await Promise.all([
      pool.query(`
        SELECT status, COUNT(*) as count
        FROM content_queue
        GROUP BY status
      `),
      pool.query(`
        SELECT created_at FROM content_queue
        ORDER BY created_at DESC LIMIT 1
      `),
      pool.query(`
        SELECT published_at, platform FROM content_queue
        WHERE status = 'published'
        ORDER BY published_at DESC LIMIT 1
      `),
      pool.query(`
        SELECT started_at, week_number, year FROM sprints
        ORDER BY started_at DESC LIMIT 1
      `),
      // Count today's activity
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM content_queue WHERE created_at >= CURRENT_DATE) as captions_today,
          (SELECT COUNT(*) FROM content_queue WHERE status = 'published' AND published_at >= CURRENT_DATE) as published_today,
          (SELECT COUNT(*) FROM content_queue WHERE status IN ('approved', 'scheduled')) as pending_schedule
      `),
    ]);

    const stats = Object.fromEntries(
      queueStats.rows.map((r) => [r.status, parseInt(r.count)])
    );
    const todayStats = processingJobs.rows[0] || {};

    // Active processing jobs from in-memory tracker
    const activeJobs = [...jobs.values()].filter(
      (j) => j.status === "processing"
    ).length;

    const agents = {
      caption_writer: {
        status: (todayStats.captions_today > 0 && Date.now() - new Date(lastCaption.rows[0]?.created_at).getTime() < 300_000)
          ? "working" : "idle",
        lastAction: lastCaption.rows[0]?.created_at || null,
        stat: todayStats.captions_today || 0,
        activity: todayStats.captions_today > 0
          ? `Generated ${todayStats.captions_today} captions today`
          : "Standing by for uploads",
        details: {
          "Today": `${todayStats.captions_today || 0} captions`,
          "In Stash": `${stats.stash || 0} posts`,
          "Total Queue": `${Object.values(stats).reduce((a, b) => a + b, 0)} items`,
          "Status": "Healthy",
        },
      },
      media_processor: {
        status: activeJobs > 0 ? "working" : "idle",
        lastAction: activeJobs > 0 ? new Date().toISOString() : lastCaption.rows[0]?.created_at,
        stat: activeJobs || jobs.size,
        activity: activeJobs > 0
          ? `Processing ${activeJobs} media files`
          : "Queue empty, standing by",
        details: {
          "Active Jobs": `${activeJobs}`,
          "Completed": `${[...jobs.values()].filter((j) => j.status === "completed").length}`,
          "Engine": "FFmpeg 7",
          "Status": "Healthy",
        },
      },
      sprint_planner: {
        status: lastSprint.rows[0] ? "sleeping" : "idle",
        lastAction: lastSprint.rows[0]?.started_at || null,
        stat: lastSprint.rows[0] ? `W${lastSprint.rows[0].week_number}` : null,
        activity: lastSprint.rows[0]
          ? `Sprint W${lastSprint.rows[0].week_number} active`
          : "Next run: Monday 8:00 AM",
        details: lastSprint.rows[0] ? {
          "Current Sprint": `Week ${lastSprint.rows[0].week_number}`,
          "Year": `${lastSprint.rows[0].year}`,
          "Schedule": "Mondays 08:00",
          "Status": "Sleeping",
        } : null,
      },
      scheduler: {
        status: (todayStats.pending_schedule > 0) ? "working" : "idle",
        lastAction: lastCaption.rows[0]?.created_at || null,
        stat: todayStats.pending_schedule || 0,
        activity: todayStats.pending_schedule > 0
          ? `${todayStats.pending_schedule} posts awaiting schedule`
          : "All posts scheduled",
        details: {
          "Approved": `${stats.approved || 0}`,
          "Scheduled": `${stats.scheduled || 0}`,
          "Cycle": "Every 15 min",
          "Status": "Healthy",
        },
      },
      publisher: {
        status: (todayStats.published_today > 0 && lastPublished.rows[0] && Date.now() - new Date(lastPublished.rows[0].published_at).getTime() < 300_000)
          ? "working" : todayStats.published_today > 0 ? "idle" : "sleeping",
        lastAction: lastPublished.rows[0]?.published_at || null,
        stat: todayStats.published_today || 0,
        activity: todayStats.published_today > 0
          ? `Published ${todayStats.published_today} posts today`
          : "Waiting for scheduled posts",
        details: {
          "Today": `${todayStats.published_today || 0} published`,
          "Last Platform": lastPublished.rows[0]?.platform || "—",
          "Failed": `${stats.failed || 0}`,
          "Cycle": "Every 15 min",
        },
      },
    };

    res.json({ ok: true, agents, updatedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/queue", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM content_queue ORDER BY created_at DESC LIMIT 100");
    res.json({ queue: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[media-worker] Listening on :${PORT}`);
  console.log(`[media-worker] Media dir: ${MEDIA_DIR}`);
});
