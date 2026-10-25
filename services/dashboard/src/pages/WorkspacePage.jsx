/**
 * Workspace overview: both services side by side, each with its next actions.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Workflow, Upload, CheckCircle2, CalendarClock, BarChart3, Users, Target } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import { PRODUCT, useLang } from "../lib/i18n.jsx";

const SERVICES = [
  {
    key: "social",
    icon: Megaphone,
    actions: [
      ["/upload", Upload, "create"],
      ["/queue", CheckCircle2, "approve"],
      ["/campaign", CalendarClock, "schedule"],
      ["/analytics", BarChart3, "results"],
    ],
  },
  {
    key: "workflow",
    icon: Workflow,
    actions: [
      ["/team", Users, "team"],
      ["/goals", Target, "goals"],
    ],
  },
];

export default function WorkspacePage() {
  const { t } = useLang();
  return (
    <PageShell title={t.ws.title} subtitle={t.ws.sub} wide>
      <div className="grid gap-5 lg:grid-cols-2">
        {SERVICES.map(({ key, icon: Icon, actions }) => (
          <section key={key} className="card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/10 text-accent-400">
                <Icon size={20} />
              </span>
              <h2 className="text-lg font-semibold text-ink-100">{PRODUCT[key]}</h2>
            </div>
            <p className="mt-3 text-sm text-ink-400">{t.ws.leads[key]}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {actions.map(([to, A, action]) => {
                const [label, hint] = t.ws.actions[action];
                return (
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
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
