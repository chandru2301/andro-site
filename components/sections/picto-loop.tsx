"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, FileCode2, Play, RotateCcw } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Window } from "@/components/ui/window";
import { cn } from "@/lib/utils";

type NodeId = "frontend" | "gateway" | "order" | "db" | "redis";

// x = desktop column, xm = narrow-canvas column (keeps the sticky note clear of the nodes).
const pnodes: { id: NodeId; label: string; sub: string; x: number; xm: number; y: number }[] = [
  { id: "frontend", label: "Frontend", sub: "web · react", x: 42, xm: 27, y: 13 },
  { id: "gateway", label: "API Gateway", sub: "routes · auth", x: 42, xm: 27, y: 37 },
  { id: "order", label: "Order Service", sub: "orders", x: 42, xm: 27, y: 61 },
  { id: "db", label: "PostgreSQL", sub: "primary", x: 42, xm: 27, y: 86 },
];
const redisNode = { id: "redis" as NodeId, label: "Redis cache", sub: "orders.ttl 5m", x: 79, xm: 73, y: 74 };

const entities: Record<NodeId, { file: string; path: string; sections: [string, string[]][] }> = {
  frontend: {
    file: "Checkout.tsx",
    path: "web/src/pages/Checkout.tsx",
    sections: [
      ["Components", ["CheckoutPage", "CartDrawer", "OrderHistory"]],
      ["Calls", ["POST /orders", "GET /orders/:id"]],
      ["Used by", ["web router"]],
    ],
  },
  gateway: {
    file: "routes.ts",
    path: "gateway/src/routes.ts",
    sections: [
      ["Routes", ["/orders/*", "/payments/*"]],
      ["Middleware", ["JwtAuth", "RateLimit"]],
      ["Forwards to", ["OrderService", "PaymentService"]],
    ],
  },
  order: {
    file: "OrderService.java",
    path: "src/orders/OrderService.java",
    sections: [
      ["Methods", ["createOrder()", "cancelOrder()", "getOrder()"]],
      ["Dependencies", ["OrderRepository", "PaymentService", "NotificationService"]],
      ["Used by", ["OrderController", "AdminController"]],
    ],
  },
  db: {
    file: "schema.sql",
    path: "db/schema.sql",
    sections: [
      ["Tables", ["orders", "order_lines", "payments"]],
      ["Accessed by", ["OrderRepository", "PaymentRepository"]],
      ["Migrations", ["42 applied"]],
    ],
  },
  redis: {
    file: "OrderCacheConfig.java",
    path: "src/orders/OrderCacheConfig.java",
    sections: [
      ["Caches", ["getOrder() · @Cacheable(\"orders\")"]],
      ["Config", ["cache.yml › orders.ttl = 5m"]],
      ["Added by", ["agent · this loop"]],
    ],
  },
};

const loop = [
  { stage: "Picto", title: "Intent", body: "“Add caching here” — between Order Service and PostgreSQL." },
  { stage: "Andro", title: "Context", body: "Redis dependency · existing CacheManager · cache.yml · OrderService.getOrder()" },
  { stage: "Agent", title: "Implement", body: '+ @Cacheable("orders") on getOrder() · + OrderCacheConfig' },
  { stage: "Tests", title: "Verify", body: "OrderServiceTest · CheckoutFlowIT — passing" },
  { stage: "Picto", title: "Update", body: "Architecture now shows Redis next to Order Service." },
];
const STEP_MS = 1150;

const chips = ["Picto · intent", "Andro · context", "Agent · execute", "Code", "Andro · re-index"];
/** Which loop steps light up each chip in the one-line summary. */
const chipSteps = [[0, 4], [1], [2], [2, 3], [4]];

