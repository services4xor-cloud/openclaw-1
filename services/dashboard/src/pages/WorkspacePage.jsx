/**
 * Workspace overview: both services side by side, each with its next actions.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Workflow, Upload, CheckCircle2, CalendarClock, BarChart3, Users, Target } from "lucide-react";
import PageShell from "../components/PageShell.jsx";

const SERVICES = [
  {
    name: "Social Media Automation",
    icon: Megaphone,
    lead: "Upload once. Posts for every channel are written, scheduled and waiting for your OK.",
    actions: [
      { to: "/upload", icon: Upload, label: "Create posts", hint: "Upload photos or videos" },
      { to: "/queue", icon: CheckCircle2, label: "Approve posts", hint: "You decide what goes out" },
      { to: "/campaign", icon: CalendarClock, label: "Posting schedule", hint: "How often per channel" },
      { to: "/analytics", icon: BarChart3, label: "Results", hint: "Reach and engagement" },
    ],
  },
  {
    name: "Agent Workflow Automation",
    icon: Workflow,
    lead: "Your AI team takes care of routine work every day and plans the next week from the results.",
    actions: [
      { to: "/team", icon: Users, label: "Your AI team", hint: "Who does what, right now" },
      { to: "/goals", icon: Target, label: "Goals and weekly plan", hint: "Set a target, get a plan" },
    ],
  },
];

export default function WorkspacePage() {
  return (
    <PageShell title="Your workspace" subtitle="Everything your 4XOR services do for you, in one place." wide>
      <div className="grid gap-5 lg:grid-cols-2">
        {SERVICES.map(({ name, icon: Icon, lead, actions }) => (
          <section key={name} className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/10 text-accent-400">
                <Icon size={20} />
              </span>
              <h2 className="text-lg font-semibold text-ink-100">{name}</h2>
            </div>
            <p className="mt-3 text-sm text-ink-400">{lead}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {actions.map(({ to, icon: A, label, hint }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center gap-3 rounded-lg border border-ink-700 bg-ink-950/40 px-3.5 py-3 transition-colors hover:border-accent-400/60"
                >
                  <A size={18} className="shrink-0 text-gold-500" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink-100">{label}</span>
                    <span className="block truncate text-xs text-ink-400">{hint}</span>
                  </span>
                  <ArrowRight size={14} className="text-ink-500 transition-colors group-hover:text-accent-400" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
