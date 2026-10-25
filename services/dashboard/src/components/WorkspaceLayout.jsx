/**
 * Workspace frame: the shared header (its menu switches between the services on
 * phones) and one tab row for the service you are in.
 */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader.jsx";
import { PRODUCT, useLang } from "../lib/i18n.jsx";

const SOCIAL_TABS = [
  ["/upload", "create"],
  ["/queue", "approve"],
  ["/campaign", "schedule"],
  ["/analytics", "results"],
];
const AGENT_TABS = [
  ["/team", "team"],
  ["/goals", "goals"],
];

export default function WorkspaceLayout() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const tabs = SOCIAL_TABS.some(([to]) => pathname.startsWith(to))
    ? { name: PRODUCT.social, items: SOCIAL_TABS }
    : AGENT_TABS.some(([to]) => pathname.startsWith(to))
      ? { name: PRODUCT.workflow, items: AGENT_TABS }
      : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader workspace />

      {tabs && (
        <div className="border-b border-ink-700 bg-ink-900">
          <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 sm:px-6">
            <span className="hidden shrink-0 py-3 text-sm font-semibold text-ink-300 lg:inline">{tabs.name}</span>
            <nav aria-label={tabs.name} className="flex gap-1">
              {tabs.items.map(([to, key]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `shrink-0 border-b-2 px-3 py-3 text-sm transition-colors ${
                      isActive ? "border-accent-400 text-ink-100" : "border-transparent text-ink-400 hover:text-ink-200"
                    }`
                  }
                >
                  {t.ws.tabs[key]}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-10">
        <Outlet />
      </main>
    </div>
  );
}
