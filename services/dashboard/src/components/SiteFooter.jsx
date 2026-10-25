import AnimatedLogo from "./AnimatedLogo.jsx";
import { siteHome, useLang } from "../lib/i18n.jsx";
import { MAP_URL, bookUrl } from "../lib/links.js";

export default function SiteFooter() {
  const { lang, t } = useLang();
  return (
    <footer className="border-t border-white/10 bg-deep text-[#dfe8e3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <AnimatedLogo size={26} />
          <span className="text-[#c9d6cf]">{t.footerPlace}</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={siteHome(lang)} className="nav-link">4xor.de</a>
          <a href={MAP_URL} className="nav-link">{t.mapLink}</a>
          <a href={bookUrl(lang)} className="nav-link">{t.cta}</a>
        </nav>
      </div>
    </footer>
  );
}
