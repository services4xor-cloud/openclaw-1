/**
 * Shared page wrapper: consistent spacing and title for all workspace pages.
 */
export default function PageShell({ title, subtitle, children, wide = false }) {
  return (
    <div className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 ${wide ? "max-w-6xl" : "max-w-2xl"}`}>
      <div className="mb-6">
        <h1 className="font-display text-[1.9rem] leading-tight text-ink-100">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
