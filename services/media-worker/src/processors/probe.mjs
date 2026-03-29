/**
 * Probe media files for metadata using FFprobe.
 * Returns: duration, resolution, codec, format, file size.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { stat } from "node:fs/promises";

const execFileAsync = promisify(execFile);

export async function probeMedia(inputPath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "quiet",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    inputPath,
  ], { timeout: 30_000 });

  const info = JSON.parse(stdout);
  const videoStream = info.streams?.find((s) => s.codec_type === "video");
  const audioStream = info.streams?.find((s) => s.codec_type === "audio");
  const fileStat = await stat(inputPath);

  return {
    duration: parseFloat(info.format?.duration || "0"),
    width: videoStream?.width || null,
    height: videoStream?.height || null,
    codec: videoStream?.codec_name || null,
    audioCodec: audioStream?.codec_name || null,
    format: info.format?.format_name || null,
    bitrate: parseInt(info.format?.bit_rate || "0"),
    fileSize: fileStat.size,
    isVideo: !!videoStream,
    isImage: videoStream && !audioStream && parseFloat(info.format?.duration || "0") === 0,
    hasAudio: !!audioStream,
  };
}