export function PictoLoop() {
  const [selected, setSelected] = useState<NodeId>("order");
  const [step, setStep] = useState(-1); // -1 idle · 0..4 running · 5 done
  const [view, setView] = useState<"entity" | "loop">("entity");
  const [cached, setCached] = useState(false);
  const running = step >= 0 && step < loop.length;
  const done = step >= loop.length;

  useEffect(() => {
    if (!running) return;
    if (step === loop.length - 1) setCached(true);
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, running]);

  const run = () => {
    setSelected("order");
    setView("loop");
    setStep(0);
  };
  const reset = () => {
    setStep(-1);
    setCached(false);
    setView("entity");
    setSelected("order");
  };
  const openCache = () => {
    setSelected("redis");
    setView("entity");
  };
  const select = (id: NodeId) => {
    setSelected(id);
    if (!running) setView("entity");
  };

  const nodes = cached ? [...pnodes, redisNode] : pnodes;
  const entity = entities[selected];

  return (
    <section id="picto" className="relative scroll-mt-24 px-5 py-24 md:py-36">
      <SectionHeading
        index="10"
        eyebrow="Andro + Picto"
        title={
          <>
            Diagrams that open into <Accent>code.</Accent>
          </>
        }
        lead="Connect the Picto architecture canvas to Andro's graph. Click a service to see the real code behind it — then hand a change to an agent and watch the diagram update itself."
      />

      <Reveal className="mx-auto mt-16 max-w-6xl">
        <Window
          title="picto · shop-platform / architecture"
          right={<span className="font-mono text-[10.5px] text-fg-5">linked to andro</span>}
          bodyClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        >
          {/* Canvas */}
          <div className="relative h-[440px] overflow-hidden border-line lg:h-[500px] lg:border-r">
            <div aria-hidden className="bg-dots absolute inset-0 opacity-80" />
            {(["x", "xm"] as const).map((key) => (
              <svg
                key={key}
                aria-hidden
                className={cn("absolute inset-0 h-full w-full", key === "x" ? "hidden md:block" : "md:hidden")}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {pnodes.slice(0, -1).map((n, i) => (
                  <line
                    key={n.id}
                    x1={n[key]}
                    y1={n.y}
                    x2={pnodes[i + 1][key]}
                    y2={pnodes[i + 1].y}
                    stroke={running && step >= 1 && i === 2 ? "rgba(61,214,140,0.7)" : "rgba(255,255,255,0.16)"}
                    strokeWidth={1.2}
                    vectorEffect="non-scaling-stroke"
                    className="transition-[stroke] duration-500"
                  />
                ))}
                <AnimatePresence>
                  {cached && (
                    <motion.path
                      d={`M ${pnodes[2][key]} ${pnodes[2].y} C ${redisNode[key]} ${pnodes[2].y}, ${redisNode[key]} ${pnodes[2].y}, ${redisNode[key]} ${redisNode.y}`}
                      fill="none"
                      stroke="rgba(61,214,140,0.8)"
                      strokeWidth={1.4}
                      strokeDasharray="4 4"
                      vectorEffect="non-scaling-stroke"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </AnimatePresence>
              </svg>
            ))}

            {nodes.map((n) => {
              const isSel = n.id === selected;
              const isNew = n.id === "redis";
              return (
                <motion.button
                  key={n.id}
                  type="button"
                  onClick={() => select(n.id)}
                  initial={isNew ? { opacity: 0, scale: 0.6, filter: "blur(8px)" } : false}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "absolute left-[var(--xm)] w-[42%] max-w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3.5 py-3 text-left backdrop-blur transition-[border-color,background-color,box-shadow] duration-300 md:left-[var(--x)] md:w-[46%] md:px-4",
                    isSel
                      ? "border-mint/50 bg-ink-2/95 shadow-[0_0_0_4px_rgb(61_214_140/0.08),0_0_40px_-8px_rgb(61_214_140/0.5)]"
                      : "border-line-2 bg-ink-2/90 hover:border-line-3",
                    isNew && "border-mint/40",
                  )}
                  style={{ "--x": `${n.x}%`, "--xm": `${n.xm}%`, top: `${n.y}%` } as CSSProperties}
                  aria-pressed={isSel}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-medium text-fg">{n.label}</span>
                    {isNew && <span className="rounded-full bg-mint/15 px-1.5 font-mono text-[9.5px] text-mint">new</span>}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10.5px] text-fg-4">{n.sub}</span>
                </motion.button>
              );
            })}

            {/* Sticky note on the canvas */}
            <AnimatePresence>
              {!cached && (
                <motion.div
                  initial={{ opacity: 0, rotate: 4, y: 6 }}
                  animate={{ opacity: 1, rotate: 3, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-[3%] top-[48%] w-[44%] max-w-[170px] rounded-lg border border-amber/30 bg-amber/[0.09] p-3 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.9)] backdrop-blur md:right-[5%] md:w-[170px]"
                >
                  <p className="font-serif text-[19px] italic leading-tight text-amber">Add caching here</p>
                  <button
                    type="button"
                    onClick={run}
                    disabled={running}
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] transition-colors",
                      running ? "border-line text-fg-4" : "border-mint/40 bg-mint/10 text-mint hover:bg-mint/20",
                    )}
                  >
                    <Play className="size-3" />
                    {running ? "running…" : "Run with agent"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-3 left-4 font-mono text-[10px] text-fg-5">click a service to open its code</div>
          </div>

          {/* Panel */}
          <div className="flex min-h-[440px] flex-col p-5 md:p-6">
            <AnimatePresence mode="wait" initial={false}>
              {view === "loop" ? (
                <motion.div
                  key="loop"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">Engineering loop</p>
                    {done && (
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 rounded-md border border-line-2 px-2 py-0.5 font-mono text-[10.5px] text-fg-3 hover:border-mint/40 hover:text-mint"
                      >
                        <RotateCcw className="size-3" />
                        reset
                      </button>
                    )}
                  </div>
                  <ol className="relative mt-4 space-y-2">
                    {loop.map((l, i) => {
                      const state = i < step ? "done" : i === step ? "active" : "todo";
                      return (
                        <li
                          key={l.title}
                          className={cn(
                            "rounded-xl border px-3.5 py-3 transition-all duration-500",
                            state === "active" && "border-mint/35 bg-mint/[0.06]",
                            state === "done" && "border-line bg-white/[0.02]",
                            state === "todo" && "border-line/60 opacity-40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "grid size-5 place-items-center rounded-full border text-[10px]",
                                state === "todo" ? "border-line-2 text-fg-5" : "border-mint/50 bg-mint/15 text-mint",
                              )}
                            >
                              {state === "done" ? <Check className="size-3" /> : i + 1}
                            </span>
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-4">{l.stage}</span>
                            <span className="text-[14px] font-medium text-fg">{l.title}</span>
                          </div>
                          <p className="mt-1.5 pl-[30px] font-mono text-[11px] leading-relaxed text-fg-3">{l.body}</p>
                        </li>
                      );
                    })}
                  </ol>
                  {done && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={openCache}
                      className="mt-4 inline-flex items-center gap-1.5 self-start font-mono text-[11px] text-mint hover:underline"
                    >
                      Open the new cache in code
                      <ArrowRight className="size-3" />
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-1 flex-col"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">Andro · code entity</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl border border-mint/30 bg-mint/10 text-mint">
                      <FileCode2 className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[15px] text-fg">{entity.file}</p>
                      <p className="truncate font-mono text-[11px] text-fg-4">{entity.path}</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-5">
                    {entity.sections.map(([label, items]) => (
                      <div key={label}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">{label}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {items.map((it) => (
                            <span key={it} className="rounded-md border border-line-2 bg-white/[0.02] px-2 py-1 font-mono text-[11.5px] text-fg-2">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <p className="text-[13px] leading-relaxed text-fg-4">
                      The diagram isn&apos;t documentation anymore — it&apos;s an interface to the codebase.
                    </p>
                    {cached && !running && (
                      <button
                        type="button"
                        onClick={reset}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line-2 px-2 py-0.5 font-mono text-[10.5px] text-fg-3 hover:border-mint/40 hover:text-mint"
                      >
                        <RotateCcw className="size-3" />
                        reset
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Window>
      </Reveal>

      {/* The loop in one line */}
      <Reveal delay={0.1} className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2 font-mono text-[12px] text-fg-4">
        {chips.map((c, i) => (
          <span key={c} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1.5 transition-colors duration-500",
                running && chipSteps[i].includes(step) ? "border-mint/40 bg-mint/10 text-mint" : "border-line-2",
              )}
            >
              {c}
            </span>
            {i < chips.length - 1 && <ArrowRight className="size-3.5 text-fg-5" />}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
