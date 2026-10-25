/**
 * Live demo: one workflow of each service, step by step. Anyone can watch the
 * example run; a live run with your own business needs a 4XOR sign-in and is
 * limited to one per person (enforced by the API on the Be[X] map app).
 */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight, Check, CalendarClock, Image as ImageIcon, Inbox, Mail, NotebookPen,
  PenLine, RotateCcw, Send, Sparkles, Stamp, Timer, UserRound,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { BEX_URL, bookUrl, productUrl } from "../lib/links.js";
import { PRODUCT, useLang } from "../lib/i18n.jsx";
import { SAMPLE_INPUT, SAMPLE_RESULT } from "../lib/demoSamples.js";

const STEP_ICONS = {
  workflow: [Inbox, UserRound, PenLine, CalendarClock, NotebookPen],
  social: [ImageIcon, Stamp, Sparkles, Check, CalendarClock],
};
const STEP_MS = 2600;
const APPROVE_STEP = 3; // social waits here for the visitor's click

/** Types text out, so the AI's work is visible as it "happens". */
function Typed({ text, speed = 12 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 3)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span className="whitespace-pre-line">{text.slice(0, n)}</span>;
}

function Panel({ children }) {
  return <div className="animate-[fadeUp_.45s_ease_both]">{children}</div>;
}

