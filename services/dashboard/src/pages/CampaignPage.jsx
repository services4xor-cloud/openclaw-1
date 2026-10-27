/**
 * Campaign Configuration — set posting intervals and platform preferences.
 *
 * FLOW: Settings saved here → stored via n8n webhook → n8n uses them for scheduling.
 * OpenClaw is NOT involved in campaign config.
 */

import { useState } from "react";
import { Clock, ToggleLeft, ToggleRight, Music, Save } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";
import PlatformBadge from "../components/PlatformBadge.jsx";
import { unit, useText } from "../lib/i18n-workspace.js";

const DEFAULT_PLATFORMS = [
  { id: "instagram", enabled: true, postsPerDay: 3, intervalHours: 8, bestTimes: ["09:00", "13:00", "19:00"] },
  { id: "tiktok", enabled: true, postsPerDay: 3, intervalHours: 8, bestTimes: ["10:00", "14:00", "20:00"] },
  { id: "youtube", enabled: true, postsPerDay: 1, intervalHours: 24, bestTimes: ["12:00"] },
  { id: "facebook", enabled: true, postsPerDay: 2, intervalHours: 12, bestTimes: ["09:00", "18:00"] },
  { id: "whatsapp", enabled: true, postsPerDay: 1, intervalHours: 24, bestTimes: ["10:00"] },
];

export default function CampaignPage() {
  const { t, locale } = useText();
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [saving, setSaving] = useState(false);

  const togglePlatform = (id) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const updatePlatform = (id, field, value) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/webhook/update-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms }),
      });
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  };

  return (
    <PageShell
      title={t("cp.title")}
      subtitle={t("cp.sub")}
    >
      {/* Platform cards */}
      {platforms.map((platform) => (
        <Card key={platform.id} className="mb-3">
          <div className="flex items-center justify-between mb-3">
            <PlatformBadge platform={platform.id} size="md" />
            <button
              onClick={() => togglePlatform(platform.id)}
              role="switch"
              aria-checked={platform.enabled}
              aria-label={t("cp.toggle", { channel: platform.id })}
            >
              {platform.enabled ? (
                <ToggleRight size={28} className="text-accent-400" />
              ) : (
                <ToggleLeft size={28} className="text-ink-600" />
              )}
            </button>
          </div>

          {platform.enabled && (
            <div className="space-y-3">
              {/* Posts per day */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">{t("cp.perDay")}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updatePlatform(platform.id, "postsPerDay", Math.max(1, platform.postsPerDay - 1))
                    }
                    className="w-7 h-7 rounded-lg bg-ink-800 text-ink-300 text-sm font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold text-ink-200 w-6 text-center">
                    {platform.postsPerDay}
                  </span>
                  <button
                    onClick={() =>
                      updatePlatform(platform.id, "postsPerDay", Math.min(10, platform.postsPerDay + 1))
                    }
                    className="w-7 h-7 rounded-lg bg-ink-800 text-ink-300 text-sm font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Interval */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400 flex items-center gap-1.5">
                  <Clock size={12} /> {t("cp.interval")}
                </span>
                <span className="text-sm text-ink-300">
                  {t("cp.every", { h: unit(locale, platform.intervalHours, "hour", "short") })}
                </span>
              </div>

              {/* Best times */}
              <div>
                <span className="text-xs text-ink-400 block mb-1.5">
                  {t("cp.times")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {platform.bestTimes.map((time, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-ink-800 text-ink-300 px-2 py-1 rounded-lg"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm bg-gradient-to-r from-accent-600 to-gold-600 text-white active:scale-[0.98] transition-transform shadow-lg shadow-accent-500/20 flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {saving ? t("cp.saving") : t("cp.save")}
      </button>
    </PageShell>
  );
}
