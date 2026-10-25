/**
 * Public front door of 4XOR Studio: the two services in outcome language, and
 * the ways in: the live demo and the workspace (which asks for a sign-in).
 */
import { Link } from "react-router-dom";
import { ArrowRight, Check, Workflow, Megaphone } from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { PRODUCT, useLang } from "../lib/i18n.jsx";
import { bookUrl, productUrl } from "../lib/links.js";

const PRODUCTS = [
  { id: "agent-workflow", flow: "workflow", icon: Workflow },
  { id: "social-media", flow: "social", icon: Megaphone },
];

export default function LandingPage() {
  const { lang, t } = useLang();
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
          <p className="eyebrow">{t.landing.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.4rem] leading-[1.1] text-ink-100 sm:text-[3.4rem]">{t.landing.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-400">{t.landing.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/try" className="btn btn-primary">
              {t.tryLive} <ArrowRight size={16} />
            </Link>
            <a href="/workspace" className="btn">{t.workspaceSignIn}</a>
          </div>
        </section>

        {/* The two services */}
        <section aria-label={t.groups.services} className="mx-auto grid max-w-6xl gap-5 px-4 pb-12 sm:px-6 md:grid-cols-2">
          {PRODUCTS.map(({ id, flow, icon: Icon }) => {
            const p = t.products[flow];
            return (
              <article id={id} key={id} className="card flex scroll-mt-24 flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-400/10 text-accent-400">
                    <Icon size={20} />
                  </span>
                  <h2 className="text-xl font-semibold text-ink-100">{PRODUCT[flow]}</h2>
                </div>
                <p className="mt-4 text-ink-300">{p.lead}</p>
                <ul className="mt-5 space-y-2.5">
                  {p.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-[0.95rem] text-ink-200">
                      <Check size={18} className="mt-0.5 shrink-0 text-gold-500" />
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-ink-400">{p.note}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <Link to={`/try?flow=${flow}`} className="btn btn-primary btn-sm">
                    {t.tryLive} <ArrowRight size={14} />
                  </Link>
                  <a href={productUrl(flow, lang)} className="btn btn-sm">{t.request}</a>
                </div>
              </article>
            );
          })}
        </section>

        {/* How it starts, the same four steps as on 4xor.de */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">{t.landing.steps}</p>
              <ol className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-200">
                {t.landing.stepNames.map((s, i, all) => (
                  <li key={s} className="flex items-center gap-3">
                    <span>
                      <span className="mr-1.5 font-brand text-sm text-gold-500">{i + 1}</span>
                      {s}
                    </span>
                    {i < all.length - 1 && <span aria-hidden="true" className="text-ink-600">/</span>}
                  </li>
                ))}
              </ol>
            </div>
            <a href={bookUrl(lang)} className="btn btn-primary shrink-0">{t.cta}</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
