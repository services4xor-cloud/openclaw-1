/**
 * Workspace frame: the shared header, one tab row for the service you are in,
 * and a bottom bar on phones to switch between the two services.
 */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutGrid, Megaphone, Workflow } from "lucide-react";
import SiteHeader from "./SiteHeader.jsx";

const SOCIAL_TABS = [
  { to: "/upload", label: "Create" },
  { to: "/queue", label: "Approve" },
  { to: "/campaign", label: "Schedule" },
  { to: "/analytics", label: "Results" },
];
const AGENT_TABS = [
  { to: "/team", label: "Your AI team" },
  { to: "/goals", label: "Goals and weekly plan" },
];

const BOTTOM_NAV = [
  { to: "/workspace", icon: LayoutGrid, label: "Overview", match: ["/workspace"] },
  { to: "/upload", icon: Megaphone, label: "Social media", match: SOCIAL_TABS.map((t) => t.to) },
  { to: "/team", icon: Workflow, label: "Workflows", match: AGENT_TABS.map((t) => t.to) },
];

export default function WorkspaceLayout() {
  const { pathname } = useLocation();
  const tabs = SOCIAL_TABS.some((t) => pathname.startsWith(t.to))
    ? { name: "Social Media Automation", items: SOCIAL_TABS }
    : AGENT_TABS.some((t) => pathname.startsWith(t.to))
      ? { name: "Agent Workflow Automation", items: AGENT_TABS }
      : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader workspace />

      {tabs && (
        <div className="border-b border-ink-700 bg-ink-900">
          <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 sm:px-6">
            <span className="hidden shrink-0 py-3 text-sm font-semibold text-ink-300 lg:inline">{tabs.name}</span>
            <nav aria-label={tabs.name} className="flex gap-1">
              {tabs.items.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  className={({ isActive }) =>
                    `shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? "border-accent-400 text-ink-100"
                        : "border-transparent text-ink-400 hover:text-ink-200"
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-20 md:pb-10">
        <Outlet />
      </main>

      {/* Phones: switch between the services */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-deep/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
          {BOTTOM_NAV.map(({ to, icon: Icon, label, match }) => {
            const active = match.some((m) => pathname.startsWith(m));
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors ${
                  active ? "text-accent-300" : "text-[#c9d6cf]/70 active:text-white"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
