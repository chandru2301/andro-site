"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/hooks";

const PROMPT = "Add Razorpay payment support.";
const INSIGHT = ["There's already a ", "payment abstraction", ". I should extend it instead of creating a second payment system."];
const INSIGHT_LEN = INSIGHT.join("").length;
const keywords = ["razorpay", "payment", "checkout", "order"];

const chainNodes = [
  { name: "PaymentController", kind: "controller" },
  { name: "PaymentService", kind: "service" },
  { name: "PaymentRepository", kind: "repository" },
  { name: "Payment", kind: "model" },
  { name: "Order", kind: "model" },
  { name: "Database", kind: "infra" },
  { name: "Frontend checkout", kind: "client" },
];

const capabilities = [
  "PaymentProvider abstraction",
  "Webhook handler",
  "Authentication",
  "Transaction handling",
  "Environment config",
];

const plan = [
  "RazorpayProvider implements PaymentProvider",
  "Register /webhooks/razorpay on the existing WebhookRouter",
  "Add RAZORPAY_KEY_ID / _SECRET to config/payments.yml",
  "Extend PaymentServiceTest for the new provider",
];

// Timeline (ms from start).
const T = {
  naive: 1500,
  miss: 2700,
  mapping: 3200,
  chain: 3500,
  chainStep: 290,
  caps: 5700,
  capStep: 190,
  summary: 6900,
  insight: 7400,
  plan: 9900,
  planStep: 260,
  end: 11400,
};

function useTimeline(run: boolean, runId: number, reduce: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (reduce) {
      setElapsed(T.end);
      return;
    }
    setElapsed(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const e = now - start;
      setElapsed(e);
      if (e < T.end) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, runId, reduce]);
  return elapsed;
}

