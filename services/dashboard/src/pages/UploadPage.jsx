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
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [theme, setTheme] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [watermark, setWatermark] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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
    setUploadProgress(0);

    try {
      // Open n8n executions in new tab so user can watch the pipeline
      window.open("/n8n/executions", "_blank");

      setUploadProgress(20);

      // Call the content pipeline webhook — this triggers:
      // n8n → Anthropic AI (captions) → Postgres (stash)
      const res = await fetch("/webhook/content-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: files.map((f) => ({ name: f.name, type: f.type })),
          theme,
          brandVoice,
          hasWatermark: !!watermark,
          uploadId: `upload-${Date.now()}`,
        }),
      });

      setUploadProgress(80);
      const data = await res.json();

      if (data.ok) {
        setUploadProgress(100);
        // Redirect to stash after short delay
        setTimeout(() => {
          window.location.hash = "#/queue";
          window.location.reload();
        }, 1000);
      } else {
        console.error("Pipeline error:", data);
        setUploading(false);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
    }
  };

  return (
    <PageShell
      title="Upload Center"
      subtitle="Drop your raw media — the system handles the rest"
    >
      {/* Drop zone */}
      <Card className="mb-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 active:border-violet-500 transition-colors"
        >
          <CloudUpload
            className="mx-auto mb-3 text-slate-500"
            size={40}
            strokeWidth={1.5}
          />
          <p className="text-sm text-slate-300 font-medium">
            Tap to select or drop files
          </p>
          <p className="text-xs text-slate-500 mt-1">
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
            <span className="text-sm font-medium text-slate-300">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-slate-500 hover:text-red-400"
            >
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Film size={20} className="text-slate-500" />
                    <span className="text-[9px] text-slate-500 mt-1 truncate max-w-full px-1">
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
          <Stamp size={18} className="text-violet-400" />
          <span className="text-sm font-medium text-slate-200">Watermark</span>
        </div>
        {watermark ? (
          <div className="flex items-center gap-3">
            <img
              src={URL.createObjectURL(watermark)}
              alt="Watermark"
              className="w-12 h-12 rounded-lg object-contain bg-slate-800 p-1"
            />
            <span className="text-xs text-slate-400 flex-1 truncate">
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
            className="w-full py-2.5 border border-dashed border-slate-700 rounded-xl text-xs text-slate-400 hover:border-violet-500/50"
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
          <Sparkles size={18} className="text-cyan-400" />
          <span className="text-sm font-medium text-slate-200">
            Content Direction
          </span>
        </div>
        <textarea
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Describe the theme or direction... e.g. 'Summer fitness campaign, energetic vibe, beach aesthetics'"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50 mb-3"
          rows={3}
        />
        <textarea
          value={brandVoice}
          onChange={(e) => setBrandVoice(e.target.value)}
          placeholder="Brand voice notes... e.g. 'Casual but professional, use emoji sparingly, always include call-to-action'"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500/50"
          rows={2}
        />
      </Card>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!theme.trim() || uploading}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all ${
          theme.trim() && !uploading
            ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white active:scale-[0.98] shadow-lg shadow-violet-500/20"
            : "bg-slate-800 text-slate-500 cursor-not-allowed"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {uploadProgress < 80 ? "AI generating captions..." : "Saving to stash..."} {uploadProgress}%
          </span>
        ) : (
          `Generate Content ${files.length ? `(${files.length} file${files.length !== 1 ? "s" : ""})` : ""}`
        )}
      </button>

      {/* Progress bar */}
      {uploading && (
        <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </PageShell>
  );
}
