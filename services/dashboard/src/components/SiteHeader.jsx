/**
 * The 4xor.de header, shared by every Studio page: promo bar, deep green bar with
 * a teal rule on top, the BE[ ] logo, the links, the language switch and one call
 * to action. Below 1180px the links fold into a full-screen menu with the
 * languages as pills and the call to action at the foot, exactly as on 4xor.de.
 * `workspace` swaps the public links for the workspace links.
 */
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo.jsx";
import { LANGS, LANGUAGES, siteHome, useLang, PRODUCT } from "../lib/i18n.jsx";
import { BEX_URL, MAP_URL, backTo4xor, bookUrl } from "../lib/links.js";

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SiteHeader({ workspace = false }) {
  const { lang, setLang, t } = useLang();
  const { pathname, hash, search } = useLocation();
  const menuRef = useRef(null);
  const langRef = useRef(null);

  // Close menus after navigation, on Escape, and the language list on a click elsewhere
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
    if (langRef.current) langRef.current.open = false;
  }, [pathname, hash, lang]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      for (const d of [menuRef.current, langRef.current]) if (d?.open) d.open = false;
    };
    const onClick = (e) => {
      if (langRef.current?.open && !langRef.current.contains(e.target)) langRef.current.open = false;
    };
    addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);
  const closeMenu = (e) => {
    if (e.target.closest("a, button") && menuRef.current) menuRef.current.open = false;
  };

  // The site map: grouped as in the phone menu, flat in the desktop bar. The last
  // group leads back to the other 4XOR sites, so all three feel like one.
  const tryFlow = pathname === "/try" ? (new URLSearchParams(search).get("flow") === "social" ? "social" : "workflow") : null;
  const backHref = backTo4xor(lang, tryFlow);
  const signInUrl = `${BEX_URL}/login?callbackUrl=${encodeURIComponent(`${location.origin}/try?lang=${lang}#live`)}`;
  const sites = {
    label: "4XOR",
    items: [
      { href: siteHome(lang), label: "4xor.de" },
      { href: MAP_URL, label: t.mapLink },
    ],
  };
  const groups = workspace
    ? [
        {
          label: t.groups.studio,
          items: [
            { to: "/workspace", label: t.ws.overview, end: true },
            { to: "/upload", label: t.ws.social },
            { to: "/team", label: t.ws.workflows },
          ],
        },
        sites,
      ]
    : [
        {
          label: t.groups.services,
          items: [
            { href: "/#agent-workflow", label: PRODUCT.workflow },
            { href: "/#social-media", label: PRODUCT.social },
          ],
        },
        {
          label: t.groups.studio,
          items: [
            { to: "/try", label: t.tryLive },
            // Visitors sign in with their 4XOR account for the live run; the
            // customer workspace stays behind its own login, out of the public menu
            { href: signInUrl, label: t.signIn },
          ],
        },
        sites,
      ];
  const desktopItems = groups[0].items;

  const item = (i, className) =>
    i.to ? (
      <NavLink key={i.label} to={i.to} end={i.end} className={className}>
        {i.label}
      </NavLink>
    ) : (
      <a key={i.label} href={i.href} className={className}>
        {i.label}
      </a>
    );

  return (
    <>
      {!workspace && (
        <aside aria-label="4XOR" className="promo-bar hidden bg-gradient-to-r from-deep via-accent-700 to-deep sm:block">
          <a href={siteHome(lang)} className="flex min-h-[34px] items-center justify-center px-4 py-1.5 text-center text-[0.85rem] text-[#e3ece7] hover:underline">
            <span>
              <b className="font-semibold text-gold-300">{t.promo}</b>
              {t.promoExtra}
            </span>
          </a>
        </aside>
      )}
      <header className="sticky top-0 z-40 border-b border-white/10 border-t-[3px] border-t-accent-400 bg-deep text-[#f3f5f2]">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={workspace ? "/workspace" : "/"}
              aria-label={t.homeLabel}
              className="flex shrink-0 items-center gap-3 text-[#f3f5f2]"
              onClick={() => menuRef.current && (menuRef.current.open = false)}
            >
              <AnimatedLogo size={34} />
              <span className="hidden border-l border-white/20 pl-3 font-brand text-[0.8rem] font-medium uppercase tracking-[0.22em] text-[#dfe8e3] sm:inline">
                Studio
              </span>
            </Link>
            {/* The way back, in the same place and style as on the Be[X] map */}
            <a href={backHref} className="shrink-0 whitespace-nowrap rounded-full border border-white/20 px-2.5 py-1 text-xs text-[#e3ece7] hover:border-accent-400 hover:text-white">
              <span aria-hidden="true">← </span>4xor.de
            </a>
          </div>

          <nav aria-label="Main" className="flex shrink-0 items-center gap-6 text-[0.95rem]">
            <div className="hidden items-center gap-7 min-[1180px]:flex">{desktopItems.map((i) => item(i, "nav-link"))}</div>

            <details ref={langRef} className="langs relative hidden sm:block">
              <summary aria-label={`${t.langLabel}: ${LANGUAGES[lang]}`} className="flex cursor-pointer list-none items-center gap-1.5 font-mono text-[0.82rem] font-medium tracking-wide text-[#dfe8e3] hover:text-accent-300">
                {lang.toUpperCase()} <Chevron />
              </summary>
              <ul className="absolute right-[-0.75rem] top-[calc(100%+0.9rem)] z-10 min-w-44 animate-[menuIn_.18s_ease] rounded-[10px] border border-ink-700 bg-ink-900 p-1.5 shadow-2xl">
                {LANGS.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => setLang(l)}
                      lang={l}
                      aria-current={l === lang ? "true" : undefined}
                      className="flex w-full items-baseline justify-between gap-4 rounded-md px-3 py-2 text-left font-semibold text-ink-100 hover:bg-accent-400/10 aria-[current]:text-accent-400"
                    >
                      <span>{LANGUAGES[l]}</span>
                      <span className="font-mono text-[0.74rem] font-medium text-ink-400">{l.toUpperCase()}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>

            {!workspace && <a href={bookUrl(lang)} className="btn btn-on-deep btn-sm hidden sm:inline-flex">{t.cta}</a>}

            {/* Phones and tablets: the whole site map on one screen, as on 4xor.de */}
            <details ref={menuRef} className="menu min-[1180px]:hidden">
              <summary className="cursor-pointer list-none rounded-md border-[1.5px] border-white/25 px-3.5 py-1.5 text-[0.92rem] font-semibold hover:border-accent-400 hover:text-accent-300">
                {t.menu}
              </summary>
              <div className="menu-panel" onClick={closeMenu}>
                {groups.map((g, n) => (
                  <div key={g.label} className="menu-group" style={{ "--n": n }}>
                    <p className="menu-head">{g.label}</p>
                    <div className="menu-links">{g.items.map((i) => item(i, "menu-link"))}</div>
                  </div>
                ))}
                <p className="menu-langs" aria-label={t.langLabel}>
                  {LANGS.map((l) => (
                    <button key={l} onClick={() => setLang(l)} lang={l} aria-label={LANGUAGES[l]} aria-current={l === lang ? "true" : undefined}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </p>
                {workspace ? (
                  <a href={siteHome(lang)} className="btn mt-auto w-full">4xor.de</a>
                ) : (
                  <a href={bookUrl(lang)} className="btn btn-primary mt-auto w-full">{t.cta}</a>
                )}
              </div>
            </details>
          </nav>
        </div>
      </header>
    </>
  );
}
