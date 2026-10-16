"use client";

import { AnimatePresence, motion } from "motion/react";
import { GitCommitHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useStepper } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ease = [0.25, 1, 0.5, 1] as const;

function Card({ title, body, children, className }: { title: string; body: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("surface group relative flex flex-col overflow-hidden rounded-3xl p-6 md:p-7", className)}>
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-mint/[0.05] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
      <h3 className="text-[18px] font-medium tracking-[-0.02em] text-fg">{title}</h3>
      <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-fg-3">{body}</p>
      <div className="relative mt-6 flex-1">{children}</div>
    </div>
  );
}

/* Node inspector ---------------------------------------------------------- */

const props = [
  ["file", "src/orders/OrderService.java"],
  ["symbol", "method · public · L42–89"],
  ["language", "java"],
  ["module", "orders"],
  ["embedding", "[0.12, −0.44, 0.91, …] 1536d"],
  ["metadata", '{ owner: "@orders", churn: "low" }'],
  ["relations", "14 typed edges"],
];

const satellites = [
  { label: "OrderController", edge: "CALLS", x: 60, y: 46 },
  { label: "OrderRepository", edge: "CALLS", x: 262, y: 40 },
  { label: "PaymentService", edge: "CALLS", x: 284, y: 150 },
  { label: "Order", edge: "WRITES", x: 240, y: 244 },
  { label: "OrderServiceTest", edge: "REFERENCES", x: 72, y: 250 },
  { label: "application.yml", edge: "READS", x: 30, y: 150 },
];

function NodeInspector() {
  const cx = 165;
  const cy = 148;
  return (
    <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative min-h-[250px]">
        <svg viewBox="0 0 330 290" className="h-full w-full" aria-hidden>
          {satellites.map((s, i) => (
            <g key={s.label}>
              <motion.line
                x1={cx}
                y1={cy}
                x2={s.x}
                y2={s.y}
                stroke="rgba(61,214,140,0.45)"
                strokeWidth={1}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease }}
              />
              <motion.text
                x={(cx + s.x) / 2}
                y={(cy + s.y) / 2 - 4}
                textAnchor="middle"
                className="svg-halo fill-mint font-mono text-[7.5px] tracking-[0.1em]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.85 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                {s.edge}
              </motion.text>
              <motion.g
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45, ease }}
              >
                <circle cx={s.x} cy={s.y} r={4.5} fill="#0f2a1d" stroke="#3dd68c" strokeWidth={1} />
                <text x={s.x} y={s.y + 16} textAnchor="middle" className="svg-halo fill-fg-3 font-mono text-[9px]">
                  {s.label}
                </text>
              </motion.g>
            </g>
          ))}
          <circle cx={cx} cy={cy} r={26} fill="url(#insp-glow)" />
          <defs>
            <radialGradient id="insp-glow">
              <stop offset="0%" stopColor="#3dd68c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3dd68c" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={7} fill="#3dd68c" stroke="#c3f9de" strokeWidth={1.2} />
          <text x={cx} y={cy + 22} textAnchor="middle" className="svg-halo fill-fg font-mono text-[9.5px] font-medium">
            OrderService.createOrder
          </text>
        </svg>
      </div>
      <div className="min-w-0 rounded-2xl border border-line bg-ink/60 p-4 font-mono text-[11.5px]">
        <p className="text-fg-4">
          node <span className="text-mint">OrderService.createOrder</span>
        </p>
        <ul className="mt-2">
          {props.map(([k, v], i) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease }}
              className="flex gap-2 py-[3px]"
            >
              <span className="text-fg-5">{i === props.length - 1 ? "└─" : "├─"}</span>
              <span className="w-[76px] shrink-0 text-fg-3">{k}</span>
              <span className={cn("min-w-0 truncate", k === "relations" ? "text-mint" : "text-fg-2")}>{v}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Typed edges ------------------------------------------------------------- */

const edgeTypes = [
  { type: "CALLS", from: "OrderService", to: "PaymentService.authorize()" },
  { type: "IMPORTS", from: "checkout.tsx", to: "@/lib/payments" },
  { type: "IMPLEMENTS", from: "StripeProvider", to: "PaymentProvider" },
  { type: "EXTENDS", from: "AdminController", to: "BaseController" },
  { type: "REFERENCES", from: "OrderRepository", to: "Order" },
  { type: "DEPENDS_ON", from: "orders", to: "payments" },
  { type: "READS", from: "UserService", to: "Redis user:{id}" },
  { type: "WRITES", from: "NotificationService", to: "events.queue" },
  { type: "EXPOSES", from: "OrderController", to: "POST /orders" },
];

