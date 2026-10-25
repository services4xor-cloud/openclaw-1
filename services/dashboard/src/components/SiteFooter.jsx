import AnimatedLogo from "./AnimatedLogo.jsx";
import { SITE, MAP_URL, BOOK_URL } from "../lib/links.js";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-deep text-[#dfe8e3]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <AnimatedLogo size={26} />
          <span className="text-[#c9d6cf]">4XOR, Aesch, Switzerland</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={SITE} className="nav-link">4xor.de</a>
          <a href={MAP_URL} className="nav-link">Be[X] map</a>
          <a href={BOOK_URL} className="nav-link">Book a demo</a>
        </nav>
      </div>
    </footer>
  );
}
