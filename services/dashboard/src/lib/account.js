/**
 * The visitor's Be[X] account, signed in on the map (map.4xor.de shares the site
 * with Studio, so its sign-in cookie travels along). Signed in, the demo runs on
 * the account: one run a day per person, unlimited for admins. Asked once per page.
 */
import { useEffect, useState } from "react";
import { MAP_ORIGIN, withLang } from "./links.js";

export const MAP_DEMO_API = `${MAP_ORIGIN}/api/studio-demo`;

let pending;
function load() {
  pending ??= fetch(MAP_DEMO_API, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return pending;
}
/** Forget the cached answer, e.g. after a run used today's quota. */
export const reloadAccount = () => (pending = undefined);

/** null while unknown or signed out; otherwise { signedIn, name, admin, used } */
export function useMapAccount() {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    let live = true;
    load().then((a) => live && setAccount(a?.signedIn ? a : null));
    return () => {
      live = false;
    };
  }, []);
  return account;
}

/** Studio's own profile page, where every sign-in from Studio lands, in `lang`. */
export const profileUrl = (lang) => withLang("/profile", lang);
/** Signs out on the map, then back to `path` on Studio, both in `lang`. */
export const logoutHref = (path, lang) =>
  withLang(`${MAP_ORIGIN}/logout?callbackUrl=${encodeURIComponent(withLang(path, lang))}`, lang);

// The map's own wording (nav.listings, nav.bookings, nav.profile, nav.signOut in its
// i18n), kept here so the menu is in Studio's language whatever the map answers in
const LABELS = {
  en: { listings: "Your listings", bookings: "Bookings", profile: "Profile", signOut: "Sign out" },
  de: { listings: "Ihre Angebote", bookings: "Buchungen", profile: "Profil", signOut: "Abmelden" },
  fr: { listings: "Vos offres", bookings: "Réservations", profile: "Profil", signOut: "Se déconnecter" },
  it: { listings: "Le tue offerte", bookings: "Prenotazioni", profile: "Profilo", signOut: "Esci" },
  es: { listings: "Sus ofertas", bookings: "Reservas", profile: "Perfil", signOut: "Cerrar sesión" },
  zh: { listings: "我的发布", bookings: "预订", profile: "个人资料", signOut: "退出登录" },
  hi: { listings: "आपकी पेशकशें", bookings: "बुकिंग", profile: "प्रोफ़ाइल", signOut: "साइन आउट" },
  ar: { listings: "عروضك", bookings: "الحجوزات", profile: "الملف الشخصي", signOut: "تسجيل الخروج" },
};
const localized = (me, lang) => {
  const own = LABELS[lang] ?? LABELS.en;
  return {
    ...me,
    links: (me.links ?? []).map((l) => ({ ...l, label: own[l.id] ?? l.label, href: withLang(l.href, lang) })),
    labels: { profile: own.profile, signOut: own.signOut },
  };
};

const meCache = {};
/**
 * The signed-in account with the map's account list in `lang` (Your listings,
 * Bookings, Admin for admins), the same list the map and 4xor.de show.
 * undefined while loading, null when signed out, else { name, email, admin, links, labels }.
 */
export function useMapMe(lang) {
  const [me, setMe] = useState(undefined);
  useEffect(() => {
    let live = true;
    meCache[lang] ??= fetch(`${MAP_ORIGIN}/api/me?lang=${lang}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    meCache[lang].then((m) => live && setMe(m?.signedIn ? localized(m, lang) : null));
    return () => {
      live = false;
    };
  }, [lang]);
  return me;
}
