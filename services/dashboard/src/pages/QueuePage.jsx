/**
 * Content Stash — the heart of the autonomous publishing system.
 *
 * KEY CONCEPT: One upload = one content group across ALL platforms.
 * When you approve a post, it gets published to ALL enabled platforms
 * with platform-adapted captions. One tap = Instagram + TikTok + YouTube
 * + Facebook + WhatsApp all scheduled automatically.
 *
 * FLOW:
 *   Upload → AI generates platform variants → grouped in STASH
 *   You approve THE GROUP (one tap) → ALL platform variants get scheduled
 *   System calculates runway → reminds you on WhatsApp/Telegram when low
 *
 * TABS:
 *   Stash     = AI-generated groups, waiting for your approval
 *   Scheduled = Approved, system is drip-feeding these
 *   Published = Already posted (history)
 */

import { useState, useMemo } from "react";
import {
  Check,
  X,
  Clock,
  CheckCheck,
  RefreshCw,
  Archive,
  CalendarClock,
  Send,
  AlertTriangle,
  Inbox,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";
import PlatformBadge from "../components/PlatformBadge.jsx";

// ── Mock data ───────────────────────────────────────────────────────────
// Each "group" is one upload with platform-adapted variants
const MOCK_GROUPS = [
  {
    id: "group-1",
    upload_id: 1,
    theme: "Morning routine wellness",
    status: "stash",
    created_at: "2026-03-28T14:00:00Z",
    thumbnail: null,
    variants: [
      { id: 1, platform: "instagram", caption: "Transform your morning routine with these simple steps. Small changes, big impact.", hashtags: ["#morningroutine", "#wellness", "#productivity", "#lifestyle", "#healthyhabits"] },
      { id: 2, platform: "tiktok", caption: "POV: When your morning routine actually hits different", hashtags: ["#fyp", "#morningroutine", "#viral", "#wellness"] },
      { id: 3, platform: "youtube", caption: "5 Morning Habits That Changed My Life | Quick Wellness Tips", hashtags: ["#shorts", "#morningroutine", "#wellness"] },
      { id: 4, platform: "facebook", caption: "Starting the day right makes all the difference. Here are my top 5 morning habits that transformed my energy levels. What's your #1 morning habit?", hashtags: ["#wellness", "#morningmotivation"] },
      { id: 5, platform: "whatsapp", caption: "Hey! Just tried something new with my mornings — check out what changed", hashtags: [] },
    ],
  },
  {
    id: "group-2",
    upload_id: 2,
    theme: "Workspace productivity",
    status: "stash",
    created_at: "2026-03-27T10:00:00Z",
    thumbnail: null,
    variants: [
      { id: 6, platform: "instagram", caption: "Your workspace is your sanctuary. Here's how I designed mine for maximum flow state.", hashtags: ["#workspace", "#productivity", "#minimalism"] },
      { id: 7, platform: "tiktok", caption: "My desk setup that 10x'd my productivity", hashtags: ["#fyp", "#desksetup", "#productivity"] },
      { id: 8, platform: "youtube", caption: "Desk Setup Tour 2026 — Minimal Productivity Setup", hashtags: ["#shorts", "#desksetup"] },
      { id: 9, platform: "facebook", caption: "Redesigned my workspace this weekend. The difference in focus has been wild. Anyone else find their environment affects their work?", hashtags: ["#productivity", "#workspace"] },
      { id: 10, platform: "whatsapp", caption: "Just redid my desk — the before/after is insane", hashtags: [] },
    ],
  },
  {
    id: "group-3",
    upload_id: 3,
    theme: "Consistency over motivation",
    status: "approved",
    approved_at: "2026-03-28T16:00:00Z",
    created_at: "2026-03-27T08:00:00Z",
    thumbnail: null,
    variants: [
      { id: 11, platform: "instagram", caption: "The secret to consistency isn't motivation — it's systems.", hashtags: ["#systems", "#habits", "#growthmindset"], scheduled_at: "2026-03-29T09:00:00Z" },
      { id: 12, platform: "tiktok", caption: "Wait for it... the productivity hack nobody talks about", hashtags: ["#fyp", "#productivity"], scheduled_at: "2026-03-29T10:00:00Z" },
      { id: 13, platform: "youtube", caption: "Why Motivation is a Lie — Build Systems Instead", hashtags: ["#shorts", "#motivation"], scheduled_at: "2026-03-29T12:00:00Z" },
      { id: 14, platform: "facebook", caption: "Stopped relying on motivation 6 months ago. Started building systems. Night and day difference.", hashtags: ["#mindset"], scheduled_at: "2026-03-29T18:00:00Z" },
      { id: 15, platform: "whatsapp", caption: "Biggest lesson this year: systems > motivation. Every time.", hashtags: [], scheduled_at: "2026-03-29T10:00:00Z" },
    ],
  },
  {
    id: "group-4",
    upload_id: 4,
    theme: "Monday mindset",
    status: "published",
    published_at: "2026-03-28T09:00:00Z",
    created_at: "2026-03-25T10:00:00Z",
    thumbnail: null,
    variants: [
      { id: 16, platform: "instagram", caption: "Monday mindset: Start before you're ready.", hashtags: ["#mondaymotivation"], published_at: "2026-03-28T09:00:00Z" },
      { id: 17, platform: "tiktok", caption: "This is your sign to just START", hashtags: ["#fyp", "#mondaymotivation"], published_at: "2026-03-28T10:00:00Z" },
    ],
  },
];

const MOCK_RUNWAY = [
  { platform: "instagram", posts_per_day: 3, days_remaining: 1.3, ready_count: 4 },
  { platform: "tiktok", posts_per_day: 3, days_remaining: 1.3, ready_count: 4 },
  { platform: "youtube", posts_per_day: 1, days_remaining: 3.0, ready_count: 3 },
  { platform: "facebook", posts_per_day: 2, days_remaining: 1.5, ready_count: 3 },
  { platform: "whatsapp", posts_per_day: 1, days_remaining: 3.0, ready_count: 3 },
];

const TABS = [
  { key: "stash", label: "Stash", icon: Inbox },
  { key: "approved", label: "Scheduled", icon: CalendarClock },
  { key: "published", label: "Published", icon: Send },
];

export default function QueuePage() {
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [runway, setRunway] = useState(MOCK_RUNWAY);
  const [activeTab, setActiveTab] = useState("stash");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredGroups = useMemo(
    () => groups.filter((g) => g.status === activeTab),
    [groups, activeTab],
  );

  const stashCount = groups.filter((g) => g.status === "stash").length;
  const lowestRunway = Math.min(...runway.map((r) => r.days_remaining));

  // ── Actions ─────────────────────────────────────────────────────────────

  /** Approve ONE group = all platform variants get scheduled */
  const approveGroup = async (groupId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, status: "approved", approved_at: new Date().toISOString() }
          : g,
      ),
    );
    try {
      await fetch("/webhook/approve-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });
    } catch {}
  };

  const skipGroup = async (groupId) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, status: "skipped" } : g)),
    );
    try {
      await fetch("/webhook/skip-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });
    } catch {}
  };

  const approveAll = async () => {
    const stashIds = groups.filter((g) => g.status === "stash").map((g) => g.id);
    setGroups((prev) =>
      prev.map((g) =>
        g.status === "stash"
          ? { ...g, status: "approved", approved_at: new Date().toISOString() }
          : g,
      ),
    );
    try {
      await fetch("/webhook/approve-all-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupIds: stashIds }),
      });
    } catch {}
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, runwayRes] = await Promise.all([
        fetch("/webhook/get-stash"),
        fetch("/webhook/get-runway"),
      ]);
      if (groupsRes.ok) {
        const data = await groupsRes.json();
        if (data.groups) setGroups(data.groups);
      }
      if (runwayRes.ok) {
        const data = await runwayRes.json();
        if (data.runway) setRunway(data.runway);
      }
    } catch {}
    setLoading(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <PageShell title="Content Stash" subtitle="One approval = all platforms, auto-scheduled">
      {/* Runway warning */}
      {lowestRunway < 3 && (
        <Card
          className={`mb-4 border ${
            lowestRunway < 1
              ? "border-red-500/40 bg-red-950/30"
              : "border-amber-500/30 bg-amber-950/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={18}
              className={`shrink-0 mt-0.5 ${lowestRunway < 1 ? "text-red-400" : "text-amber-400"}`}
            />
            <div>
              <p className="text-sm font-medium text-slate-200">
                {lowestRunway < 1
                  ? "Content runs out today — approve more from stash!"
                  : `~${Math.ceil(lowestRunway)} day${Math.ceil(lowestRunway) !== 1 ? "s" : ""} of content left`}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                {runway.map((r) => (
                  <span
                    key={r.platform}
                    className={`text-[11px] ${
                      r.days_remaining < 1 ? "text-red-400" : r.days_remaining < 3 ? "text-amber-400" : "text-slate-500"
                    }`}
                  >
                    {r.platform}: {r.days_remaining.toFixed(1)}d
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Runway bars */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Content Runway</span>
          <span className="text-[10px] text-slate-600">days remaining per platform</span>
        </div>
        <div className="space-y-2">
          {runway.map((r) => {
            const pct = Math.min((r.days_remaining / 7) * 100, 100);
            const color =
              r.days_remaining < 1
                ? "from-red-500 to-red-600"
                : r.days_remaining < 3
                  ? "from-amber-500 to-amber-600"
                  : "from-emerald-500 to-cyan-500";
            return (
              <div key={r.platform} className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 w-16 shrink-0 capitalize">{r.platform}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 w-8 text-right shrink-0">
                  {r.days_remaining.toFixed(1)}d
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-900 rounded-xl p-1">
        {TABS.map(({ key, label, icon: Icon }) => {
          const count = groups.filter((g) => g.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                activeTab === key ? "bg-slate-800 text-slate-200 shadow-sm" : "text-slate-500"
              }`}
            >
              <Icon size={13} />
              {label}
              {count > 0 && (
                <span className={`ml-0.5 text-[10px] px-1.5 rounded-full ${
                  activeTab === key ? "bg-violet-500/30 text-violet-300" : "bg-slate-800 text-slate-600"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Approve all — stash tab only */}
      {activeTab === "stash" && stashCount > 0 && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={fetchData}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 rounded-xl text-xs text-slate-300 active:bg-slate-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={approveAll}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-violet-600/20 rounded-xl text-xs text-violet-400 active:bg-violet-600/30 font-medium"
          >
            <CheckCheck size={14} />
            Approve All ({stashCount})
          </button>
        </div>
      )}

      {/* Group cards */}
      {filteredGroups.map((group) => {
        const isExpanded = expandedGroup === group.id;
        // Show first variant as preview (usually Instagram)
        const preview = group.variants[0];

        return (
          <Card key={group.id} className="mb-3">
            {/* Group header — theme + platforms */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-wrap gap-1">
                {group.variants.map((v) => (
                  <PlatformBadge key={v.platform} platform={v.platform} />
                ))}
              </div>
              {group.status === "stash" && (
                <div className="flex gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => approveGroup(group.id)}
                    className="h-8 px-3 rounded-lg bg-violet-600/20 flex items-center gap-1.5 active:bg-violet-600/40"
                    title="Approve for ALL platforms"
                  >
                    <Check size={14} className="text-violet-400" />
                    <span className="text-[11px] text-violet-400 font-medium">Approve</span>
                  </button>
                  <button
                    onClick={() => skipGroup(group.id)}
                    className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center active:bg-red-600/20"
                  >
                    <X size={14} className="text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Theme label */}
            <p className="text-[11px] text-slate-500 mb-1.5 font-medium uppercase tracking-wider">
              {group.theme}
            </p>

            {/* Preview caption (first platform) */}
            <p className="text-sm text-slate-300 leading-relaxed mb-2">
              {preview.caption}
            </p>

            {/* Expand to see all platform variants */}
            <button
              onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 mb-1"
            >
              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {isExpanded ? "Hide" : "Show"} all {group.variants.length} platform versions
            </button>

            {/* Expanded: all variants */}
            {isExpanded && (
              <div className="mt-2 space-y-2 border-t border-slate-800 pt-2">
                {group.variants.map((v) => (
                  <div key={v.id} className="bg-slate-800/50 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <PlatformBadge platform={v.platform} />
                      {v.scheduled_at && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1">
                          <CalendarClock size={10} />
                          {new Date(v.scheduled_at).toLocaleString("en-US", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{v.caption}</p>
                    {v.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {v.hashtags.map((tag, i) => (
                          <span key={i} className="text-[9px] text-violet-400/70">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Footer timestamp */}
            <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1">
              <Clock size={11} />
              {group.status === "approved" && group.approved_at
                ? `Approved ${new Date(group.approved_at).toLocaleString("en-US", { month: "short", day: "numeric" })} — system is scheduling`
                : group.status === "published" && group.published_at
                  ? `Published ${new Date(group.published_at).toLocaleString("en-US", { month: "short", day: "numeric" })}`
                  : `Added ${new Date(group.created_at).toLocaleString("en-US", { month: "short", day: "numeric" })}`}
            </div>
          </Card>
        );
      })}

      {/* Empty state */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Archive size={32} className="mx-auto mb-3 text-slate-700" />
          <p className="text-sm text-slate-500">
            {activeTab === "stash"
              ? "Stash is empty — upload media to generate content."
              : activeTab === "approved"
                ? "Nothing scheduled. Approve from stash to fill the pipeline."
                : "No posts published yet."}
          </p>
        </div>
      )}
    </PageShell>
  );
}
