import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import TeamRoster from "../components/TeamRoster.jsx";
import { useLang } from "../lib/i18n.jsx";

export default function TeamPage() {
  const { t } = useLang();
  return (
    <PageShell title={t.ws.tabs.team} subtitle={t.ws.teamSub}>
      <TeamRoster />
      <Link to="/goals" className="btn btn-sm">
        {t.ws.weekPlan} <ArrowRight size={14} className="flip-rtl" />
      </Link>
    </PageShell>
  );
}
