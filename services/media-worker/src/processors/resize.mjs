/**
 * Resize media for specific social media platforms.
 *
 * Each platform has different optimal specs:
 *   Instagram Reels:  1080x1920, max 90s,  H.264
 *   TikTok:           1080x1920, max 10m,  H.264
 *   YouTube Shorts:   1080x1920, max 60s,  H.264
 *   Facebook Reels:   1080x1920, max 90s,  H.264
 *   WhatsApp Status:  1080x1920, max 30s,  H.264
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";

const execFileAsync = promisify(execFile);

const PLATFORM_SPECS = {
  instagram: { width: 1080, height: 1920, maxDuration: 90, label: "Instagram Reels" },
  tiktok:    { width: 1080, height: 1920, maxDuration: 600, label: "TikTok" },
  youtube:   { width: 1080, height: 1920, maxDuration: 60, label: "YouTube Shorts" },
  facebook:  { width: 1080, height: 1920, maxDuration: 90, label: "Facebook Reels" },
  whatsapp:  { width: 1080, height: 1920, maxDuration: 30, label: "WhatsApp Status" },
};

export async function processResize({ inputPath, platform, outputDir, jobId }) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) {
    throw new Error(`Unknown platform: ${platform}. Supported: ${Object.keys(PLATFORM_SPECS).join(", ")}`);
  }

  const ext = inputPath.match(/\.(\w+)$/)?.[1] || "mp4";
  const isImage = /^(jpg|jpeg|png|gif|webp)$/i.test(ext);

  const outputName = `${basename(inputPath, `.${ext}`)}-${platform}-${randomUUID().slice(0, 8)}.${isImage ? "png" : "mp4"}`;
  const outputPath = join(outputDir, outputName);

  if (isImage) {
    // For images: scale and pad to platform dimensions
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-vf", `scale=${spec.width}:${spec.height}:force_original_aspect_ratio=decrease,pad=${spec.width}:${spec.height}:(ow-iw)/2:(oh-ih)/2:black`,
      outputPath,
    ], { timeout: 60_000 });
  } else {
    // For video: resize, enforce duration limit, optimize codec
    const args = [
      "-y",
      "-i", inputPath,
      "-vf", `scale=${spec.width}:${spec.height}:force_original_aspect_ratio=decrease,pad=${spec.width}:${spec.height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1`,
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
    ];

    // Enforce max duration
    if (spec.maxDuration) {
      args.push("-t", String(spec.maxDuration));
    }

    args.push(outputPath);

    await execFileAsync("ffmpeg", args, { timeout: 600_000 });
  }

  return {
    outputPath,
    outputName,
    platform,
    resolution: `${spec.width}x${spec.height}`,
    maxDuration: spec.maxDuration,
    label: spec.label,
  };
}
