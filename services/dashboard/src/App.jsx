/**
 * 4XOR Studio: the workspace for Agent Workflow Automation and Social Media
 * Automation.
 *
 * Routes:
 *   /           → public front door (the two services, sign in)
 *   /try        → public live demo, one workflow of each service
 *   /profile    → the Be[X] account (sign-in from Studio lands here)
 *   /workspace  → overview of both services (sign-in required from here on)
 *   /upload /queue /campaign /analytics → Social Media Automation
 *   /team /goals                        → Agent Workflow Automation
 */

import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import WorkspaceLayout from "./components/WorkspaceLayout.jsx";
import WorkspacePage from "./pages/WorkspacePage.jsx";
import UploadPage from "./pages/UploadPage.jsx";
import CampaignPage from "./pages/CampaignPage.jsx";
import QueuePage from "./pages/QueuePage.jsx";
import GoalsPage from "./pages/GoalsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";
import TryPage from "./pages/TryPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/try" element={<TryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route element={<WorkspaceLayout />}>
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
