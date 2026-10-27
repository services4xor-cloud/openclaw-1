/**
 * The 4xor.de header, the same on 4xor.de, the Be[X] map and Studio (the promo
 * bar stays on 4xor.de only): deep green bar with a teal rule, the 4XOR logo (home: 4xor.de), the three groups
 * of the 4xor.de site map with their lists, Sign in, the languages and the booking
 * button; below 1024px the full-screen menu. Next to the logo Studio adds itself as
 * the STUDIO pill, whose list holds Studio's own pages. The texts and links come
 * from 4xor.de (site-chrome.json). `workspace` puts the workspace pages in the pill.
 */
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo.jsx";
import { LANGS, LANGUAGES, PRODUCT, useLang } from "../lib/i18n.jsx";
import { chromeFor } from "../lib/site-chrome.js";
import { LIVE_FLOWS, MAP_ORIGIN } from "../lib/links.js";
import { logoutHref, profileUrl, useMapMe } from "../lib/account.js";

function Chevron({ className = "" }) {
  return (
    <svg className={`chev shrink-0 ${className}`} viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon({ size = 15 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="5.5" r="2.75" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.75 14c.6-2.9 2.7-4.5 5.25-4.5s4.65 1.6 5.25 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader({ workspace = false }) {
  const { lang, setLang, t } = useLang();
  const c = chromeFor(lang);
  const { pathname, hash, search } = useLocation();
  const menuRef = useRef(null);
  const productRef = useRef(null);
  const langRef = useRef(null);
  const accountRef = useRef(null);
  const all = () => [menuRef.current, productRef.current, langRef.current, accountRef.current];

  // Close the menus after navigation, on Escape and on a click elsewhere
  useEffect(() => {
    for (const d of all()) if (d) d.open = false;
  }, [pathname, hash, search, lang]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") for (const d of all()) if (d) d.open = false;
    };
    const onClick = (e) => {
      for (const d of [productRef.current, langRef.current, accountRef.current]) if (d?.open && !d.contains(e.target)) d.open = false;
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

  // Studio's own pages. Inside a demo only that demo, so the funnel stays on one service.
  const asked = new URLSearchParams(search).get("flow");
  const flow = LIVE_FLOWS.includes(asked) ? asked : "social";
  const current = pathname === "/try" ? `/try?flow=${flow}` : pathname;
  const here = (to) => (to === current ? "page" : undefined);
  const product = workspace
    ? [
        { to: "/workspace", label: t.ws.overview },
        { to: "/upload", label: t.ws.social },
        { to: "/team", label: t.ws.workflows },
      ]
    : pathname === "/try"
      ? [
          { to: "/", label: t.studioHome },
          { to: `/try?flow=${flow}`, label: PRODUCT[flow] },
        ]
      : [{ to: "/", label: t.studioHome }, ...LIVE_FLOWS.map((f) => ({ to: `/try?flow=${f}`, label: PRODUCT[f] }))];
  // Sign-in is the Be[X] account on the map, which sends the visitor to Studio's profile
  const signInHref = `${c.signIn.href}${encodeURIComponent(profileUrl())}`;
  // Signed in: the first name where "Sign in" stands, opening the same account list as
  // the map and 4xor.de (Profile here, Your listings, Bookings, Admin for admins, Sign out)
  const me = useMapMe(lang);
  const firstName = me?.name?.split(" ")[0];
  const accountLink = me
    ? { href: "/profile", label: firstName || me.labels?.profile || "Profile" }
    : { href: signInHref, label: c.signIn.label };
  const accountItems = me
    ? [
        { href: "/profile", label: me.labels?.profile ?? "Profile" },
        ...(me.links ?? []),
        { href: logoutHref(`${pathname}${search}${hash}`), label: me.labels?.signOut ?? "Sign out" },
      ]
    : [];
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 border-t-[3px] border-t-accent-400 bg-deep text-[#f3f5f2]">
        <div className="relative mx-auto flex max-w-[76rem] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <a href={c.home} aria-label={c.homeLabel} className="flex shrink-0 text-[#f3f5f2]">
              <AnimatedLogo brand="4xor" size={44} />
            </a>
            {/* The product pill: Studio and its own pages */}
            <details ref={productRef} className="langs relative shrink-0">
              <summary
                aria-label="4XOR Studio"
                className="flex min-w-0 cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1 font-brand text-[0.72rem] font-medium uppercase tracking-[0.14em] sm:px-3 sm:tracking-[0.18em] text-[#e3ece7] hover:border-accent-400 hover:text-white"
              >
                <span className="truncate">Studio</span>
                <Chevron />
              </summary>
              <ul className="absolute left-0 top-full z-10 mt-3 min-w-[15rem] animate-[menuIn_.18s_ease] rounded-[10px] border border-ink-700 bg-ink-900 p-1.5 text-ink-100 shadow-2xl">
                {product.map((i) => (
                  <li key={i.to}>
                    <Link
                      to={i.to}
                      aria-current={here(i.to)}
                      className="block rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent-400/10 aria-[current=page]:text-accent-400"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <nav aria-label="Main" className="flex shrink-0 items-center gap-3 text-[0.95rem] sm:gap-5">
            {/* Desktop: the three 4xor.de groups; each opens its list on hover or focus */}
            <ul className="hidden gap-5 xl:flex">
              {c.groups.map((g) => (
                <li key={g.id} className="group relative">
                  <a href={g.items[0].href} className="nav-link inline-flex items-center gap-1.5">
                    {g.label}
                    <Chevron className="group-focus-within:rotate-180 group-hover:rotate-180" />
                  </a>
                  <div className="invisible absolute -left-3.5 top-full translate-y-1 pt-3.5 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="min-w-[17.5rem] rounded-[10px] border border-ink-700 bg-ink-900 p-1.5 shadow-2xl">
                      {g.items.map((i) => (
                        <li key={i.id}>
                          <a href={i.href} className="flex flex-col gap-0.5 rounded-md px-3 py-2.5 hover:bg-accent-400/10">
                            <span className="font-semibold text-ink-100">{i.label}</span>
                            <span className="text-[0.86rem] leading-snug text-ink-400">{i.note}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>

            {me ? (
              <details ref={accountRef} className="langs relative">
                <summary aria-label={me.name ?? accountLink.label} className="nav-link flex cursor-pointer list-none items-center gap-1.5">
                  <PersonIcon size={18} />
                  <span className="hidden max-w-[9rem] truncate sm:inline">{accountLink.label}</span>
                  <Chevron className="hidden sm:block" />
                </summary>
                <ul className="absolute -right-3 top-full z-10 mt-3.5 min-w-52 animate-[menuIn_.18s_ease] rounded-[10px] border border-ink-700 bg-ink-900 p-1.5 shadow-2xl">
                  {accountItems.map((i) => (
                    <li key={i.href}>
                      <a
                        href={i.href}
                        aria-current={i.href === "/profile" && pathname === "/profile" ? "page" : undefined}
                        className="block rounded-md px-3 py-2 text-sm font-semibold text-ink-100 hover:bg-accent-400/10 aria-[current=page]:text-accent-400"
                      >
                        {i.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <a href={accountLink.href} aria-label={accountLink.label} className="nav-link inline-flex items-center gap-1.5">
                <PersonIcon size={18} />
                <span className="hidden max-w-[9rem] truncate sm:inline">{accountLink.label}</span>
              </a>
            )}

            {/* The language list, from 640px; phones get it in the menu */}
            <details ref={langRef} className="langs relative hidden sm:block">
              <summary
                aria-label={`${c.langLabel}: ${LANGUAGES[lang]}`}
                className="flex cursor-pointer list-none items-center gap-1.5 font-mono text-[0.82rem] font-medium uppercase tracking-[0.04em] text-[rgb(243_245_242/0.84)] hover:text-accent-300"
              >
                {lang}
                <Chevron />
              </summary>
              <ul className="absolute -right-3 top-full z-10 mt-3.5 min-w-44 animate-[menuIn_.18s_ease] rounded-[10px] border border-ink-700 bg-ink-900 p-1.5 shadow-2xl">
                {LANGS.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => setLang(l)}
                      lang={l}
                      aria-current={l === lang ? "true" : undefined}
                      className="flex w-full items-baseline justify-between gap-4 rounded-md px-3 py-2 text-left font-semibold text-ink-100 hover:bg-accent-400/10 aria-[current]:text-accent-400"
                    >
                      <span>{LANGUAGES[l]}</span>
                      <span className="font-mono text-[0.74rem] font-medium uppercase text-ink-400">{l}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>

            <a href={c.cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-on-deep btn-sm hidden xl:inline-flex">
              {c.cta.label}
            </a>

            {/* Phones and tablets: the 4xor.de full-screen menu */}
            <details ref={menuRef} className="menu group xl:hidden">
              <summary role="button" aria-label={c.menu} className="cursor-pointer list-none rounded-md border-[1.5px] border-white/30 px-2.5 py-1.5 sm:px-3.5 text-[0.92rem] font-semibold hover:border-accent-400 hover:text-accent-300">
                {c.menu}
              </summary>
              <div className="menu-panel" onClick={closeMenu}>
                <div className="menu-group" style={{ "--n": 0 }}>
                  <p className="menu-head">Studio</p>
                  <div className="menu-links">
                    {product.map((i) => (
                      <Link key={i.to} to={i.to} aria-current={here(i.to)} className="menu-link">
                        {i.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {c.groups.map((g, n) => (
                  <div key={g.id} className="menu-group" style={{ "--n": n + 1 }}>
                    <p className="menu-head">{g.label}</p>
                    <div className="menu-links">
                      {g.items.map((i) => (
                        <a key={i.id} href={i.href} className="menu-link">
                          {i.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Sign-in above the languages, as on 4xor.de */}
                <a
                  href={accountLink.href}
                  className="menu-group mt-1.5 flex min-h-[44px] items-center gap-2.5 border-b border-white/10 text-[1.05rem] font-semibold"
                  style={{ "--n": 4 }}
                >
                  <PersonIcon size={18} />
                  {accountLink.label}
                </a>
                {me && (
                  <div className="menu-links menu-group" style={{ "--n": 4 }}>
                    {accountItems.slice(1).map((i) => (
                      <a key={i.href} href={i.href} className="menu-link">
                        {i.label}
                      </a>
                    ))}
                  </div>
                )}
                <p className="menu-langs" aria-label={c.langLabel}>
                  {LANGS.map((l) => (
                    <button key={l} onClick={() => setLang(l)} lang={l} aria-label={LANGUAGES[l]} aria-current={l === lang ? "true" : undefined}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </p>
                <a href={c.cta.href} target="_blank" rel="noopener noreferrer" className="btn btn-on-deep mt-auto w-full">
                  {c.cta.label}
                </a>
              </div>
            </details>
          </nav>
        </div>
      </header>
    </>
  );
}
