/**
 * Apply watermark overlay to video or image using FFmpeg.
 *
 * Positions: top-left, top-right, bottom-left, bottom-right, center
 * Opacity: 0.0 (invisible) to 1.0 (fully opaque)
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { basename, join } from "node:path";
import { randomUUID } from "node:crypto";
import { access } from "node:fs/promises";

const execFileAsync = promisify(execFile);

// Position mapping for FFmpeg overlay filter
const POSITIONS = {
  "top-left": "10:10",
  "top-right": "W-w-10:10",
  "bottom-left": "10:H-h-10",
  "bottom-right": "W-w-10:H-h-10",
  center: "(W-w)/2:(H-h)/2",
};

export async function processWatermark({
  inputPath,
  watermarkPath,
  outputDir,
  position = "bottom-right",
  opacity = 0.7,
  jobId,
}) {
  // Validate inputs exist
  await access(inputPath);
  await access(watermarkPath);

  const ext = inputPath.match(/\.(mp4|mov|avi|mkv|webm|jpg|jpeg|png|gif|webp)$/i)?.[1] || "mp4";
  const isImage = /^(jpg|jpeg|png|gif|webp)$/i.test(ext);
  const outputExt = isImage ? "png" : "mp4";
  const outputName = `${basename(inputPath, `.${ext}`)}-wm-${randomUUID().slice(0, 8)}.${outputExt}`;
  const outputPath = join(outputDir, outputName);

  const pos = POSITIONS[position] || POSITIONS["bottom-right"];

  if (isImage) {
    // Image watermark: scale watermark to 15% of image width, apply overlay
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-i", watermarkPath,
      "-filter_complex",
      `[1:v]scale=iw*0.15:-1,format=rgba,colorchannelmixer=aa=${opacity}[wm];[0:v][wm]overlay=${pos}`,
      outputPath,
    ], { timeout: 60_000 });
  } else {
    // Video watermark: scale watermark to 10% of video width
    await execFileAsync("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-i", watermarkPath,
      "-filter_complex",
      `[1:v]scale=iw*0.10:-1,format=rgba,colorchannelmixer=aa=${opacity}[wm];[0:v][wm]overlay=${pos}`,
      "-codec:a", "copy",
      "-movflags", "+faststart",
      outputPath,
    ], { timeout: 600_000 }); // 10 min timeout for video
  }

  return {
    outputPath,
    outputName,
    isImage,
  };
}
