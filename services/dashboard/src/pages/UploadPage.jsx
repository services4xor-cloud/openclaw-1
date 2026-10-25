/**
 * Upload Center — THE main page users interact with.
 *
 * FLOW: User uploads here → files go to media-worker → n8n orchestrates the rest.
 * This page calls media-worker directly for uploads (fast path),
 * then notifies n8n via webhook to start the content pipeline.
 */

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Image,
  Film,
  X,
  CloudUpload,
  Stamp,
  Sparkles,
  Check,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";

/** What happens after "Generate", one line per stage, ticked off as it completes. */
const RUN_STEPS = [
  { icon: Stamp, label: "Brand kit received" },
  { icon: CloudUpload, label: "Media uploaded" },
  { icon: Sparkles, label: "AI writes a post for every channel" },
  { icon: CalendarClock, label: "Best posting times planned" },
  { icon: CheckCircle2, label: "Ready for your approval" },
];

/** fetch that fails loudly: a non-2xx or a non-JSON answer (an error page) is an error. */
async function callJson(url, init) {
  const res = await fetch(url, init);
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("json")) {
    throw new Error(res.status === 404 ? "The service didn't answer (404)." : `The service answered ${res.status}.`);
  }
  return res.json();
}

function RunSteps({ phase, error, onRetry, onCancel }) {
  return (
    <Card className="mt-1">
      <ol>
        {RUN_STEPS.map(({ icon: Icon, label }, i) => {
          const failed = error && error.step === i;
          const last = i === RUN_STEPS.length - 1;
          const state = failed ? "failed" : i < phase || (last && phase === i) ? "done" : i === phase ? "active" : "todo";
          return (
            <li key={label} className="relative flex items-center gap-3 pb-5 last:pb-0">
              {!last && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-ink-700">
                  <span className="block w-full bg-accent-400 transition-all duration-700" style={{ height: i < phase ? "100%" : "0%" }} />
                </span>
              )}
              <span
                className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                  state === "done" ? "border-accent-400 bg-accent-400 text-ink-950"
                    : state === "active" ? "border-gold-500 bg-gold-500/15 text-gold-300"
                    : state === "failed" ? "border-red-400 bg-red-400/10 text-red-300"
                    : "border-ink-700 bg-ink-950 text-ink-500"
                }`}
              >
                {state === "done" ? <Check size={15} /> : state === "failed" ? <X size={15} /> : <Icon size={15} />}
                {state === "active" && <span className="absolute inset-0 animate-ping rounded-full border border-gold-500/60" />}
              </span>
              <span className={`text-sm ${state === "todo" ? "text-ink-500" : "text-ink-100"}`}>{label}</span>
            </li>
          );
        })}
      </ol>
      {error && (
        <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/5 p-3">
          <p className="text-sm text-red-200">This step didn't finish. {error.message} Nothing was posted.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={onRetry} className="btn btn-primary btn-sm">Try again</button>
            <button onClick={onCancel} className="btn btn-sm">Back to the form</button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [theme, setTheme] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [watermark, setWatermark] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [runError, setRunError] = useState(null); // { step, message }
  const fileInputRef = useRef(null);
  const watermarkInputRef = useRef(null);

  const handleFiles = useCallback((newFiles) => {
    const mediaFiles = Array.from(newFiles).filter((f) =>
      f.type.startsWith("image/") || f.type.startsWith("video/"),
    );
    setFiles((prev) => [...prev, ...mediaFiles]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!theme.trim()) return;
    setUploading(true);
    setRunError(null);
    let at = 0;
    const go = (i) => setPhase((at = i));
    let tick;

    try {
      // 1. Brand kit: the watermark is saved on the server for every later post
      go(0);
      let watermarkPath = null;
      if (watermark) {
        const wfData = new FormData();
        wfData.append("watermark", watermark);
        const wData = await callJson("/media-api/api/upload-watermark", { method: "POST", body: wfData });
        if (wData.ok) watermarkPath = wData.serverPath;
      }

      // 2. Media files into storage
      go(1);
      let uploadedFiles = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        const uData = await callJson("/media-api/api/upload", { method: "POST", body: formData });
        if (uData.ok) uploadedFiles = uData.files;
      }

      // 3–4. The content pipeline writes and plans the posts; it answers when done
      go(2);
      tick = setTimeout(() => go(3), 9000);
      await callJson("/webhook/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: uploadedFiles,
          theme,
          brandVoice,
          watermarkPath,
          uploadId: `upload-${Date.now()}`,
        }),
      });
      clearTimeout(tick);
      go(RUN_STEPS.length - 1);
      setTimeout(() => window.location.assign("/queue"), 1400);
    } catch (err) {
      clearTimeout(tick);
      console.error("Content run failed:", err);
      setRunError({ step: at, message: err.message });
    }
  };

  return (
    <PageShell
      title="Create posts"
      subtitle="Upload photos or videos. You get ready-to-approve posts for every channel."
    >
      {/* Drop zone */}
      <Card className="mb-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-ink-700 rounded-xl p-8 text-center cursor-pointer hover:border-accent-500/50 active:border-accent-500 transition-colors"
        >
          <CloudUpload
            className="mx-auto mb-3 text-ink-500"
            size={40}
            strokeWidth={1.5}
          />
          <p className="text-sm text-ink-300 font-medium">
            Tap to select or drop files
          </p>
          <p className="text-xs text-ink-500 mt-1">
            Images & videos — up to 500MB each
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </Card>

      {/* File preview grid */}
      {files.length > 0 && (
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ink-300">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-ink-500 hover:text-red-400"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-ink-800">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Film size={20} className="text-ink-500" />
                    <span className="text-[9px] text-ink-500 mt-1 truncate max-w-full px-1">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Watermark upload */}
      <Card className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Stamp size={18} className="text-accent-400" />
          <span className="text-sm font-medium text-ink-200">Watermark</span>
        </div>
        {watermark ? (
          <div className="flex items-center gap-3">
            <img
              src={URL.createObjectURL(watermark)}
              alt="Watermark"
              className="w-12 h-12 rounded-lg object-contain bg-ink-800 p-1"
            />
            <span className="text-xs text-ink-400 flex-1 truncate">
              {watermark.name}
            </span>
            <button
              onClick={() => setWatermark(null)}
              className="text-xs text-red-400"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => watermarkInputRef.current?.click()}
            className="w-full py-2.5 border border-dashed border-ink-700 rounded-xl text-xs text-ink-400 hover:border-accent-500/50"
          >
            Upload watermark image (PNG recommended)
          </button>
        )}
        <input
          ref={watermarkInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setWatermark(e.target.files?.[0] || null)}
        />
      </Card>

      {/* Theme & brand voice */}
      <Card className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles size={18} className="text-gold-400" />
          <span className="text-sm font-medium text-ink-200">
            Content Direction
          </span>
        </div>
        <textarea
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Describe the theme or direction... e.g. 'Summer fitness campaign, energetic vibe, beach aesthetics'"
          className="w-full bg-ink-800 border border-ink-700 rounded-xl px-3 py-2.5 text-sm text-ink-200 placeholder:text-ink-600 resize-none focus:outline-none focus:border-accent-500/50 mb-3"
          rows={3}
        />
        <textarea
          value={brandVoice}
          onChange={(e) => setBrandVoice(e.target.value)}
          placeholder="Brand voice notes... e.g. 'Casual but professional, use emoji sparingly, always include call-to-action'"
          className="w-full bg-ink-800 border border-ink-700 rounded-xl px-3 py-2.5 text-sm text-ink-200 placeholder:text-ink-600 resize-none focus:outline-none focus:border-accent-500/50"
          rows={2}
        />
      </Card>

      {uploading ? (
        <div ref={(el) => el?.scrollIntoView({ behavior: "smooth", block: "center" })}>
          <RunSteps phase={phase} error={runError} onRetry={handleUpload} onCancel={() => setUploading(false)} />
        </div>
      ) : (
        <button onClick={handleUpload} disabled={!theme.trim()} className="btn btn-primary w-full py-3.5">
          <Sparkles size={16} />
          Generate posts{files.length ? ` (${files.length} file${files.length !== 1 ? "s" : ""})` : ""}
        </button>
      )}
    </PageShell>
  );
}
