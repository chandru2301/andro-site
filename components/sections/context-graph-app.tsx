"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import {
  Boxes,
  Braces,
  Command,
  CornerDownLeft,
  FileCode2,
  FlaskConical,
  GitBranch,
  LayoutDashboard,
  Network,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BrandLogo, type Brand } from "@/components/ui/brand-logo";
import { RotatingText } from "@/components/ui/rotating-text";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  edgeMidpoint,
  edgePath,
  edges,
  focuses,
  GRAPH_H,
  GRAPH_W,
  neighborhood,
  nodeById,
  nodes,
  sumTokens,
  type Focus,
} from "@/lib/graph";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/hooks";

const CYCLE_MS = 6400;
const BUDGET = 8000;
const ease = [0.25, 1, 0.5, 1] as const;

/**
 * The hero product shot: an Andro workspace whose command bar cycles through
 * symbols. Each symbol lights up its neighbourhood in the graph while the
 * side panel assembles the focused context an agent would receive.
 */
export function ContextGraphApp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotionSafe();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [assembling, setAssembling] = useState(true);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!inView || hovered || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % focuses.length), CYCLE_MS);
    return () => clearInterval(t);
  }, [inView, hovered, reduce]);

  useEffect(() => {
    setAssembling(true);
    const t = setTimeout(() => setAssembling(false), introDone ? 900 : 1700);
    return () => clearTimeout(t);
    // Only re-run on focus change; the first pass waits for the intro to draw.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const focus = focuses[index];
  const total = sumTokens(focus);

  return (
    <div ref={ref} className={cn("flex flex-col text-left", !inView && "[&_*]:[animation-play-state:paused]")} role="img" aria-label={`Andro workspace showing the focused context for ${focus.symbol}`}>
      <TitleBar />
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[188px_minmax(0,1fr)_300px]">
        <Sidebar />
        <div className="relative flex min-w-0 flex-col md:border-r md:border-line">
          <CommandBar index={index} />
          <GraphCanvas focus={focus} hovered={hovered} onHover={setHovered} introDone={introDone} reduce={!!reduce} />
        </div>
        <ContextPanel focus={focus} assembling={assembling} total={total} />
      </div>
      <MobileContext focus={focus} assembling={assembling} total={total} />
    </div>
  );
}

function TitleBar() {
  return (
    <div className="flex h-11 items-center gap-3 border-b border-line bg-ink-2/70 px-4">
      <div className="flex gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-white/10" />
        <span className="size-2.5 rounded-full bg-white/10" />
      </div>
      <div className="ml-2 flex min-w-0 items-center gap-2 font-mono text-[11.5px] text-fg-3">
        <span className="text-fg-2">andro</span>
        <span className="text-fg-5">/</span>
        <span className="truncate">shop-platform</span>
        <span className="ml-1 hidden items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-[10.5px] text-fg-4 sm:inline-flex">
          <GitBranch className="size-3" />
          main
        </span>
      </div>
      <div className="ml-auto hidden items-center gap-2 font-mono text-[11px] text-fg-4 sm:flex">
        <span className="size-1.5 animate-pulse-ring rounded-full bg-mint" />
        Indexed · 2,418 files · 31,904 symbols
      </div>
    </div>
  );
}

const workspace = [
  { icon: Network, label: "Graph", count: "", active: true },
  { icon: Braces, label: "Symbols", count: "31.9k" },
  { icon: FileCode2, label: "Files", count: "2,418" },
  { icon: Boxes, label: "Dependencies", count: "164" },
  { icon: FlaskConical, label: "Tests", count: "1,202" },
  { icon: LayoutDashboard, label: "Architecture", count: "" },
];

const agents: { name: Brand; state: string }[] = [
  { name: "Claude Code", state: "live" },
  { name: "Codex", state: "idle" },
  { name: "Gemini CLI", state: "idle" },
];

function Sidebar() {
  return (
    <aside className="hidden flex-col gap-6 border-r border-line bg-ink-2/40 p-3 lg:flex">
      <div>
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-5">Workspace</p>
        <div className="space-y-0.5">
          {workspace.map(({ icon: Icon, label, count, active }) => (
            <div
              key={label}
              className={cn(
                "flex items-center justify-between rounded-lg px-2 py-1.5 text-[12.5px]",
                active ? "bg-white/[0.06] text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]" : "text-fg-3",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className={cn("size-3.5", active ? "text-mint" : "text-fg-4")} />
                {label}
              </span>
              <span className="font-mono text-[10px] text-fg-5">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-5">Agents</p>
        <div className="space-y-0.5">
          {agents.map((a) => (
            <div key={a.name} className="flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-2 py-1.5 text-[12.5px] text-fg-3">
              <span className="flex items-center gap-2">
                <span className="relative">
                  <BrandLogo brand={a.name} className="size-3.5" />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 size-1.5 rounded-full ring-2 ring-ink-2",
                      a.state === "live" ? "bg-mint" : "bg-fg-5",
                    )}
                  />
                </span>
                {a.name}
              </span>
              <span className={cn("font-mono text-[10px]", a.state === "live" ? "text-mint/80" : "text-fg-5")}>{a.state}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto rounded-xl border border-line bg-white/[0.02] p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">Index</p>
        <p className="mt-1 text-[12px] text-fg-3">Watching for changes</p>
        <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-index-sweep rounded-full bg-gradient-to-r from-transparent via-mint/70 to-transparent" />
        </div>
      </div>
    </aside>
  );
}

function CommandBar({ index }: { index: number }) {
  return (
    <div className="border-b border-line px-3 py-3 sm:px-4">
      <div className="flex h-9 items-center gap-2.5 rounded-xl border border-line-2 bg-ink/70 px-3 font-mono text-[12px] shadow-[inset_0_1px_0_rgb(255_255_255/0.03)] sm:text-[12.5px]">
        <Command className="size-3.5 shrink-0 text-fg-4" />
        <span className="hidden text-fg-4 sm:inline">context for</span>
        <span className="min-w-0 text-mint">
          <RotatingText words={focuses.map((f) => f.symbol)} index={index} />
        </span>
        <span className="-ml-1.5 h-4 w-[2px] shrink-0 animate-blink bg-mint/80" />
        <span className="ml-auto hidden items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-[10px] text-fg-4 sm:inline-flex">
          <CornerDownLeft className="size-3" />
          run
        </span>
      </div>
    </div>
  );
}

type GraphCanvasProps = {
  focus: Focus;
  hovered: string | null;
  onHover: (id: string | null) => void;
  introDone: boolean;
  reduce: boolean;
};

function GraphCanvas({ focus, hovered, onHover, introDone, reduce }: GraphCanvasProps) {
  const active = useMemo(() => (hovered ? neighborhood(hovered) : new Set(focus.nodes)), [hovered, focus]);
  const targetId = hovered ?? focus.target;
  const focusEdges = useMemo(
    () => edges.filter((e) => active.has(e.from) && active.has(e.to) && (e.from === targetId || e.to === targetId)),
    [active, targetId],
  );

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden bg-[radial-gradient(70%_60%_at_50%_45%,rgb(61_214_140/0.05),transparent_70%)]">
      <div aria-hidden className="bg-dots mask-radial absolute inset-0 opacity-70" />
      <svg viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} className="relative w-full select-none" aria-hidden>
        <defs>
          <radialGradient id="cg-target">
            <stop offset="0%" stopColor="#3dd68c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3dd68c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map((e, i) => {
          const a = nodeById[e.from];
          const b = nodeById[e.to];
          const on = active.has(e.from) && active.has(e.to);
          const d = edgePath(a, b);
          return (
            <g key={`${e.from}-${e.to}`}>
              <motion.path
                d={d}
                fill="none"
                initial={{ pathLength: 0, opacity: 0, stroke: "rgba(255, 255, 255, 0.085)", strokeWidth: 1 }}
                animate={{
                  pathLength: 1,
                  opacity: 1,
                  stroke: on ? "rgba(61, 214, 140, 0.5)" : "rgba(255, 255, 255, 0.085)",
                  strokeWidth: on ? 1.35 : 1,
                }}
                transition={{
                  pathLength: { duration: 1.1, delay: introDone ? 0 : 0.35 + a.x / 900, ease },
                  opacity: { duration: 0.3, delay: introDone ? 0 : 0.35 + a.x / 900 },
                  stroke: { duration: 0.5 },
                  strokeWidth: { duration: 0.5 },
                }}
              />
              {introDone && !reduce && (
                <path
                  d={d}
                  fill="none"
                  pathLength={1}
                  stroke={on ? "#c3f9de" : "#ffffff"}
                  strokeOpacity={on ? 0.95 : 0.12}
                  strokeWidth={on ? 1.7 : 1}
                  strokeLinecap="round"
                  strokeDasharray="0.09 0.91"
                  className="animate-beam"
                  style={
                    {
                      animationDuration: on ? "2.2s" : "5s",
                      animationDelay: `${(i % 6) * 0.37}s`,
                      "--beam-travel": -1,
                    } as CSSProperties
                  }
                />
              )}
            </g>
          );
        })}

        <AnimatePresence>
          {introDone &&
            focusEdges.map((e) => {
              const m = edgeMidpoint(nodeById[e.from], nodeById[e.to]);
              return (
                <motion.text
                  key={`${targetId}-${e.from}-${e.to}`}
                  x={m.x}
                  y={m.y - 5}
                  textAnchor="middle"
                  className="svg-halo fill-mint font-mono text-[7.5px] tracking-[0.1em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {e.type}
                </motion.text>
              );
            })}
        </AnimatePresence>

        {nodes.map((n) => {
          const on = active.has(n.id);
          const isTarget = n.id === targetId;
          return (
            <motion.g
              key={n.id}
              onPointerEnter={() => onHover(n.id)}
              onPointerLeave={() => onHover(null)}
              className="cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: on ? 1 : 0.42 }}
              transition={{ duration: 0.5, delay: introDone ? 0 : 0.15 + n.x / 1100 }}
            >
              <circle cx={n.x} cy={n.y} r={18} fill="transparent" />
              {isTarget && (
                <>
                  <circle cx={n.x} cy={n.y} r={26} fill="url(#cg-target)" />
                  {!reduce && (
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      fill="none"
                      stroke="#3dd68c"
                      strokeWidth={1}
                      initial={{ r: 7, opacity: 0.7 }}
                      animate={{ r: 21, opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </>
              )}
              <motion.circle
                cx={n.x}
                cy={n.y}
                initial={{ r: 0, fill: "#22242a", stroke: "rgba(255, 255, 255, 0.22)" }}
                animate={{
                  r: isTarget ? 6.5 : on ? 5 : 4,
                  fill: isTarget ? "#3dd68c" : on ? "#0f2a1d" : "#22242a",
                  stroke: isTarget ? "#c3f9de" : on ? "#3dd68c" : "rgba(255, 255, 255, 0.22)",
                }}
                strokeWidth={1.2}
                transition={{ duration: 0.45, delay: introDone ? 0 : 0.15 + n.x / 1100, ease }}
              />
              <text
                x={n.x}
                y={n.y + 19}
                textAnchor="middle"
                className={cn(
                  "svg-halo font-mono text-[10.5px] transition-[fill] duration-500",
                  isTarget ? "fill-fg font-medium" : on ? "fill-fg-2" : "fill-fg-4",
                )}
              >
                {n.label}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute inset-x-3 bottom-2.5 hidden items-center justify-between font-mono text-[10px] text-fg-5 sm:flex">
        <span>
          depth 2 · <span className="text-fg-4">{active.size}</span> of 31,904 symbols in focus
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded border border-line px-1.5">−</span>
          100%
          <span className="rounded border border-line px-1.5">+</span>
        </span>
      </div>
    </div>
  );
}

function AssemblingRow() {
  return (
    <motion.div
      key="assembling"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-2.5 py-2 font-mono text-[12px]"
    >
      <span className="relative flex size-3.5 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border border-mint/20 border-t-mint" />
      </span>
      <TextShimmer>Assembling context…</TextShimmer>
    </motion.div>
  );
}

function ContextPanel({ focus, assembling, total }: { focus: Focus; assembling: boolean; total: number }) {
  return (
    <aside className="hidden min-w-0 flex-col bg-ink-2/30 md:flex">
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-5">Focused context</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={focus.symbol}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 truncate font-mono text-[12px] text-fg"
            >
              {focus.symbol}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className="mt-0.5 shrink-0 rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10px] text-mint ring-1 ring-mint/20">
          live
        </span>
      </div>

      <div className="relative min-h-[300px] flex-1 px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          {assembling ? (
            <AssemblingRow />
          ) : (
            <motion.div
              key={focus.symbol}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }}
              variants={{ show: { transition: { staggerChildren: 0.055 } } }}
              className="space-y-2.5"
            >
              {focus.groups.map((g) => (
                <motion.div
                  key={g.label}
                  variants={{
                    hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease } },
                  }}
                >
                  <p className="mb-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg-5">{g.label}</p>
                  {g.items.map((it) => (
                    <div key={it.name} className="flex items-center justify-between gap-3 py-[1px] text-[11.5px]">
                      <span className={cn("truncate font-mono", g.label === "Target" ? "text-mint" : "text-fg-2")}>{it.name}</span>
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-fg-5">{it.tokens}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-line p-4">
        <div className="flex justify-between font-mono text-[10.5px] text-fg-4">
          <span>
            <span className="text-fg-2">{assembling ? "—" : `${(total / 1000).toFixed(1)}k`}</span> tokens
          </span>
          <span>of 2.4M in repo</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-mint-3 to-mint-2"
            initial={{ width: "0%" }}
            animate={{ width: assembling ? "4%" : `${Math.min(100, (total / BUDGET) * 100)}%` }}
            transition={{ duration: 0.9, ease }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-line bg-white/[0.02] px-3 py-2 text-[12px] text-fg-2">
          <span className="flex items-center gap-2">
            Send to
            <BrandLogo brand="Claude Code" className="size-3.5" />
            <span className="text-fg">Claude Code</span>
          </span>
          <Send className="size-3.5 text-mint" />
        </div>
      </div>
    </aside>
  );
}

function MobileContext({ focus, assembling, total }: { focus: Focus; assembling: boolean; total: number }) {
  return (
    <div className="border-t border-line p-3 md:hidden">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">
        <span>Focused context</span>
        <span className="normal-case tracking-normal text-fg-4">{assembling ? "assembling…" : `${(total / 1000).toFixed(1)}k tokens`}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={focus.symbol + String(assembling)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex flex-wrap gap-1.5"
        >
          {(assembling ? [] : focus.groups.slice(1, 6).map((g) => ({ label: g.label, item: g.items[0] }))).map(({ label, item }) => (
            <span key={label} className="max-w-full truncate rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[10.5px] text-fg-3">
              <span className="text-fg-5">{label.toLowerCase()} </span>
              {item.name}
            </span>
          ))}
          {assembling && <TextShimmer className="font-mono text-[11px]">Assembling context…</TextShimmer>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
