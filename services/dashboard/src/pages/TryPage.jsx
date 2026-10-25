/**
 * Live demo: one workflow of each service, step by step. Anyone can watch the
 * example run; a live run with your own business needs a 4XOR sign-in and is
 * limited to one per person (enforced by the API on the Be[X] map app).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight, Check, CalendarClock, Image as ImageIcon, Inbox, Mail, NotebookPen,
  PenLine, RotateCcw, Send, Sparkles, Stamp, Timer, UserRound,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { BEX_URL, BOOK_URL, PRODUCT_URL } from "../lib/links.js";
import { SAMPLE_INPUT, SAMPLE_RESULT } from "../lib/demoSamples.js";

const FLOWS = {
  workflow: {
    product: "Agent Workflow Automation",
    title: "A new lead, answered and booked",
    steps: [
      { icon: Inbox, label: "Lead arrives" },
      { icon: UserRound, label: "AI understands it" },
      { icon: PenLine, label: "Reply written" },
      { icon: CalendarClock, label: "Meeting offered" },
      { icon: NotebookPen, label: "CRM and follow-up" },
    ],
    businessLabel: "Your business",
    businessHint: "e.g. Physio practice in Zurich",
    detailLabel: "A message a new customer might send you",
    detailHint: "e.g. Hi, do you have time this week for…",
    more: PRODUCT_URL.workflows,
  },
  social: {
    product: "Social Media Automation",
    title: "One upload, a post for every channel",
    steps: [
      { icon: ImageIcon, label: "You upload" },
      { icon: Stamp, label: "Branded" },
      { icon: Sparkles, label: "Posts written" },
      { icon: Check, label: "You approve once" },
      { icon: CalendarClock, label: "Scheduled" },
    ],
    businessLabel: "Your business",
    businessHint: "e.g. Family bakery in Basel",
    detailLabel: "What your photo or video shows",
    detailHint: "e.g. Fresh croissants coming out of the oven",
    more: PRODUCT_URL.social,
  },
};

const STEP_MS = 2600;

/** Types text out, so the AI's work is visible as it "happens". */
function Typed({ text, speed = 12, className = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 3)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span className={`whitespace-pre-line ${className}`}>{text.slice(0, n)}</span>;
}

function Panel({ children }) {
  return <div className="animate-[fadeUp_.45s_ease_both]">{children}</div>;
}

