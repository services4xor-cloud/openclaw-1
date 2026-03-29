/**
 * Shared page wrapper — consistent spacing and title for all pages.
 */
export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="px-4 py-5 max-w-2xl mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
