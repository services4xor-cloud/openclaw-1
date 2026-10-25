/**
 * Public front door of 4XOR Studio: the two services in outcome language, and
 * the way into the workspace. Everything below /workspace asks for a sign-in.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Check, Workflow, Megaphone } from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { BOOK_URL, PRODUCT_URL } from "../lib/links.js";

const PRODUCTS = [
  {
    id: "agent-workflow",
    icon: Workflow,
    name: "Agent Workflow Automation",
    lead: "Your routine work runs by itself, and your team approves what matters.",
    outcomes: [
      "New leads get an answer in minutes",
      "Bookings land in your calendar",
      "Emails and reports go out on time",
      "Your tools pass data to each other, no copy and paste",
    ],
    note: "Start with one process and add the next once it pays off.",
    more: PRODUCT_URL.workflows,
    flow: "workflow",
  },
  {
    id: "social-media",
    icon: Megaphone,
    name: "Social Media Automation",
    lead: "Your channels stay active every week while you work on customers.",
    outcomes: [
      "One upload becomes posts for every channel",
      "Captions and hashtags written in your voice",
      "Posts scheduled at the right times",
      "Nothing goes out until you approve it",
    ],
    note: "Instagram, TikTok, YouTube, Facebook and WhatsApp.",
    more: PRODUCT_URL.social,
    flow: "social",
  },
];

const STEPS = ["Discover", "Prototype", "Build", "Go live"];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <p className="eyebrow">4XOR Studio</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.4rem] leading-[1.1] text-ink-100 sm:text-[3.4rem]">
            Your business keeps running while you focus on customers.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-400">
            Two ready-made AI services, set up and run by 4XOR. Your Studio workspace shows what
            they do for you, and you approve what goes out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/try" className="btn btn-primary">
              Try it live <ArrowRight size={16} />
            </Link>
            <a href="/workspace" className="btn">Sign in to your workspace</a>
          </div>
        </section>

        {/* The two services */}
        <section aria-label="Services" className="mx-auto grid max-w-6xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2">
          {PRODUCTS.map(({ id, icon: Icon, name, lead, outcomes, note, more, flow }) => (
            <article id={id} key={id} className="card scroll-mt-24 flex flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/10 text-accent-400">
                  <Icon size={20} />
                </span>
                <h2 className="text-xl font-semibold text-ink-100">{name}</h2>
              </div>
              <p className="mt-4 text-ink-300">{lead}</p>
              <ul className="mt-5 space-y-2.5">
                {outcomes.map((o) => (
                  <li key={o} className="flex gap-2.5 text-[0.95rem] text-ink-200">
                    <Check size={18} className="mt-0.5 shrink-0 text-gold-500" />
                    {o}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-400">{note}</p>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <Link to={`/try?flow=${flow}`} className="btn btn-primary btn-sm">
                  Try it live <ArrowRight size={14} />
                </Link>
                <a href={more} className="btn btn-sm">Request this service</a>
              </div>
            </article>
          ))}
        </section>

        {/* How it starts, the same four steps as on 4xor.de */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Live in 30 days</p>
              <ol className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-200">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span>
                      <span className="mr-1.5 font-brand text-sm text-gold-500">{i + 1}</span>
                      {s}
                    </span>
                    {i < STEPS.length - 1 && <span aria-hidden="true" className="text-ink-600">/</span>}
                  </li>
                ))}
              </ol>
            </div>
            <a href={BOOK_URL} className="btn btn-primary shrink-0">Book a demo</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
