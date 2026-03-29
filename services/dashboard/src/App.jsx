/**
 * OpenClaw Dashboard — Mobile-First Social Media Automation
 *
 * RESPONSIBILITY: User interface ONLY.
 * All actions go through n8n webhooks → n8n orchestrates → OpenClaw thinks.
 * The dashboard NEVER calls OpenClaw directly.
 *
 * Routes:
 *   /         → Upload Center (home)
 *   /campaign → Campaign Config
 *   /queue    → Content Queue
 *   /goals    → Scrum Board
 *   /analytics → Analytics
 */

import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  Upload,
  Settings,
  LayoutList,
  Target,
  BarChart3,
} from "lucide-react";
import UploadPage from "./pages/UploadPage.jsx";
import CampaignPage from "./pages/CampaignPage.jsx";
import QueuePage from "./pages/QueuePage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";

const NAV_ITEMS = [
  { to: "/", icon: Upload, label: "Upload" },
  { to: "/campaign", icon: Settings, label: "Campaign" },
  { to: "/queue", icon: LayoutList, label: "Stash" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-dvh flex flex-col bg-slate-950">
      {/* Header — minimal on mobile */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
            OC
          </div>
          <span className="text-sm font-semibold text-slate-200 hidden sm:inline">
            OpenClaw Automation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            System Active
          </span>
        </div>
      </header>

      {/* Main content — scrollable area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/campaign" element={<CampaignPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>

      {/* Bottom nav — mobile-first tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 safe-bottom">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-violet-400"
                    : "text-slate-500 active:text-slate-300"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