function Chip({ children, tone = "accent" }) {
  const c = tone === "gold" ? "border-gold-500/40 bg-gold-500/10 text-gold-300" : "border-accent-400/40 bg-accent-400/10 text-accent-300";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${c}`}>{children}</span>;
}

function SocialStage({ step, input, result, approved, onApprove }) {
  const posts = result.posts ?? [];
  return (
    <div className="space-y-4">
      {step >= 0 && (
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
      )}
      {step >= 2 && (
        <Panel>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((p, i) => (
              <div key={p.channel} className="rounded-lg border border-ink-700 bg-ink-950/50 p-3.5" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent-300">{p.channel}</span>
                  {step >= 4 && approved && <Chip tone="gold"><CalendarClock size={12} />{p.bestTime}</Chip>}
                </div>
                <p className="text-sm leading-relaxed text-ink-200"><Typed text={p.caption} /></p>
                <p className="mt-1.5 text-xs text-ink-400">{p.hashtags.join(" ")}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {step >= 3 && !approved && (
        <Panel>
          <button onClick={onApprove} className="btn btn-primary w-full">
            <Check size={16} /> Approve for all {posts.length} channels
          </button>
        </Panel>
      )}
    </div>
  );
}

function WorkflowStage({ step, input, result }) {
  return (
    <div className="space-y-4">
      {step >= 0 && (
        <Panel>
          <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-ink-400"><Mail size={14} /> New message · just now</div>
            <p className="whitespace-pre-line text-sm text-ink-200">{input.detail}</p>
          </div>
        </Panel>
      )}
      {step >= 1 && (
        <Panel>
          <div className="flex flex-wrap gap-2">
            <Chip><UserRound size={12} />{result.lead.name}</Chip>
            <Chip>{result.lead.need}</Chip>
            <Chip tone="gold">Urgency: {result.lead.urgency}</Chip>
          </div>
        </Panel>
      )}
      {step >= 2 && (
        <Panel>
          <div className="rounded-lg border border-accent-400/30 bg-ink-950/50 p-4">
            <p className="mb-2 text-xs text-ink-400">Reply · <span className="text-ink-200">{result.reply.subject}</span></p>
            <p className="text-sm leading-relaxed text-ink-200"><Typed text={result.reply.body} speed={10} /></p>
          </div>
        </Panel>
      )}
      {step >= 3 && (
        <Panel>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-400">Offered times:</span>
            {result.slots.map((s) => <Chip key={s} tone="gold"><CalendarClock size={12} />{s}</Chip>)}
          </div>
        </Panel>
      )}
      {step >= 4 && (
        <Panel>
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-3"><p className="text-xs text-ink-400">CRM</p><p className="text-ink-200">{result.crmNote}</p></div>
            <div className="rounded-lg border border-ink-700 bg-ink-950/50 p-3"><p className="text-xs text-ink-400">Follow-up</p><p className="text-ink-200">{result.followUp}</p></div>
          </div>
        </Panel>
      )}
    </div>
  );
}

export default function TryPage() {
  const [params, setParams] = useSearchParams();
  const flowKey = params.get("flow") === "social" ? "social" : "workflow";
  const flow = FLOWS[flowKey];

  const [run, setRun] = useState({ input: SAMPLE_INPUT[flowKey], result: SAMPLE_RESULT[flowKey], live: false });
  const [step, setStep] = useState(0);
  const [approved, setApproved] = useState(false);
  const [me, setMe] = useState(null); // { signedIn, name, used }
  const [form, setForm] = useState({ business: "", detail: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef(null);
  const last = flow.steps.length - 1;

  // Replay from the start whenever the flow or the run changes
  const restart = () => { setStep(0); setApproved(false); };
  useEffect(() => { setRun({ input: SAMPLE_INPUT[flowKey], result: SAMPLE_RESULT[flowKey], live: false }); restart(); setError(""); }, [flowKey]);

  // Advance one step at a time; social waits at "approve" for the visitor's click
  const waiting = flowKey === "social" && step === 3 && !approved;
  useEffect(() => {
    if (step >= last || waiting) return;
    timer.current = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(timer.current);
  }, [step, waiting, last, run]);

  useEffect(() => {
    fetch(`${BEX_URL}/api/studio-demo`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const done = step >= last && (flowKey !== "social" || approved);
  const minutes = run.result.minutesSaved;
  const signInUrl = useMemo(
    () => `${BEX_URL}/login?callbackUrl=${encodeURIComponent(window.location.href.split("#")[0] + "#live")}`,
    [flowKey],
  );

  const runLive = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${BEX_URL}/api/studio-demo`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow: flowKey, ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        if (data.used) setMe((m) => ({ ...m, used: true }));
        return;
      }
      setMe((m) => ({ ...m, used: true }));
      setRun({ input: form, result: data.result, live: true });
      restart();
      document.getElementById("stage")?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setError("Couldn't reach the demo. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10 sm:px-6">
        <p className="eyebrow">Try it live</p>
        <h1 className="mt-3 font-display text-[2.1rem] leading-tight text-ink-100 sm:text-[2.8rem]">{flow.title}</h1>
        <p className="mt-3 max-w-2xl text-ink-400">
          Watch {flow.product} do in seconds what usually takes a person{" "}
          <span className="text-gold-400">{minutes} minutes</span>. Then run it once with your own business.
        </p>

        {/* Flow switch */}
        <div className="mt-6 inline-flex rounded-lg border border-ink-700 bg-ink-900 p-1">
          {Object.entries(FLOWS).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setParams({ flow: key })}
              className={`rounded-md px-3.5 py-2 text-sm transition-colors ${key === flowKey ? "bg-accent-400/15 text-ink-100" : "text-ink-400 hover:text-ink-200"}`}
            >
              {f.product}
            </button>
          ))}
        </div>

        <section id="stage" className="mt-6 grid scroll-mt-24 gap-5 lg:grid-cols-[280px_1fr]">
          {/* Pipeline */}
          <ol className="card relative h-fit p-5">
            {flow.steps.map(({ icon: Icon, label }, i) => {
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
                {run.live ? "Live run for " : "Example: "}<span className="text-ink-200">{run.input.business}</span>
              </span>
              <button onClick={restart} className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-200">
                <RotateCcw size={12} /> Replay
              </button>
            </div>
            {flowKey === "social" ? (
              <SocialStage step={step} input={run.input} result={run.result} approved={approved} onApprove={() => { setApproved(true); setStep(4); }} />
            ) : (
              <WorkflowStage step={step} input={run.input} result={run.result} />
            )}
            {done && (
              <Panel>
                <div className="mt-5 flex items-center gap-3 rounded-lg border border-gold-500/40 bg-gold-500/10 p-4">
                  <Timer className="shrink-0 text-gold-400" />
                  <p className="text-sm text-ink-100">
                    Done in under a minute. By hand this takes about <b className="text-gold-300">{minutes} minutes</b>, every time.
                  </p>
                </div>
              </Panel>
            )}
          </div>
        </section>

        {/* Live run */}
        <section id="live" className="mt-8 grid scroll-mt-24 gap-5 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">Your turn</p>
            <p className="mt-2 text-sm text-ink-400">One free live run per person, written by AI for your business. Sign in with your 4XOR account to start.</p>
          </div>
          <div className="card p-5 sm:p-6">
            {!me?.signedIn ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">Sign in once, then run {flow.product} for your own business.</p>
                <a href={signInUrl} className="btn btn-primary">Sign in to run it live <ArrowRight size={16} /></a>
              </div>
            ) : me.used && !run.live ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">You've used your free live run. Want this running for your business every day?</p>
                <a href={BOOK_URL} className="btn btn-primary">Book a demo</a>
              </div>
            ) : run.live ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-300">
                  That was your live run. After booking, it runs on your own accounts every day, and you approve in your Studio workspace.
                </p>
                <div className="flex gap-2">
                  <a href={flow.more} className="btn">Request this service</a>
                  <a href={BOOK_URL} className="btn btn-primary">Book a demo</a>
                </div>
              </div>
            ) : (
              <form onSubmit={runLive} className="grid gap-3">
                <label className="grid gap-1.5 text-sm text-ink-300">
                  {flow.businessLabel}
                  <input
                    required minLength={3} maxLength={300}
                    value={form.business}
                    onChange={(e) => setForm({ ...form, business: e.target.value })}
                    placeholder={flow.businessHint}
                    className="rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:outline-none"
                  />
                </label>
                <label className="grid gap-1.5 text-sm text-ink-300">
                  {flow.detailLabel}
                  <textarea
                    required minLength={3} maxLength={1000} rows={3}
                    value={form.detail}
                    onChange={(e) => setForm({ ...form, detail: e.target.value })}
                    placeholder={flow.detailHint}
                    className="resize-none rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-ink-100 placeholder:text-ink-500 focus:border-accent-400 focus:outline-none"
                  />
                </label>
                {error && <p className="text-sm text-red-300">{error}</p>}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-ink-400">Signed in as {me.name || "you"} · 1 free run</span>
                  <button disabled={busy} className="btn btn-primary">
                    {busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" /> Running…</> : <><Send size={16} /> Run it live</>}
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
