"use client";

import { LayoutGroup, motion } from "motion/react";
import { Check, RotateCcw, X } from "lucide-react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useStepper } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const naive = [
  "User request",
  "LLM receives prompt",
  "Search files",
  "Read files",
  "Search again",
  "Read more files",
  "Guess relationships",
  "Modify code",
  "Run tests",
  "Discover missing context",
];
const LOOP_FROM = 4; // "Search again"
const MISSING = naive.length - 1;
const ROW = 37; // 33px row + 4px gap
const LOOP_H = ROW * (MISSING - LOOP_FROM) + 4;
const LOOP_PATH = `M 4 ${LOOP_H} C 28 ${LOOP_H}, 34 ${LOOP_H - 6}, 34 ${LOOP_H - 26} L 34 26 C 34 6, 28 0, 4 0`;

const withAndro = [
  { label: "User request", meta: "" },
  { label: "Andro assembles focused context", meta: "callers · deps · models · tests · config" },
  { label: "Agent reasons over the system", meta: "extends what exists" },
  { label: "Modify code", meta: "" },
  { label: "Run tests", meta: "pass" },
];

function NaiveLoop() {
  const [ref, step] = useStepper<HTMLDivElement>(naive.length + 1, 720, (i) => (i >= MISSING ? LOOP_FROM : i + 1));
  return (
    <div ref={ref} className="surface relative flex h-full flex-col overflow-hidden rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-4">Without Andro</p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-fg">The rediscovery loop</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose/25 bg-rose/[0.06] px-2.5 py-1 font-mono text-[11px] text-rose/90">
          <RotateCcw className="size-3" />
          loops
        </span>
      </div>

      <LayoutGroup id="naive">
        <ol className="relative mt-7 space-y-1">
          {naive.map((label, i) => {
            const active = i === step;
            const missing = i === MISSING;
            return (
              <li key={label} className="relative h-[33px]">
                {active && (
                  <motion.span
                    layoutId="naive-active"
                    className={cn(
                      "absolute inset-0 rounded-xl border",
                      missing ? "border-rose/30 bg-rose/[0.08]" : "border-line-2 bg-white/[0.04]",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <div
                  className={cn(
                    "relative flex h-full items-center gap-3 px-3 pr-14 font-mono text-[12.5px] transition-colors duration-300",
                    active ? (missing ? "text-rose" : "text-fg") : i >= LOOP_FROM - 2 ? "text-fg-4" : "text-fg-5",
                  )}
                >
                  <span className="w-5 text-right text-[10.5px] text-fg-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{label}</span>
                  {missing && <X className="size-3.5 shrink-0 text-rose/70" />}
                </div>
              </li>
            );
          })}

          {/* loop-back arrow: "Discover missing context" → "Search again" */}
          <svg
            aria-hidden
            className="pointer-events-none absolute right-3 w-10 overflow-visible"
            style={{ top: ROW * LOOP_FROM + ROW / 2 - 2, height: LOOP_H }}
            viewBox={`0 0 40 ${LOOP_H}`}
            fill="none"
          >
            <path d={LOOP_PATH} stroke="rgb(255 122 138 / 0.35)" strokeDasharray="3 4" />
            <path d="M 10 -5 L 4 0 L 10 5" stroke="rgb(255 122 138 / 0.7)" />
            {step === MISSING && (
              <circle r="2.5" fill="#ff7a8a">
                <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={LOOP_PATH} />
              </circle>
            )}
          </svg>
        </ol>
      </LayoutGroup>

      <p className="mt-auto pt-6 text-[14px] leading-relaxed text-fg-4">
        Every task rediscovers the same repository — and the gap only shows up after the tests fail.
      </p>
    </div>
  );
}

function AndroPath() {
  const HOLD = withAndro.length + 3;
  const [ref, step] = useStepper<HTMLDivElement>(HOLD, 900, (i) => (i + 1) % HOLD);
  const current = Math.min(step, withAndro.length - 1);
  const done = step >= withAndro.length - 1;

  return (
    <div ref={ref} className="surface relative flex h-full flex-col overflow-hidden rounded-3xl p-6 md:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-mint/[0.08] blur-3xl" />
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mint/80">With Andro</p>
          <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-fg">Understand, then change</h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500",
            done ? "border-mint/30 bg-mint/[0.08] text-mint" : "border-line-2 text-fg-4",
          )}
        >
          <Check className="size-3" />
          one pass
        </span>
      </div>

      <LayoutGroup id="andro">
        <ol className="relative mt-7">
          <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-mint/40 via-line-2 to-transparent" />
          {withAndro.map((s, i) => {
            const active = i === current;
            const passed = i < current || (done && i === current);
            return (
              <li key={s.label} className="relative py-1">
                {active && (
                  <motion.span
                    layoutId="andro-active"
                    className="absolute inset-0 rounded-xl border border-mint/25 bg-mint/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <div className="relative flex items-center gap-3 px-3 py-2.5">
                  <span
                    className={cn(
                      "grid size-[22px] shrink-0 place-items-center rounded-full border transition-all duration-500",
                      passed || active ? "border-mint/50 bg-mint/15 text-mint" : "border-line-2 bg-ink-2 text-fg-5",
                    )}
                  >
                    {passed ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0">
                    <p className={cn("text-[14.5px] transition-colors duration-300", active || passed ? "text-fg" : "text-fg-4")}>
                      {s.label}
                    </p>
                    {s.meta && <p className="mt-0.5 font-mono text-[11px] text-fg-4">{s.meta}</p>}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </LayoutGroup>

      <p className="mt-auto pt-6 text-[14px] leading-relaxed text-fg-3">
        The agent starts from a model of the system — so it can extend what already exists instead of guessing around it.
      </p>
    </div>
  );
}

export function Problem() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 px-5 py-24 md:py-36">
      <SectionHeading
        index="01"
        eyebrow="The problem"
        title={
          <>
            Every task starts with a <Accent>scavenger hunt.</Accent>
          </>
        }
        lead="A coding agent can know the contents of individual files without understanding the system they form. So it searches, reads, searches again — and guesses at the relationships in between."
      />

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2">
        <Reveal className="h-full">
          <NaiveLoop />
        </Reveal>
        <Reveal className="h-full" delay={0.12}>
          <AndroPath />
        </Reveal>
      </div>
      <p className="mt-5 text-center font-mono text-[11px] text-fg-4">Illustrative flow</p>
    </section>
  );
}