function Chip({ children, tone = "accent" }) {
  const c = tone === "gold" ? "border-gold-500/40 bg-gold-500/10 text-gold-300" : "border-accent-400/40 bg-accent-400/10 text-accent-300";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${c}`}>{children}</span>;
}

/** Text with one highlighted middle part: [before, highlight, after]. */
function Lit([before, mid, after], className = "text-gold-400") {
  return (
    <>
      {before}
      <b className={`font-semibold ${className}`}>{mid}</b>
      {after}
    </>
  );
}

function SocialStage({ step, input, result, approved, onApprove, t }) {
  const posts = result.posts ?? [];
  return (
    <div className="space-y-4">
      <Panel>
        <div className="relative overflow-hidden rounded-lg border border-ink-700 bg-gradient-to-br from-accent-700/60 via-ink-800 to-gold-600/30 p-5">
          <div className="flex items-center gap-3">
            <ImageIcon className="shrink-0 text-ink-200" size={28} />
            <p className="text-sm text-ink-100">{input.detail}</p>
          </div>
          {step >= 1 && (
            <span className="absolute bottom-2 right-3 animate-[fadeUp_.4s_ease_both] font-brand text-[0.7rem] tracking-[0.2em] text-white/80">
              {input.business.split(",")[0].toUpperCase()}
            </span>
          )}
        </div>
      </Panel>
      {step >= 2 && (
        <Panel>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((p) => (
              <div key={p.channel} className="rounded-lg border border-ink-700 bg-ink-950/50 p-3.5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent-300">{p.channel}</span>
                  {approved && <Chip tone="gold"><CalendarClock size={12} />{p.bestTime}</Chip>}
                </div>
                <p className="text-sm leading-relaxed text-ink-200"><Typed text={p.caption} /></p>
                <p className="mt-1.5 text-xs text-ink-400">{p.hashtags.join(" ")}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {step >= APPROVE_STEP && !approved && (
        <Panel>
          <button onClick={onApprove} className="btn btn-primary w-full">
            <Check size={16} /> {t.approveAll(posts.length)}
          </button>
        </Panel>
      )}
    </div>
  );
}

function WorkflowStage({ step, input, result, t }) {
  return (
    <div className="space-y-4">
      <Panel>
        <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-ink-400"><Mail size={14} /> {t.newMessage}</div>
          <p className="whitespace-pre-line text-sm text-ink-200">{input.detail}</p>
        </div>
      </Panel>
      {step >= 1 && (
        <Panel>
          <div className="flex flex-wrap gap-2">
            <Chip><UserRound size={12} />{result.lead.name}</Chip>
            <Chip>{result.lead.need}</Chip>
            <Chip tone="gold">{t.urgency}: {t.urgencyLevels[result.lead.urgency] ?? result.lead.urgency}</Chip>
          </div>
        </Panel>
      )}
      {step >= 2 && (
        <Panel>
          <div className="rounded-lg border border-accent-400/30 bg-ink-950/50 p-4">
            <p className="mb-2 text-xs text-ink-400">{t.reply} · <span className="text-ink-200">{result.reply.subject}</span></p>
            <p className="text-sm leading-relaxed text-ink-200"><Typed text={result.reply.body} speed={10} /></p>
          </div>
        </Panel>
      )}
      {step >= 3 && (
        <Panel>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-400">{t.offered}</span>
            {result.slots.map((s) => <Chip key={s} tone="gold"><CalendarClock size={12} />{s}</Chip>)}
          </div>
        </Panel>
      )}
      {step >= 4 && (
        <Panel>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-3"><p className="text-xs text-ink-400">{t.crm}</p><p className="text-ink-200">{result.crmNote}</p></div>
            <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-3"><p className="text-xs text-ink-400">{t.followUp}</p><p className="text-ink-200">{result.followUp}</p></div>
          </div>
        </Panel>
      )}
    </div>
  );
}

const inputClass =
  "rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:outline-none";

export default function TryPage() {
  const { lang, t: ui } = useLang();
  const t = ui.try;
  const [params, setParams] = useSearchParams();
  const flowKey = params.get("flow") === "social" ? "social" : "workflow";
  const product = PRODUCT[flowKey];
  const stepLabels = t.steps[flowKey];
  const last = stepLabels.length - 1;

  const sample = () => ({ input: SAMPLE_INPUT[lang][flowKey], result: SAMPLE_RESULT[lang][flowKey], live: false });
  const [run, setRun] = useState(sample);
  const [step, setStep] = useState(0);
  const [approved, setApproved] = useState(false);
  const [me, setMe] = useState(null); // { signedIn, name, used }
  const [form, setForm] = useState({ business: "", detail: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const restart = () => {
    setStep(0);
    setApproved(false);
  };
  // A new flow or language plays the example again (a live result stays until then)
  useEffect(() => {
    setRun(sample());
    restart();
    setError("");
  }, [flowKey, lang]);

  // One step at a time; social waits at "approve" for the visitor's click
  const waiting = flowKey === "social" && step === APPROVE_STEP && !approved;
  useEffect(() => {
    if (step >= last || waiting) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [step, waiting, last, run]);

  useEffect(() => {
    fetch(`${BEX_URL}/api/studio-demo`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const done = step >= last && (flowKey !== "social" || approved);
  const minutes = run.result.minutesSaved;
  const signInUrl = useMemo(() => {
    const back = new URL(window.location.href);
    back.hash = "live";
    back.searchParams.set("lang", lang);
    return `${BEX_URL}/login?callbackUrl=${encodeURIComponent(back.toString())}`;
  }, [flowKey, lang]);

  const runLive = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Never leave the button spinning: give up after 60 seconds
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60_000);
    try {
      const res = await fetch(`${BEX_URL}/api/studio-demo`, {
        method: "POST",
        credentials: "include",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow: flowKey, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t.error);
        if (res.status === 401) setMe((m) => ({ ...m, signedIn: false }));
        if (data.used) markUsed();
        return;
      }
      markUsed();
      setRun({ input: form, result: data.result, live: true });
      restart();
      document.getElementById("stage")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setError(t.unreachable);
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  };
  const markUsed = () => setMe((m) => ({ ...m, used: { ...m?.used, [flowKey]: true } }));
  const usedToday = !!me?.used?.[flowKey];

  const hints = t.hints[flowKey];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10 sm:px-6">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="mt-3 font-display text-[2.1rem] leading-tight text-ink-100 sm:text-[2.8rem]">{t.titles[flowKey]}</h1>
        <p className="mt-3 max-w-2xl text-ink-400">{Lit(t.watch(product, minutes))}</p>

        {/* Flow switch */}
        <div className="mt-6 inline-flex max-w-full overflow-x-auto rounded-lg border border-ink-700 bg-ink-900 p-1">
          {Object.keys(STEP_ICONS).map((key) => (
            <button
              key={key}
              onClick={() => setParams({ flow: key })}
              className={`shrink-0 rounded-md px-3.5 py-2 text-sm transition-colors ${key === flowKey ? "bg-accent-400/15 text-ink-100" : "text-ink-400 hover:text-ink-200"}`}
            >
              {PRODUCT[key]}
            </button>
          ))}
        </div>

        <section id="stage" className="mt-6 grid scroll-mt-24 gap-5 lg:grid-cols-[280px_1fr]">
          {/* Pipeline */}
          <ol className="card relative h-fit p-5">
            {stepLabels.map((label, i) => {
              const Icon = STEP_ICONS[flowKey][i];
              const state = i < step || (i === step && done) ? "done" : i === step ? "active" : "todo";
              return (
                <li key={label} className="relative flex items-center gap-3 pb-6 last:pb-0">
                  {i < last && (
                    <span className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5 bg-ink-700">
                      <span className="block w-full bg-accent-400 transition-all duration-700" style={{ height: i < step ? "100%" : "0%" }} />
                    </span>
                  )}
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                      state === "done" ? "border-accent-400 bg-accent-400 text-ink-950"
                        : state === "active" ? "border-gold-500 bg-gold-500/15 text-gold-300"
                        : "border-ink-700 bg-ink-950 text-ink-500"
                    }`}
                  >
                    {state === "done" ? <Check size={16} /> : <Icon size={16} />}
                    {state === "active" && <span className="absolute inset-0 animate-ping rounded-full border border-gold-500/60" />}
                  </span>
                  <span className={`text-sm ${state === "todo" ? "text-ink-500" : "text-ink-100"}`}>{label}</span>
                </li>
              );
            })}
          </ol>

          {/* What happens */}
          <div className="card min-h-[420px] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-ink-400">
                {run.live ? t.liveFor : t.example}<span className="text-ink-200">{run.input.business}</span>
              </span>
              <button onClick={restart} className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-200">
                <RotateCcw size={12} /> {t.replay}
              </button>
            </div>
            {flowKey === "social" ? (
              <SocialStage step={step} input={run.input} result={run.result} approved={approved} t={t} onApprove={() => { setApproved(true); setStep(last); }} />
            ) : (
              <WorkflowStage step={step} input={run.input} result={run.result} t={t} />
            )}
            {done && (
              <Panel>
                <div className="mt-5 flex items-center gap-3 rounded-lg border border-gold-500/40 bg-gold-500/10 p-4">
                  <Timer className="shrink-0 text-gold-400" />
                  <p className="text-sm text-ink-100">{Lit(t.done(minutes), "text-gold-300")}</p>
                </div>
              </Panel>
            )}
          </div>
        </section>

        {/* Live run */}
        <section id="live" className="mt-8 grid scroll-mt-24 gap-5 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">{t.yourTurn}</p>
            <p className="mt-2 text-sm text-ink-400">{t.yourTurnText}</p>
          </div>
          <div className="card p-5 sm:p-6">
            {!me?.signedIn ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">{t.signInPrompt(product)}</p>
                <a href={signInUrl} className="btn btn-primary">{t.signInToRun} <ArrowRight size={16} /></a>
              </div>
            ) : usedToday && !run.live ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">{t.used}</p>
                <a href={bookUrl(lang)} className="btn btn-primary">{ui.cta}</a>
              </div>
            ) : run.live ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">{t.liveDone}</p>
                <div className="flex flex-wrap gap-2">
                  <a href={productUrl(flowKey, lang)} className="btn">{ui.request}</a>
                  <a href={bookUrl(lang)} className="btn btn-primary">{ui.cta}</a>
                </div>
              </div>
            ) : (
              <form onSubmit={runLive} className="grid gap-3">
                <label className="grid gap-1.5 text-sm text-ink-300">
                  {t.business}
                  <input required minLength={3} maxLength={300} value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} placeholder={hints.business} className={inputClass} />
                </label>
                <label className="grid gap-1.5 text-sm text-ink-300">
                  {hints.detailLabel}
                  <textarea required minLength={3} maxLength={1000} rows={3} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} placeholder={hints.detail} className={`resize-none ${inputClass}`} />
                </label>
                {error && <p className="text-sm text-red-300">{error}</p>}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-ink-400">{t.signedInAs(me.name)}</span>
                  <button disabled={busy} className="btn btn-primary">
                    {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> {t.running}</> : <><Send size={16} /> {t.run}</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
