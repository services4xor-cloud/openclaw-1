/**
 * Profile on Studio, laid out like the map's profile (map.4xor.de/profile): the
 * "Profile" label, "Hello, name", and one card with the picture, the name, the email
 * and the account's pages (Your bookings, Your listings, Settings, Sign out).
 * The account lives on the Be[X] map (one account for 4xor.de, the map and Studio),
 * so the page asks the map who is signed in; signed out, it goes to the sign-in,
 * which comes back here, as the map's profile does.
 */
import { useEffect } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useLang } from "../lib/i18n.jsx";
import { chromeFor } from "../lib/site-chrome.js";
import { MAP_ORIGIN } from "../lib/links.js";
import { logoutHref, profileUrl, useMapMe } from "../lib/account.js";

// The map's own wording (profile.hello, profile.settings in its i18n)
const COPY = {
  en: ["Profile", "Hello, {name}", "Your bookings", "Settings & your data"],
  de: ["Profil", "Hallo, {name}", "Ihre Buchungen", "Einstellungen & Ihre Daten"],
  fr: ["Profil", "Bonjour, {name}", "Vos réservations", "Réglages et vos données"],
  it: ["Profilo", "Salve, {name}", "Le sue prenotazioni", "Impostazioni e dati"],
  es: ["Perfil", "Hola, {name}", "Sus reservas", "Ajustes y sus datos"],
  zh: ["个人资料", "您好，{name}", "您的预订", "设置与您的数据"],
  hi: ["प्रोफ़ाइल", "नमस्ते, {name}", "आपकी बुकिंग", "सेटिंग्स और आपका डेटा"],
};

/** The account picture, or the initials in the same circle when there is none */
function Avatar({ me }) {
  const cls = "mb-4 h-20 w-20 rounded-full border-2 border-accent-400/30";
  if (me.image) return <img src={me.image} alt={me.name} width={80} height={80} referrerPolicy="no-referrer" className={`${cls} object-cover`} />;
  const initials = me.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div aria-hidden="true" className={`${cls} grid place-items-center bg-accent-700/40 font-brand text-xl font-medium text-ink-100`}>
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { lang } = useLang();
  const c = chromeFor(lang);
  const me = useMapMe(lang);
  const [title, hello, bookings, settings] = COPY[lang] ?? COPY.en;

  // Signed out: straight to the sign-in, which returns to this page
  useEffect(() => {
    if (me === null) window.location.replace(`${c.signIn.href}${encodeURIComponent(profileUrl())}`);
  }, [me, c.signIn.href]);

  // As on the map: Your bookings, Your listings, Settings; Sign out on the right
  const byId = Object.fromEntries((me?.links ?? []).map((l) => [l.id, l]));
  const links = [
    byId.bookings && { ...byId.bookings, label: bookings },
    byId.listings,
    { id: "settings", label: settings, href: `${MAP_ORIGIN}/settings` },
  ].filter(Boolean);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-8 sm:mb-10">
          <p className="eyebrow mb-3">{title}</p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] text-ink-100 sm:text-5xl">
            {me ? hello.replace("{name}", me.name) : title}
          </h1>
        </div>
        {me && (
          <div className="card p-6 sm:p-8">
            <Avatar me={me} />
            <p className="text-lg text-ink-100">{me.name}</p>
            {me.email && <p className="mt-1 text-sm text-ink-400">{me.email}</p>}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-ink-700 pt-6">
              {links.map((l) => (
                <a key={l.id} href={l.href} className="btn btn-sm">
                  {l.label}
                </a>
              ))}
              <a href={logoutHref("/")} className="btn btn-sm ml-auto">
                {me.labels?.signOut ?? "Sign out"}
              </a>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
