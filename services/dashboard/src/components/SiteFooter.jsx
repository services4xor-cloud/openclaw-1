/**
 * The 4xor.de footer, the same on 4xor.de, the Be[X] map and Studio: the brand and
 * what it does, the site map in the header's three groups, contact, and a bottom
 * line with the legal pages, the languages and the local time in Aesch. On phones
 * the groups sit in two balanced columns and the links stay finger-sized.
 */
import { useEffect, useState } from "react";
import { LANGS, LANGUAGES, useLang } from "../lib/i18n.jsx";
import { chromeFor, siteChrome } from "../lib/site-chrome.js";

const EXT = { target: "_blank", rel: "noopener noreferrer" };
const HEAD = "mb-1 text-[0.85rem] font-semibold md:mb-3.5";
const LINK = "foot-link inline-block break-words py-2 md:py-0";

/** The 4XOR mark, still (the header's one moves) */
function Mark() {
  return (
    <svg width={37} height={42} viewBox="0 0 53 60" fill="none" aria-hidden="true">
      <path d="M15.3 40.6A12.5 12.5 0 1 1 37.7 40.6" stroke="#7fb8a6" strokeWidth="2" />
      <path d="M26.5 8 2.5 47l24 11 24-11ZM26.5 8v50M2.5 47l24-12 24 12" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
      <circle cx="26.5" cy="5.5" r="3.75" fill="#d4a537" />
    </svg>
  );
}

export default function SiteFooter() {
  const { lang, setLang } = useLang();
  const c = chromeFor(lang);
  const contact = siteChrome.contact;
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="border-t-[3px] border-accent-400 bg-[radial-gradient(50%_60%_at_0%_100%,rgb(255_255_255/0.07),transparent_70%),linear-gradient(135deg,#1f6452,#17483c_60%)] pb-8 pt-10 text-[0.95rem] text-[#f3f5f2] sm:pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-x-8 md:gap-y-10 lg:grid-cols-[4fr_2fr_2fr_2fr_2.6fr]">
          <div className="md:col-span-3 lg:col-span-1">
            <a href={c.home} aria-label={c.homeLabel} className="inline-flex items-center gap-3">
              <Mark />
              <span className="font-brand text-[1.45rem] font-medium tracking-[0.22em]">4XOR</span>
            </a>
            <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-white/80 sm:mt-5 sm:text-[0.95rem]">{c.footer.tagline}</p>
          </div>
          <nav aria-label="Site" className="grid grid-cols-2 gap-x-5 gap-y-5 md:contents">
            {/* Phones: What we do beside About us, Getting started below, as on 4xor.de */}
            {c.groups.map((g) => (
              <div key={g.id} className={g.id === "start" ? "order-last md:order-none" : undefined}>
                <h2 className={HEAD}>{g.label}</h2>
                <ul className="grid md:gap-2">
                  {g.items.map((i) => (
                    <li key={i.id}>
                      <a href={i.href} className={LINK}>
                        {i.label}
                      </a>
                    </li>
                  ))}
                  {g.id === "start" && (
                    <li>
                      <a href={c.cta.href} {...EXT} className={LINK}>
                        {c.cta.label}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
          <div>
            <h2 className={HEAD}>{c.footer.contact}</h2>
            <ul className="grid grid-cols-2 gap-x-5 md:grid-cols-1 md:gap-2">
              <li>
                <a href={`mailto:${contact.email}`} className={LINK}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className={LINK}>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={contact.whatsapp} {...EXT} className={LINK}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={contact.linkedin} {...EXT} className={LINK}>
                  LinkedIn
                </a>
              </li>
              <li className="col-span-2 mt-1.5 text-[0.88rem] leading-normal text-white/80 md:col-span-1">{contact.address}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2.5 border-t border-white/15 pt-5 text-[0.88rem] text-white/80 sm:mt-12 md:flex md:flex-wrap md:justify-between md:gap-x-8">
          <span className="col-span-2">
            © {new Date().getFullYear()} {siteChrome.company}
          </span>
          <nav aria-label={c.footer.legal} className="col-span-2 flex flex-wrap gap-x-5">
            {c.legal.map((l) => (
              <a key={l.label} href={l.href} className="foot-link py-2 md:py-0">
                {l.label}
              </a>
            ))}
          </nav>
          <div role="group" aria-label={c.langLabel} className="flex gap-3.5 font-mono text-[0.8rem] tracking-[0.04em]">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={l === lang}
                aria-label={LANGUAGES[l]}
                className="foot-link px-0.5 py-2 uppercase aria-pressed:font-semibold aria-pressed:text-white md:py-0"
              >
                {l}
              </button>
            ))}
          </div>
          <span className="col-span-2 row-start-4 inline-flex items-center gap-2 md:col-auto">
            <i aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-[#f7d27a]" />
            {c.footer.localTime} <b className="font-semibold tabular-nums text-white">{time}</b>
          </span>
          <a href="#" onClick={(e) => (e.preventDefault(), window.scrollTo({ top: 0, behavior: "smooth" }))} className="foot-link justify-self-end py-2 md:py-0">
            {c.footer.top}
          </a>
        </div>
      </div>
    </footer>
  );
}
