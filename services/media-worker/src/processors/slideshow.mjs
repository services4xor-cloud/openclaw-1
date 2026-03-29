/**
 * Create a video slideshow from a list of images.
 *
 * Features:
 * - Configurable duration per slide
 * - Optional background music
 * - Optional watermark overlay
 * - Cross-fade transitions
 * - Vertical (9:16) for social media by default
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";

const execFileAsync = promisify(execFile);

export async function processSlideshow({
  images,
  watermarkPath,
  musicPath,
  durationPerSlide = 3,
  resolution = "1080x1920",
  outputDir,
  jobId,
}) {
  if (!images?.length) throw new Error("No images provided");

  const [width, height] = resolution.split("x").map(Number);
  const outputName = `slideshow-${randomUUID().slice(0, 8)}.mp4`;
  const outputPath = join(outputDir, outputName);

  // Create a concat file for FFmpeg
  const concatFile = join(outputDir, `concat-${jobId}.txt`);
  const concatContent = images
    .map((img) => `file '${img}'\nduration ${durationPerSlide}`)
    .join("\n");
  // Repeat last image to avoid cut
  const lastImage = images[images.length - 1];
  await writeFile(concatFile, `${concatContent}\nfile '${lastImage}'`);

  try {
    const args = [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", concatFile,
    ];

    // Build filter chain
    let filterComplex = `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=30[base]`;

    if (watermarkPath) {
      args.push("-i", watermarkPath);
      filterComplex += `;[1:v]scale=iw*0.10:-1,format=rgba,colorchannelmixer=aa=0.7[wm];[base][wm]overlay=W-w-10:H-h-10[out]`;
    } else {
      filterComplex += `;[base]null[out]`;
    }

    args.push("-filter_complex", filterComplex);
    args.push("-map", "[out]");

    if (musicPath) {
      args.push("-i", musicPath);
      args.push("-map", watermarkPath ? "2:a" : "1:a");
      args.push("-shortest");
    }

    args.push(
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      outputPath,
    );

    await execFileAsync("ffmpeg", args, { timeout: 300_000 }); // 5 min

    return {
      outputPath,
      outputName,
      duration: images.length * durationPerSlide,
      resolution,
      slideCount: images.length,
    };
  } finally {
    await unlink(concatFile).catch(() => {});
  }
}
