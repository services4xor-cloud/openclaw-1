/**
 * Profile on Studio: sign-in from Studio lands here, not on the map. The account
 * lives on the Be[X] map (one account for 4xor.de, the map and Studio), so the page
 * shows what the map says and the same account list as there.
 */
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useLang } from "../lib/i18n.jsx";
import { chromeFor } from "../lib/site-chrome.js";
import { logoutHref, profileUrl, useMapMe } from "../lib/account.js";

const COPY = {
  en: ["Profile", "Sign in once for 4xor.de, the Be[X] map and 4XOR Studio."],
  de: ["Profil", "Einmal anmelden für 4xor.de, die Be[X]-Karte und 4XOR Studio."],
  fr: ["Profil", "Une seule connexion pour 4xor.de, la carte Be[X] et 4XOR Studio."],
  it: ["Profilo", "Un solo accesso per 4xor.de, la mappa Be[X] e 4XOR Studio."],
  es: ["Perfil", "Un solo inicio de sesión para 4xor.de, el mapa Be[X] y 4XOR Studio."],
  zh: ["个人资料", "一次登录，即可使用 4xor.de、Be[X] 地图和 4XOR Studio。"],
  hi: ["प्रोफ़ाइल", "4xor.de, Be[X] मैप और 4XOR Studio के लिए एक ही बार साइन इन करें।"],
};

export default function ProfilePage() {
  const { lang } = useLang();
  const c = chromeFor(lang);
  const me = useMapMe(lang);
  const [title, signedOut] = COPY[lang] ?? COPY.en;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <p className="eyebrow">{title}</p>
          {me === undefined ? null : me ? (
            <>
              <h1 className="mt-4 font-display text-[2.4rem] leading-[1.1] text-ink-100 sm:text-[3rem]">{me.name}</h1>
              {me.email && <p className="mt-3 text-lg text-ink-400">{me.email}</p>}
              <ul className="mt-8 flex flex-wrap gap-3">
                {[...(me.links ?? []), { label: me.labels?.signOut ?? "Sign out", href: logoutHref("/") }].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="btn rounded-full">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h1 className="mt-4 font-display text-[2.4rem] leading-[1.1] text-ink-100 sm:text-[3rem]">{title}</h1>
              <p className="mt-3 text-lg text-ink-400">{signedOut}</p>
              <a href={`${c.signIn.href}${encodeURIComponent(profileUrl())}`} className="btn btn-primary mt-8 rounded-full">
                {c.signIn.label}
              </a>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
