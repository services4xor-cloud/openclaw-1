/**
 * Analytics — platform metrics and performance tracking.
 *
 * FLOW:
 *   - n8n (NERVOUS SYSTEM) collects metrics daily from platform APIs
 *   - Stored in Postgres platform_metrics + post_metrics tables
 *   - Dashboard fetches via n8n webhook and displays
 *   - OpenClaw (BRAIN) analyzes trends during weekly sprint planning
 */

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Users,
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";
import PlatformBadge from "../components/PlatformBadge.jsx";
import { unit, useText } from "../lib/i18n-workspace.js";

// Mock analytics — replaced by webhook data in production
const MOCK_METRICS = {
  instagram: {
    followers: 3200,
    followersDelta: 140,
    views: 24500,
    likes: 1800,
    shares: 320,
    comments: 95,
    topPost: "Morning routine Reel — 8.2K views",
  },
  tiktok: {
    followers: 1800,
    followersDelta: 280,
    views: 45000,
    likes: 3200,
    shares: 890,
    comments: 210,
    topPost: "POV morning routine — 22K views",
  },
  youtube: {
    followers: 450,
    followersDelta: 25,
    views: 8900,
    likes: 420,
    shares: 65,
    comments: 38,
    topPost: "5 Morning Habits Short — 4.1K views",
  },
  facebook: {
    followers: 890,
    followersDelta: -12,
    views: 5600,
    likes: 340,
    shares: 78,
    comments: 52,
    topPost: "Morning habits post — 2.1K reach",
  },
  whatsapp: {
    followers: 120,
    followersDelta: 8,
    views: 980,
    likes: 0,
    shares: 0,
    comments: 0,
    topPost: "Status viewed by 98 contacts",
  },
};

const METRIC_ICONS = {
  views: Eye,
  likes: Heart,
  shares: Share2,
  comments: MessageCircle,
};

export default function AnalyticsPage() {
  const { t, locale } = useText();
  const total = (key) => Object.values(MOCK_METRICS).reduce((sum, m) => sum + m[key], 0).toLocaleString(locale);
  const [period, setPeriod] = useState("7d");

  return (
    <PageShell
      title={t("a.title")}
      subtitle={t("a.sub")}
    >
      {/* Period selector */}
      <div className="flex gap-2 mb-4">
        {[
          { value: "7d", label: unit(locale, 7, "day") },
          { value: "30d", label: unit(locale, 30, "day") },
          { value: "90d", label: unit(locale, 90, "day") },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
              period === p.value
                ? "bg-accent-600/20 text-accent-400 ring-1 ring-accent-500/30"
                : "bg-ink-800 text-ink-500"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Overall summary */}
      <Card className="mb-4 bg-gradient-to-br from-ink-900 to-ink-800">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] text-ink-500 mb-1 flex items-center gap-1">
              <Users size={11} /> {t("a.followers")}
            </div>
            <div className="text-xl font-bold text-ink-100">
              {total("followers")}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={11} />
              {t("a.week", {
                n: `+${Object.values(MOCK_METRICS)
                  .reduce((sum, m) => sum + Math.max(0, m.followersDelta), 0)
                  .toLocaleString(locale)}`,
              })}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 mb-1 flex items-center gap-1">
              <Eye size={11} /> {t("a.views")}
            </div>
            <div className="text-xl font-bold text-ink-100">
              {total("views")}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 mb-1 flex items-center gap-1">
              <Heart size={11} /> {t("a.likes")}
            </div>
            <div className="text-xl font-bold text-ink-100">
              {total("likes")}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink-500 mb-1 flex items-center gap-1">
              <Share2 size={11} /> {t("a.shares")}
            </div>
            <div className="text-xl font-bold text-ink-100">
              {total("shares")}
            </div>
          </div>
        </div>
      </Card>

      {/* Per-platform breakdown */}
      {Object.entries(MOCK_METRICS).map(([platform, metrics]) => (
        <Card key={platform} className="mb-3">
          <div className="flex items-center justify-between mb-3">
            <PlatformBadge platform={platform} size="md" />
            <div className="flex items-center gap-1">
              <Users size={12} className="text-ink-500" />
              <span className="text-sm font-semibold text-ink-300">
                {metrics.followers.toLocaleString(locale)}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  metrics.followersDelta >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {metrics.followersDelta >= 0 ? "+" : ""}
                {metrics.followersDelta}
              </span>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {Object.entries(METRIC_ICONS).map(([key, Icon]) => (
              <div
                key={key}
                className="text-center bg-ink-800/50 rounded-lg py-2"
              >
                <Icon size={14} className="text-ink-500 mx-auto mb-1" />
                <div className="text-xs font-semibold text-ink-300">
                  {(metrics[key] || 0).toLocaleString(locale)}
                </div>
                <div className="text-[9px] text-ink-600">
                  {t(`a.${key}`)}
                </div>
              </div>
            ))}
          </div>

          {/* Top post */}
          {metrics.topPost && (
            <div className="text-[11px] text-ink-500 bg-ink-800/30 rounded-lg px-2.5 py-1.5">
              {t("a.top", { post: t(`a.top.${platform}`) })}
            </div>
          )}
        </Card>
      ))}
    </PageShell>
  );
}
