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

// ── Upload endpoint (dashboard uploads go here) ─────────────────────────────
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[media-worker] Listening on :${PORT}`);
  console.log(`[media-worker] Media dir: ${MEDIA_DIR}`);
});
