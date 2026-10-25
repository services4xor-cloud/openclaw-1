/**
 * Shared header in the 4xor.de design: deep green bar with a teal rule on top,
 * the BE[ ] logo on the left and one call to action.
 * `workspace` swaps the public links for the workspace links.
 */
import { Link, NavLink } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo.jsx";
import { SITE, BOOK_URL } from "../lib/links.js";

const WORKSPACE_NAV = [
  { to: "/workspace", label: "Overview", end: true },
  { to: "/upload", label: "Social media" },
  { to: "/team", label: "Agent workflows" },
];

export default function SiteHeader({ workspace = false }) {
  return (
    <>
      {!workspace && (
        <aside aria-label="4XOR" className="bg-gradient-to-r from-deep via-accent-700 to-deep">
          <a
            href={SITE}
            className="flex min-h-[34px] items-center justify-center px-4 py-1.5 text-center text-[0.85rem] text-[#e3ece7] hover:underline"
          >
            <span>
              <b className="font-semibold text-gold-300">A 4XOR product.</b> AI agents and automation
              from Switzerland, see 4xor.de
            </span>
          </a>
        </aside>
      )}
      <header className="sticky top-0 z-40 border-b border-white/10 border-t-[3px] border-t-accent-400 bg-deep text-[#f3f5f2]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link to={workspace ? "/workspace" : "/"} aria-label="4XOR Studio" className="flex shrink-0 items-center gap-3 text-[#f3f5f2]">
            <AnimatedLogo size={34} />
            <span className="hidden border-l border-white/20 pl-3 font-brand text-[0.8rem] font-medium uppercase tracking-[0.22em] text-[#dfe8e3] sm:inline">
              Studio
            </span>
          </Link>

          {workspace ? (
            <nav aria-label="Workspace" className="hidden items-center gap-7 text-[0.95rem] md:flex">
              {WORKSPACE_NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className="nav-link"
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <nav aria-label="Main" className="hidden items-center gap-7 text-[0.95rem] md:flex">
              <a href="#agent-workflow" className="nav-link">Agent Workflow Automation</a>
              <a href="#social-media" className="nav-link">Social Media Automation</a>
            </nav>
          )}

          {workspace ? (
            <a href={SITE} className="nav-link text-[0.9rem]">4xor.de</a>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/workspace" className="nav-link hidden text-[0.95rem] sm:inline">Sign in</a>
              <a href={BOOK_URL} className="btn btn-on-deep btn-sm">Book a demo</a>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
