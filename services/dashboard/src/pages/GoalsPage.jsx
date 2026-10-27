/**
 * Scrum Board / Goals — autonomous goal tracking and sprint management.
 *
 * FLOW:
 *   - User defines goals here → stored via n8n webhook in Postgres
 *   - Weekly: n8n triggers OpenClaw (BRAIN) to analyze metrics and plan sprints
 *   - OpenClaw returns sprint tasks → n8n stores them → Dashboard shows them
 *   - Daily: n8n collects metrics → updates goal progress → Dashboard reflects it
 */

import { useState } from "react";
import {
  Target,
  TrendingUp,
  Briefcase,
  Star,
  Plus,
  ChevronRight,
  Zap,
} from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import Card from "../components/Card.jsx";
import { useText } from "../lib/i18n-workspace.js";

const GOAL_TYPE_META = {
  growth_kpi: { icon: TrendingUp, color: "text-gold-400", bg: "bg-gold-500/10" },
  business: { icon: Briefcase, color: "text-amber-400", bg: "bg-amber-500/10" },
  custom: { icon: Star, color: "text-accent-400", bg: "bg-accent-500/10" },
};

// Mock goals — replaced by webhook data in production
const MOCK_GOALS = [
  { id: 1, type: "growth_kpi", titleKey: "g.mock.1", target: 10000, current: 3200, status: "active" },
  { id: 2, type: "growth_kpi", titleKey: "g.mock.2", target: 50000, current: 12400, status: "active" },
  { id: 3, type: "business", titleKey: "g.mock.3", target: 500, current: 180, status: "active" },
  { id: 4, type: "custom", titleKey: "g.mock.4", target: 30, current: 8, status: "active" },
];

const MOCK_SPRINT_TASKS = [
  { id: 1, titleKey: "g.task.1", platform: "instagram", status: "todo", priority: "high" },
  { id: 2, titleKey: "g.task.2", platform: "tiktok", status: "in_progress", priority: "medium" },
  { id: 3, titleKey: "g.task.3", platform: null, status: "todo", priority: "high" },
  { id: 4, titleKey: "g.task.4", platform: "facebook", status: "done", priority: "low" },
];

const PRIORITY_COLORS = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-ink-400",
};

const TASK_STATUS_STYLES = {
  todo: "bg-ink-700",
  in_progress: "bg-accent-600",
  done: "bg-emerald-600",
};

/** ISO week number, as on Swiss calendars */
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
}

export default function GoalsPage() {
  const { t, locale } = useText();
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [tasks, setTasks] = useState(MOCK_SPRINT_TASKS);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: "growth_kpi", title: "", target: "" });

  const addGoal = async () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal = {
      id: Date.now(),
      ...newGoal,
      target: Number(newGoal.target),
      current: 0,
      status: "active",
    };
    setGoals((prev) => [...prev, goal]);
    setShowAddGoal(false);
    setNewGoal({ type: "growth_kpi", title: "", target: "" });

    try {
      await fetch("/webhook/add-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      });
    } catch {}
  };

  return (
    <PageShell
      title={t("g.title")}
      subtitle={t("g.sub")}
    >
      {/* Sprint overview */}
      <Card className="mb-4 bg-gradient-to-br from-accent-900/30 to-gold-900/30 border-accent-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-accent-400" />
          <span className="text-sm font-semibold text-ink-200">
            {t("g.week", { n: isoWeek() })}
          </span>
        </div>
        <p className="text-xs text-ink-400 mb-3">
          {t("g.weekSub")}
        </p>
        <div className="flex gap-4 text-center">
          {["todo", "in_progress", "done"].map((status) => {
            const count = tasks.filter((task) => task.status === status).length;
            const labels = { todo: t("g.todo"), in_progress: t("g.active"), done: t("g.done") };
            return (
              <div key={status} className="flex-1">
                <div className="text-lg font-bold text-ink-200">{count}</div>
                <div className="text-[10px] text-ink-500">{labels[status]}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goals */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-ink-300">{t("g.goals")}</span>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1 text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1.5 rounded-lg"
        >
          <Plus size={14} /> {t("g.add")}
        </button>
      </div>

      {/* Add goal form */}
      {showAddGoal && (
        <Card className="mb-3 border-accent-500/30">
          <div className="flex gap-2 mb-2">
            {Object.entries(GOAL_TYPE_META).map(([type, meta]) => (
              <button
                key={type}
                onClick={() => setNewGoal((p) => ({ ...p, type }))}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium ${
                  newGoal.type === type
                    ? `${meta.bg} ${meta.color} ring-1 ring-current`
                    : "bg-ink-800 text-ink-500"
                }`}
              >
                {t(`g.type.${type}`)}
              </button>
            ))}
          </div>
          <input
            value={newGoal.title}
            onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
            placeholder={t("g.titlePh")}
            className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm text-ink-200 placeholder:text-ink-600 mb-2 focus:outline-none focus:border-accent-500/50"
          />
          <div className="flex gap-2">
            <input
              value={newGoal.target}
              onChange={(e) => setNewGoal((p) => ({ ...p, target: e.target.value }))}
              placeholder={t("g.targetPh")}
              type="number"
              className="flex-1 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-sm text-ink-200 placeholder:text-ink-600 focus:outline-none focus:border-accent-500/50"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-accent-600 rounded-lg text-sm font-medium text-white"
            >
              {t("g.addBtn")}
            </button>
          </div>
        </Card>
      )}

      {goals.map((goal) => {
        const meta = GOAL_TYPE_META[goal.type] || GOAL_TYPE_META.custom;
        const Icon = meta.icon;
        const progress = Math.min((goal.current / goal.target) * 100, 100);

        return (
          <Card key={goal.id} className="mb-2">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={meta.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink-200 font-medium truncate">
                  {goal.titleKey ? t(goal.titleKey) : goal.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-500 to-gold-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-ink-500 shrink-0">
                    {goal.current.toLocaleString(locale)} / {goal.target.toLocaleString(locale)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Sprint tasks */}
      <div className="mt-6 mb-3">
        <span className="text-sm font-semibold text-ink-300">{t("g.tasks")}</span>
        <span className="text-xs text-ink-500 ms-2">{t("g.tasksBy")}</span>
      </div>

      {tasks.map((task) => (
        <Card key={task.id} className="mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${TASK_STATUS_STYLES[task.status]}`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${task.status === "done" ? "text-ink-500 line-through" : "text-ink-300"}`}
              >
                {task.titleKey ? t(task.titleKey) : task.title}
              </p>
            </div>
            <span className={`text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {t(`g.prio.${task.priority}`)}
            </span>
          </div>
        </Card>
      ))}
    </PageShell>
  );
}