function TypedEdges() {
  const [ref, active, setActive] = useStepper<HTMLDivElement>(edgeTypes.length, 1700);
  const e = edgeTypes[active];
  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex flex-wrap gap-1.5">
        {edgeTypes.map((t, i) => (
          <button
            key={t.type}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[10.5px] tracking-[0.06em] transition-all duration-300",
              i === active ? "border-mint/40 bg-mint/10 text-mint" : "border-line text-fg-4 hover:text-fg-2",
            )}
          >
            {t.type}
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-1 items-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={e.type}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease }}
            className="w-full rounded-2xl border border-line bg-ink/60 p-4 font-mono text-[11.5px]"
          >
            <p className="text-fg-2">{e.from}</p>
            <div className="my-2 flex items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-r from-mint/10 to-mint/70" />
              <span className="text-[10px] tracking-[0.1em] text-mint">{e.type}</span>
              <span className="h-px w-6 bg-mint/70" />
              <span className="-ml-2 size-1.5 rotate-45 border-r border-t border-mint" />
            </div>
            <p className="text-right text-fg-2">{e.to}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Vector vs graph --------------------------------------------------------- */

function VectorVsGraph() {
  return (
    <div className="flex h-full flex-col justify-end gap-3 font-mono text-[11.5px]">
      <div className="rounded-2xl border border-line bg-ink/60 p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-fg-5">Vector index</p>
        <div className="mt-3 flex items-center gap-2 text-fg-4">
          <span className="rounded-md border border-line px-2 py-0.5">file</span>
          <span className="h-px flex-1 bg-line-3" />
          <span className="rounded-md border border-line px-2 py-0.5">embedding</span>
        </div>
      </div>
      <div className="rounded-2xl border border-mint/25 bg-mint/[0.04] p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-mint/80">Andro context graph</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-fg-2">
          <span className="rounded-md border border-mint/40 bg-mint/10 px-2 py-0.5 text-mint">symbol</span>
          {["callers", "deps", "models", "tests", "config", "history"].map((x, i) => (
            <motion.span
              key={x}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="rounded-md border border-line-2 px-2 py-0.5"
            >
              {x}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Always current ---------------------------------------------------------- */

const reindex = [
  { k: "commit", v: "a41f9c2 · split tax calculation" },
  { k: "changed", v: "3 files" },
  { k: "updated", v: "11 nodes · 27 edges" },
  { k: "context", v: "fresh" },
];

function AlwaysCurrent() {
  const [ref, step] = useStepper<HTMLDivElement>(reindex.length + 2, 900);
  return (
    <div ref={ref} className="flex h-full flex-col justify-end">
      <div className="relative">
        <div className="absolute left-0 right-0 top-[15px] h-px bg-line-2" />
        <motion.div
          className="absolute left-0 top-[15px] h-px bg-gradient-to-r from-mint-3 to-mint"
          animate={{ width: `${(Math.min(step, reindex.length - 1) / (reindex.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease }}
        />
        <ol className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {reindex.map((r, i) => {
            const on = i <= step;
            return (
              <li key={r.k} className="flex flex-col items-start pr-3">
                <span
                  className={cn(
                    "grid size-[30px] place-items-center rounded-full border transition-all duration-500",
                    on ? "border-mint/50 bg-mint/15 text-mint shadow-[0_0_20px_-4px_rgb(61_214_140/0.6)]" : "border-line-2 bg-ink-2 text-fg-5",
                  )}
                >
                  {i === 0 ? <GitCommitHorizontal className="size-3.5" /> : <span className="font-mono text-[10px]">{i + 1}</span>}
                </span>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">{r.k}</span>
                <span className={cn("mt-1 font-mono text-[12px] transition-colors duration-500", on ? "text-fg" : "text-fg-4")}>{r.v}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function GraphBento() {
  return (
    <section id="graph" className="relative scroll-mt-24 px-5 py-24 md:py-36">
      <SectionHeading
        index="06"
        eyebrow="The context graph"
        title={
          <>
            Much richer than a <Accent>vector database.</Accent>
          </>
        }
        lead="A vector index stores file → embedding. Andro stores what the code is and how it connects — nodes with their file, symbol, language, module and metadata, joined by typed edges."
      />

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card
            className="h-full"
            title="Every node knows where it lives"
            body="Symbols carry their file, language, module, embedding and metadata — and every relationship to the rest of the system."
          >
            <NodeInspector />
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full" title="Typed edges" body="Relationships are first-class and named, so an agent can ask precise structural questions.">
            <TypedEdges />
          </Card>
        </Reveal>
        <Reveal delay={0.04}>
          <Card className="h-full" title="Structure beats similarity" body="Similarity finds text that looks alike. Structure finds code that is actually connected.">
            <VectorVsGraph />
          </Card>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <Card
            className="h-full"
            title="Always current"
            body="Andro re-indexes what changed, so an agent never reasons over a stale map of your code."
          >
            <AlwaysCurrent />
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
