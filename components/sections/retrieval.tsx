"use client";

import { motion } from "motion/react";
import { Bot, Braces, Network, Search, Sparkles } from "lucide-react";
import { useRef, type RefObject } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useMediaQuery, useStepper } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const signals = [
  {
    key: "kw",
    name: "Keyword",
    tech: "BM25",
    icon: Search,
    query: "Find PaymentService.",
    note: "Excellent for exact identifiers.",
  },
  {
    key: "sem",
    name: "Semantic",
    tech: "embeddings",
    icon: Sparkles,
    query: "Code related to payment processing.",
    note: "When the exact name isn't known.",
  },
  {
    key: "sym",
    name: "Symbol",
    tech: "definitions · references",
    icon: Braces,
    query: "Where is processPayment() defined — and who calls it?",
    note: "Much more structural.",
  },
  {
    key: "graph",
    name: "Graph",
    tech: "traversal",
    icon: Network,
    query: "What depends on PaymentService?",
    note: "A different problem entirely.",
  },
];

const ranked = [
  { name: "PaymentService.processPayment()", from: ["kw", "sym", "graph"], score: "0.94" },
  { name: "PaymentController.charge()", from: ["sym", "graph"], score: "0.88" },
  { name: "OrderService.createOrder()", from: ["graph"], score: "0.81" },
  { name: "checkout/charge.ts", from: ["sem"], score: "0.74" },
  { name: "PaymentServiceTest", from: ["kw", "graph"], score: "0.69" },
];

const tags: Record<string, string> = { kw: "kw", sem: "sem", sym: "sym", graph: "graph" };

export function Retrieval() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const cardRefs: RefObject<HTMLDivElement | null>[] = [r0, r1, r2, r3];
  const wide = useMediaQuery("(min-width: 1024px)", true);
  const [stepRef, active] = useStepper<HTMLDivElement>(signals.length, 2400);

  return (
    <section id="retrieval" className="relative scroll-mt-24 px-5 py-24 md:py-36">
      <SectionHeading
        index="04"
        eyebrow="Retrieval"
        title={
          <>
            Every signal. <Accent>One ranking.</Accent>
          </>
        }
        lead="Keyword, semantic, symbol and graph search each answer a different question. Andro runs them together, then fuses the results with recency and task relevance into one ranked context."
      />

      <div ref={stepRef} className="mx-auto mt-16 max-w-6xl">
        <div
          ref={containerRef}
          className="relative grid grid-cols-1 items-center gap-y-16 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(0,0.95fr)] lg:gap-x-20"
        >
          <div ref={cardsRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {signals.map((s, i) => {
              const Icon = s.icon;
              const on = i === active;
              return (
                <Reveal key={s.key} delay={i * 0.06}>
                  <div
                    ref={cardRefs[i]}
                    className={cn(
                      "surface relative rounded-2xl px-4 py-3.5 transition-[border-color,background-color] duration-500",
                      on && "border-mint/35 bg-mint/[0.04]",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-7 place-items-center rounded-lg border transition-colors duration-500",
                          on ? "border-mint/40 bg-mint/10 text-mint" : "border-line-2 text-fg-4",
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <span className="text-[15px] font-medium text-fg">{s.name}</span>
                      <span className="font-mono text-[10.5px] text-fg-5">{s.tech}</span>
                    </div>
                    <p className="mt-2.5 font-mono text-[12px] leading-relaxed text-fg-2">&ldquo;{s.query}&rdquo;</p>
                    <p className="mt-1 text-[12.5px] text-fg-4">{s.note}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="flex justify-center" delay={0.1}>
            <div ref={hubRef} className="relative w-[230px] overflow-hidden rounded-[26px] p-px">
              <span
                aria-hidden
                className="absolute inset-[-100%] animate-border-spin bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgb(61_214_140/0.9)_12%,transparent_30%,transparent_60%,rgb(124_196_255/0.5)_72%,transparent_88%)]"
              />
              <div className="relative rounded-[25px] bg-ink-2 px-5 py-6 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-mint/30 bg-mint/10">
                  <img src="/brand/andro-mark.png" alt="" className="size-7" />
                </div>
                <p className="mt-4 text-[16px] font-medium tracking-[-0.01em] text-fg">Context ranking</p>
                <p className="mt-1 font-mono text-[10.5px] text-fg-4">reciprocal rank fusion</p>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {["recency", "task relevance", "graph distance"].map((c) => (
                    <span key={c} className="rounded-full border border-line-2 px-2 py-0.5 font-mono text-[10px] text-fg-3">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div ref={agentRef} className="surface rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-medium text-fg">
                  <Bot className="size-4 text-mint" />
                  Context for the agent
                </span>
                <span className="font-mono text-[10.5px] text-fg-5">top 5 · 2.9k tok</span>
              </div>
              <ol className="mt-3 space-y-1">
                {ranked.map((r, i) => {
                  const hit = r.from.includes(signals[active].key);
                  return (
                    <motion.li
                      key={r.name}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-500",
                        hit ? "bg-white/[0.035]" : "",
                      )}
                    >
                      <span className="w-3 font-mono text-[10px] text-fg-5">{i + 1}</span>
                      <span className={cn("min-w-0 flex-1 truncate font-mono text-[11.5px] transition-colors", hit ? "text-fg" : "text-fg-3")}>
                        {r.name}
                      </span>
                      <span className="hidden gap-1 sm:flex">
                        {r.from.map((f) => (
                          <span
                            key={f}
                            className={cn(
                              "rounded px-1 font-mono text-[9px] transition-colors duration-500",
                              f === signals[active].key ? "bg-mint/15 text-mint" : "bg-white/[0.04] text-fg-5",
                            )}
                          >
                            {tags[f]}
                          </span>
                        ))}
                      </span>
                      <span className="font-mono text-[10.5px] tabular-nums text-fg-4">{r.score}</span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          {wide ? (
            <>
              {cardRefs.map((ref, i) => (
                <AnimatedBeam
                  key={i}
                  containerRef={containerRef}
                  fromRef={ref}
                  toRef={hubRef}
                  fromSide="right"
                  toSide="left"
                  duration={2.6}
                  delay={i * 0.35}
                  active={i === active}
                />
              ))}
              <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={agentRef} duration={2.2} delay={0.6} />
            </>
          ) : (
            <>
              <AnimatedBeam containerRef={containerRef} fromRef={cardsRef} toRef={hubRef} fromSide="bottom" toSide="top" duration={2.4} />
              <AnimatedBeam containerRef={containerRef} fromRef={hubRef} toRef={agentRef} fromSide="bottom" toSide="top" duration={2.4} delay={0.8} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