function Line({ who, children, show }: { who: "you" | "agent" | "andro"; children: ReactNode; show: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          className="grid grid-cols-[52px_1fr] gap-3"
        >
          <span className={cn("pt-px text-right text-[11px]", who === "andro" ? "text-mint" : who === "you" ? "text-sky" : "text-violet")}>
            {who} ›
          </span>
          <div className="min-w-0">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ContextDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = !!useReducedMotionSafe();
  const [runId, setRunId] = useState(0);
  const e = useTimeline(inView, runId, reduce);
  const at = (ms: number) => e >= ms;

  const typed = PROMPT.slice(0, Math.max(0, Math.floor((e - 250) / 38)));
  const insightChars = Math.max(0, Math.min(INSIGHT_LEN, Math.floor((e - T.insight) / 20)));
  const [pre, hl, post] = INSIGHT.map((part, i) => {
    const offset = INSIGHT.slice(0, i).join("").length;
    return part.slice(0, Math.max(0, insightChars - offset));
  });
  const chainLit = Math.max(0, Math.min(chainNodes.length, Math.floor((e - T.chain) / T.chainStep) + 1));
  const capsLit = Math.max(0, Math.min(capabilities.length, Math.floor((e - T.caps) / T.capStep) + 1));
  const planShown = Math.max(0, Math.min(plan.length, Math.floor((e - T.plan) / T.planStep) + 1));
  const done = at(T.end);

  return (
    <section className="relative px-5 py-24 md:py-36">
      <SectionHeading
        index="05"
        eyebrow="Dynamic context"
        title={
          <>
            Context, assembled <Accent>for the task.</Accent>
          </>
        }
        lead="Ask for Razorpay support. A naive agent greps for keywords. An agent with Andro sees the payment system that already exists — and extends it instead of building a second one."
      />

      <Reveal className="mx-auto mt-16 max-w-6xl">
        <div ref={ref}>
          <Window
            title="agent session · shop-platform · context by andro"
            right={
              <button
                type="button"
                onClick={() => setRunId((r) => r + 1)}
                disabled={!done}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10.5px] transition-all duration-300",
                  done ? "border-line-2 text-fg-3 hover:border-mint/40 hover:text-mint" : "pointer-events-none border-transparent text-transparent",
                )}
              >
                <RotateCcw className="size-3" />
                replay
              </button>
            }
            bodyClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]"
          >
            {/* Session */}
            <div className="min-h-[430px] space-y-5 border-line p-5 font-mono text-[12.5px] leading-relaxed md:p-7 lg:border-r">
              <Line who="you" show>
                <span className="text-fg">{typed}</span>
                {!at(T.naive) && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-blink bg-fg/70" />}
              </Line>

              <Line who="agent" show={at(T.naive)}>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-fg-4">naive search</span>
                  {keywords.map((k, i) => (
                    <motion.span
                      key={k}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.12 }}
                      className={cn(
                        "rounded-md border px-1.5 text-[11.5px] transition-all duration-500",
                        at(T.miss) ? "border-line text-fg-5 line-through decoration-rose/60" : "border-line-2 text-fg-2",
                      )}
                    >
                      {k}
                    </motion.span>
                  ))}
                </div>
                <AnimatePresence>
                  {at(T.miss) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-[11.5px] text-rose/80">
                      23 keyword hits · no structure · missed the existing provider
                    </motion.p>
                  )}
                </AnimatePresence>
              </Line>

              <Line who="andro" show={at(T.mapping)}>
                {at(T.summary) ? (
                  <span className="text-fg-2">
                    <Check className="mr-1.5 inline size-3.5 -translate-y-px text-mint" />
                    7 components · 5 existing capabilities · <span className="text-mint">4.1k tokens</span> of context
                  </span>
                ) : (
                  <TextShimmer>Mapping the payment system…</TextShimmer>
                )}
              </Line>

              <Line who="agent" show={at(T.insight)}>
                <p className="text-fg">
                  {pre}
                  <span className="text-mint">{hl}</span>
                  {post}
                  {at(T.insight) && !at(T.plan) && <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-blink bg-fg/70" />}
                </p>
                {planShown > 0 && (
                  <div className="mt-3 rounded-xl border border-line bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-fg-5">plan</p>
                    <ol className="mt-2 space-y-1.5">
                      {plan.slice(0, planShown).map((p, i) => (
                        <motion.li
                          key={p}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-2.5 text-[11.5px] text-fg-2"
                        >
                          <span className="text-fg-5">{i + 1}</span>
                          <span>{p}</span>
                        </motion.li>
                      ))}
                    </ol>
                  </div>
                )}
              </Line>
            </div>

            {/* Context map */}
            <div className="relative overflow-hidden p-5 md:p-7">
              <div aria-hidden className="bg-dots pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_50%_40%,#000_20%,transparent_75%)]" />
              <p className="relative font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">Andro context map</p>
              <ol className="relative mt-4">
                {chainNodes.map((n, i) => {
                  const lit = i < chainLit && at(T.chain);
                  return (
                    <li key={n.name} className="relative flex items-center gap-3 py-[5px]">
                      {i < chainNodes.length - 1 && (
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-[5px] top-[19px] h-[calc(100%-8px)] w-px transition-colors duration-500",
                            i + 1 < chainLit ? "bg-mint/50" : "bg-line-2",
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 size-[11px] shrink-0 rounded-full border transition-all duration-500",
                          lit ? "border-mint bg-mint shadow-[0_0_12px_rgb(61_214_140/0.6)]" : "border-line-3 bg-ink-2",
                        )}
                      />
                      <span
                        className={cn(
                          "flex flex-1 items-center justify-between rounded-lg border px-3 py-1.5 transition-all duration-500",
                          lit ? "border-mint/25 bg-mint/[0.05]" : "border-line bg-transparent",
                        )}
                      >
                        <span className={cn("font-mono text-[12px] transition-colors duration-500", lit ? "text-fg" : "text-fg-5")}>{n.name}</span>
                        <span className="font-mono text-[10px] text-fg-5">{n.kind}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="relative mt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">Already in the codebase</p>
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {capabilities.map((c, i) => {
                  const lit = i < capsLit && at(T.caps);
                  return (
                    <span
                      key={c}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all duration-500",
                        lit ? "border-mint/30 bg-mint/[0.07] text-fg-2" : "border-line text-fg-5",
                      )}
                    >
                      <Check className={cn("size-3 transition-colors", lit ? "text-mint" : "text-fg-5")} />
                      {c}
                    </span>
                  );
                })}
              </div>
            </div>
          </Window>
        </div>
      </Reveal>
    </section>
  );
}
