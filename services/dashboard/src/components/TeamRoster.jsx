/**
 * Team Roster — shows the autonomous OpenClaw "crew" as agent cards.
 *
 * Each card maps to a REAL system component:
 *   - Caption Writer   → OpenClaw (Brain)
 *   - Media Processor   → FFmpeg Worker (Hands)
 *   - Sprint Planner    → OpenClaw + n8n cron (Brain)
 *   - Auto-Scheduler    → n8n workflow (Nervous System)
 *   - Publisher          → n8n workflow (Nervous System)
 *
 * Status data comes from /media-api/api/team-status which queries
 * the Postgres DB for recent activity timestamps + container health.
 */

import { useState, useEffect } from "react";
import {
  Pencil,
  Film,
  Zap,
  CalendarClock,
  Send,
  Brain,
  Cpu,
  Network,
  RefreshCw,
} from "lucide-react";
import Card from "./Card.jsx";

const AGENTS = [
  {
    key: "caption_writer",
    name: "Caption Writer",
    role: "Writes platform-specific captions & hashtags",
    system: "Social Media Automation",
    icon: Pencil,
    color: "violet",
    SystemIcon: Brain,
  },
  {
    key: "media_processor",
    name: "Media Processor",
    role: "Watermarks, resizes & creates slideshows",
    system: "Social Media Automation",
    icon: Film,
    color: "cyan",
    SystemIcon: Cpu,
  },
  {
    key: "sprint_planner",
    name: "Weekly Planner",
    role: "Reads the results and plans next week",
    system: "Agent Workflow Automation",
    icon: Zap,
    color: "amber",
    SystemIcon: Brain,
  },
  {
    key: "scheduler",
    name: "Auto-Scheduler",
    role: "Assigns publish times to approved posts",
    system: "Agent Workflow Automation",
    icon: CalendarClock,
    color: "emerald",
    SystemIcon: Network,
  },
  {
    key: "publisher",
    name: "Publisher",
    role: "Posts to Instagram, TikTok, YouTube, FB",
    system: "Social Media Automation",
    icon: Send,
    color: "rose",
    SystemIcon: Network,
  },
];

const COLOR_MAP = {
  violet: { bg: "bg-accent-500/10", text: "text-accent-400", ring: "ring-accent-500/30", pulse: "bg-accent-400" },
  cyan:   { bg: "bg-gold-500/10",   text: "text-gold-400",   ring: "ring-gold-500/30",   pulse: "bg-gold-400" },
  amber:  { bg: "bg-amber-500/10",  text: "text-amber-400",  ring: "ring-amber-500/30",  pulse: "bg-amber-400" },
  emerald:{ bg: "bg-emerald-500/10",text: "text-emerald-400",ring: "ring-emerald-500/30",pulse: "bg-emerald-400" },
  rose:   { bg: "bg-rose-500/10",   text: "text-rose-400",   ring: "ring-rose-500/30",   pulse: "bg-rose-400" },
};

const STATUS_CONFIG = {
  working:  { dot: "bg-accent-400", label: "Working", animate: true },
  idle:     { dot: "bg-emerald-400", label: "Ready", animate: false },
  sleeping: { dot: "bg-amber-400",  label: "Sleeping", animate: false },
  error:    { dot: "bg-red-400",    label: "Error", animate: true },
  offline:  { dot: "bg-ink-600",  label: "Offline", animate: false },
};

function timeAgo(ts) {
  if (!ts) return "never";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TeamRoster() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/media-api/api/team-status");
      if (res.ok) {
        setTeamData(await res.json());
      }
    } catch {
      // Silently fail — cards show "offline" when no data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getAgentStatus = (key) => {
    if (!teamData?.agents) return { status: "offline", lastAction: null, stat: null, activity: null };
    return teamData.agents[key] || { status: "idle", lastAction: null, stat: null, activity: null };
  };

  // Summary counts
  const counts = AGENTS.reduce(
    (acc, a) => {
      const s = getAgentStatus(a.key).status;
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-300">Working for you</span>
          <span className="text-[10px] text-ink-600 bg-ink-800 px-1.5 py-0.5 rounded">
            {AGENTS.length} workers
          </span>
        </div>
        <button
          onClick={() => { setLoading(true); fetchStatus(); }}
          className="text-ink-500 hover:text-ink-300 transition-colors"
          aria-label="Refresh team status"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 mb-3 text-[11px]">
        {counts.working > 0 && (
          <span className="text-accent-400 bg-accent-500/10 px-2 py-1 rounded-lg">
            {counts.working} working
          </span>
        )}
        {counts.idle > 0 && (
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
            {counts.idle} ready
          </span>
        )}
        {counts.sleeping > 0 && (
          <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
            {counts.sleeping} sleeping
          </span>
        )}
        {(counts.error > 0 || counts.offline > 0) && (
          <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded-lg">
            {(counts.error || 0) + (counts.offline || 0)} down
          </span>
        )}
      </div>

      {/* Agent cards */}
      {AGENTS.map((agent) => {
        const colors = COLOR_MAP[agent.color];
        const data = getAgentStatus(agent.key);
        const statusCfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.offline;
        const Icon = agent.icon;
        const SysIcon = agent.SystemIcon;
        const isExpanded = expanded === agent.key;

        return (
          <Card
            key={agent.key}
            className={`mb-2 transition-all ${isExpanded ? `ring-1 ${colors.ring}` : ""}`}
            onClick={() => setExpanded(isExpanded ? null : agent.key)}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className={`relative w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={colors.text} />
                {/* Status dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  {statusCfg.animate && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusCfg.dot} opacity-50`} />
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${statusCfg.dot}`} />
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-200 truncate">
                    {agent.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    data.status === "working"
                      ? "bg-accent-500/20 text-accent-300"
                      : data.status === "idle"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : data.status === "sleeping"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-ink-700 text-ink-400"
                  }`}>
                    {statusCfg.label}
                  </span>
                </div>
                <p className="text-[11px] text-ink-500 truncate mt-0.5">
                  {data.activity || agent.role}
                </p>
              </div>

              {/* Stat */}
              <div className="text-right shrink-0">
                {data.stat != null && (
                  <div className="text-sm font-semibold text-ink-300">{data.stat}</div>
                )}
                <div className="text-[10px] text-ink-600">
                  {timeAgo(data.lastAction)}
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-ink-800">
                <div className="flex items-center gap-1.5 mb-2">
                  <SysIcon size={12} className="text-ink-500" />
                  <span className="text-[10px] text-ink-500">{agent.system}</span>
                </div>
                {data.details && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {Object.entries(data.details).map(([key, val]) => (
                      <div key={key} className="bg-ink-800/50 rounded-lg px-2.5 py-1.5">
                        <span className="text-ink-500 block">{key}</span>
                        <span className="text-ink-300 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!data.details && (
                  <p className="text-[11px] text-ink-600 italic">
                    No detailed metrics available yet
                  </p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
