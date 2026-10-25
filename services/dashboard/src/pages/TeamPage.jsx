import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageShell from "../components/PageShell.jsx";
import TeamRoster from "../components/TeamRoster.jsx";

export default function TeamPage() {
  return (
    <PageShell title="Your AI team" subtitle="Each one has a job, works around the clock and reports what it did.">
      <TeamRoster />
      <Link to="/goals" className="btn btn-sm">
        See this week's plan <ArrowRight size={14} />
      </Link>
    </PageShell>
  );
}
