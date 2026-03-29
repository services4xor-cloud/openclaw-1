/**
 * Platform badge — shows platform name with color coding.
 * Used in queue cards and campaign config.
 */

const PLATFORM_COLORS = {
  instagram: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  tiktok: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  youtube: "bg-red-500/20 text-red-400 border-red-500/30",
  facebook: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  whatsapp: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const PLATFORM_LABELS = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

export default function PlatformBadge({ platform, size = "sm" }) {
  const colors = PLATFORM_COLORS[platform] || "bg-slate-500/20 text-slate-400";
  const label = PLATFORM_LABELS[platform] || platform;
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`inline-block rounded-full border font-medium ${colors} ${sizeClass}`}>
      {label}
    </span>
  );
}
