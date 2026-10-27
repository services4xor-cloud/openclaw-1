/**
 * Profile on Studio, laid out like the map's profile (map.4xor.de/profile): the
 * "Profile" label, "Hello, name", and one card with the name, the email and the
 * account's pages (Bookings, Your listings, Settings, Admin for admins, Sign out).
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
  en: ["Profile", "Hello, {name}", "Settings & your data"],
  de: ["Profil", "Hallo, {name}", "Einstellungen & Ihre Daten"],
  fr: ["Profil", "Bonjour, {name}", "Réglages et vos données"],
  it: ["Profilo", "Salve, {name}", "Impostazioni e dati"],
  es: ["Perfil", "Hola, {name}", "Ajustes y sus datos"],
  zh: ["个人资料", "您好，{name}", "设置与您的数据"],
  hi: ["प्रोफ़ाइल", "नमस्ते, {name}", "सेटिंग्स और आपका डेटा"],
};

export default function ProfilePage() {
  const { lang } = useLang();
  const c = chromeFor(lang);
  const me = useMapMe(lang);
  const [title, hello, settings] = COPY[lang] ?? COPY.en;

  // Signed out: straight to the sign-in, which returns to this page
  useEffect(() => {
    if (me === null) window.location.replace(`${c.signIn.href}${encodeURIComponent(profileUrl())}`);
  }, [me, c.signIn.href]);

  // The map's order: Bookings, Your listings, Settings, Admin; Sign out on the right
  const byId = Object.fromEntries((me?.links ?? []).map((l) => [l.id, l]));
  const links = [
    byId.bookings,
    byId.listings,
    { id: "settings", label: settings, href: `${MAP_ORIGIN}/settings` },
    byId.admin,
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
