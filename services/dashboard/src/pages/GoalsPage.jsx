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

const GOAL_TYPE_META = {
  growth_kpi: { icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  business: { icon: Briefcase, color: "text-amber-400", bg: "bg-amber-500/10" },
  custom: { icon: Star, color: "text-violet-400", bg: "bg-violet-500/10" },
};

// Mock goals — replaced by n8n webhook data in production
const MOCK_GOALS = [
  { id: 1, type: "growth_kpi", title: "Instagram: 10K followers", target: 10000, current: 3200, status: "active" },
  { id: 2, type: "growth_kpi", title: "TikTok: 50K views/week", target: 50000, current: 12400, status: "active" },
  { id: 3, type: "business", title: "Website clicks: 500/month", target: 500, current: 180, status: "active" },
  { id: 4, type: "custom", title: "Consistent posting streak: 30 days", target: 30, current: 8, status: "active" },
];

const MOCK_SPRINT_TASKS = [
  { id: 1, title: "Create 5 Reels focused on product demos", platform: "instagram", status: "todo", priority: "high" },
  { id: 2, title: "Post 3 behind-the-scenes TikToks", platform: "tiktok", status: "in_progress", priority: "medium" },
  { id: 3, title: "Optimize hashtag strategy for reach", platform: null, status: "todo", priority: "high" },
  { id: 4, title: "A/B test caption styles on Facebook", platform: "facebook", status: "done", priority: "low" },
];

const PRIORITY_COLORS = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-slate-400",
};

const TASK_STATUS_STYLES = {
  todo: "bg-slate-700",
  in_progress: "bg-violet-600",
  done: "bg-emerald-600",
};

export default function GoalsPage() {
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
      title="Goals & Sprints"
      subtitle="Autonomous scrum — OpenClaw plans, n8n executes"
    >
      {/* Sprint overview */}
      <Card className="mb-4 bg-gradient-to-br from-violet-900/30 to-cyan-900/30 border-violet-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-slate-200">
            Current Sprint — Week 13
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          AI-generated sprint plan based on last week's performance. Updated every Monday.
        </p>
        <div className="flex gap-4 text-center">
          {["todo", "in_progress", "done"].map((status) => {
            const count = tasks.filter((t) => t.status === status).length;
            const labels = { todo: "To Do", in_progress: "Active", done: "Done" };
            return (
              <div key={status} className="flex-1">
                <div className="text-lg font-bold text-slate-200">{count}</div>
                <div className="text-[10px] text-slate-500">{labels[status]}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Goals */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-300">Goals</span>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 px-2.5 py-1.5 rounded-lg"
        >
          <Plus size={14} /> Add Goal
        </button>
      </div>

      {/* Add goal form */}
      {showAddGoal && (
        <Card className="mb-3 border-violet-500/30">
          <div className="flex gap-2 mb-2">
            {Object.entries(GOAL_TYPE_META).map(([type, meta]) => (
              <button
                key={type}
                onClick={() => setNewGoal((p) => ({ ...p, type }))}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium ${
                  newGoal.type === type
                    ? `${meta.bg} ${meta.color} ring-1 ring-current`
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {type === "growth_kpi" ? "Growth KPI" : type === "business" ? "Business" : "Custom"}
              </button>
            ))}
          </div>
          <input
            value={newGoal.title}
            onChange={(e) => setNewGoal((p) => ({ ...p, title: e.target.value }))}
            placeholder="Goal title..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 mb-2 focus:outline-none focus:border-violet-500/50"
          />
          <div className="flex gap-2">
            <input
              value={newGoal.target}
              onChange={(e) => setNewGoal((p) => ({ ...p, target: e.target.value }))}
              placeholder="Target number"
              type="number"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-violet-600 rounded-lg text-sm font-medium text-white"
            >
              Add
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
                <p className="text-sm text-slate-200 font-medium truncate">
                  {goal.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Sprint tasks */}
      <div className="mt-6 mb-3">
        <span className="text-sm font-semibold text-slate-300">Sprint Tasks</span>
        <span className="text-xs text-slate-500 ml-2">Generated by OpenClaw</span>
      </div>

      {tasks.map((task) => (
        <Card key={task.id} className="mb-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${TASK_STATUS_STYLES[task.status]}`}
            />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm ${task.status === "done" ? "text-slate-500 line-through" : "text-slate-300"}`}
              >
                {task.title}
              </p>
            </div>
            <span className={`text-[10px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </Card>
      ))}
    </PageShell>
  );
}
