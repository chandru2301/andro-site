"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useStepper, useReducedMotionSafe } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/* Isometric geometry (viewBox 0 0 720 640). */
const CX = 380;
const BASE_Y = 500;
const HW = 196; // half width of the rhombus
const HH = 113; // half height (HW · tan 30°)
const T = 12; // plate thickness
const S = 100; // local plate units
const PLANE = `matrix(${HW / S} ${HH / S} ${-HW / S} ${HH / S} ${CX} ${BASE_Y - HH})`;

const layers = [
  {
    n: "01",
    name: "Repository Indexer",
    short: "INDEXER",
    body: "Files, languages, metadata and changes — kept in sync with the repository.",
  },
  {
    n: "02",
    name: "Symbol & Dependency Analysis",
    short: "ANALYSIS",
    body: "Classes, functions, variables, imports and references — parsed, not guessed.",
  },
  {
    n: "03",
    name: "Code Knowledge Graph",
    short: "GRAPH",
    body: "Nodes and typed edges: how every file, symbol and module relates.",
  },
  {
    n: "04",
    name: "Context & Retrieval Engine",
    short: "RETRIEVAL",
    body: "Keyword + semantic + symbol + graph + recency + task relevance, fused into one ranking.",
  },
  {
    n: "05",
    name: "Agent Context API",
    short: "AGENT API",
    body: "Operations agents call directly: search_context(), find_symbol(), find_dependents(), trace_dependency()…",
  },
];

const lit = new Set([3, 9, 12, 20, 26, 31, 38, 45, 52, 58]);

function PlateContent({ i, on }: { i: number; on: boolean }) {
  const mint = on ? "#3dd68c" : "rgba(255,255,255,0.28)";
  const faint = on ? "rgba(61,214,140,0.35)" : "rgba(255,255,255,0.1)";
  switch (i) {
    case 0:
      return (
        <g>
          {Array.from({ length: 64 }).map((_, k) => (
            <rect
              key={k}
              x={14 + (k % 8) * 9.2}
              y={14 + Math.floor(k / 8) * 9.2}
              width={6.2}
              height={6.2}
              rx={1}
              fill={lit.has(k) ? mint : faint}
              opacity={lit.has(k) ? 0.95 : 0.6}
            />
          ))}
        </g>
      );
    case 1:
      return (
        <g>
          {[62, 40, 70, 34, 56, 46, 66].map((w, k) => (
            <g key={k}>
              <text x={16} y={22 + k * 10} className="font-mono" fontSize={6} fill={k % 3 === 0 ? mint : faint}>
                ƒ
              </text>
              <rect x={24} y={17.5 + k * 10} width={w} height={3.2} rx={1.6} fill={k % 3 === 0 ? mint : faint} />
            </g>
          ))}
        </g>
      );
    case 2: {
      const pts = [
        [24, 26],
        [58, 18],
        [80, 40],
        [46, 50],
        [22, 70],
        [62, 78],
        [84, 72],
      ];
      const links = [
        [0, 1],
        [1, 2],
        [0, 3],
        [1, 3],
        [3, 4],
        [3, 5],
        [5, 6],
        [2, 6],
      ];
      return (
        <g>
          {links.map(([a, b], k) => (
            <line key={k} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={faint} strokeWidth={0.9} />
          ))}
          {pts.map(([x, y], k) => (
            <circle key={k} cx={x} cy={y} r={k === 3 ? 3.6 : 2.4} fill={k === 3 ? mint : faint} />
          ))}
        </g>
      );
    }
    case 3:
      return (
        <g>
          {[34, 24, 14].map((r, k) => (
            <circle key={r} cx={50} cy={50} r={r} fill="none" stroke={k === 2 ? mint : faint} strokeWidth={0.9} />
          ))}
          <circle cx={50} cy={50} r={3.4} fill={mint} />
        </g>
      );
    default:
      return (
        <g>
          {Array.from({ length: 7 }).map((_, k) => (
            <rect key={k} x={12 + k * 11} y={64} width={8} height={18} rx={2} fill={k === 3 ? mint : faint} opacity={0.9} />
          ))}
          <rect x={12} y={20} width={76} height={30} rx={4} fill="none" stroke={faint} strokeWidth={0.9} />
          <rect x={18} y={28} width={40} height={3.4} rx={1.7} fill={mint} />
          <rect x={18} y={36} width={56} height={3.4} rx={1.7} fill={faint} />
        </g>
      );
  }
}

function Plate({ i, gap, on }: { i: number; gap: MotionValue<number>; on: boolean }) {
  const y = useTransform(gap, (g) => -i * g);
  const top = `${CX},${BASE_Y - HH} ${CX + HW},${BASE_Y} ${CX},${BASE_Y + HH} ${CX - HW},${BASE_Y}`;
  const left = `${CX - HW},${BASE_Y} ${CX},${BASE_Y + HH} ${CX},${BASE_Y + HH + T} ${CX - HW},${BASE_Y + T}`;
  const right = `${CX},${BASE_Y + HH} ${CX + HW},${BASE_Y} ${CX + HW},${BASE_Y + T} ${CX},${BASE_Y + HH + T}`;
  return (
    <motion.g style={{ y }}>
      <polygon points={left} fill={on ? "#0c1f16" : "#08090b"} stroke={on ? "rgba(61,214,140,0.45)" : "rgba(255,255,255,0.1)"} strokeWidth={1} className="transition-all duration-500" />
      <polygon points={right} fill={on ? "#0f271b" : "#0b0c0f"} stroke={on ? "rgba(61,214,140,0.45)" : "rgba(255,255,255,0.1)"} strokeWidth={1} className="transition-all duration-500" />
      <polygon
        points={top}
        fill={on ? "rgba(18,40,29,0.96)" : "rgba(15,16,19,0.94)"}
        stroke={on ? "rgba(61,214,140,0.8)" : "rgba(255,255,255,0.16)"}
        strokeWidth={1}
        className="transition-all duration-500"
        style={on ? { filter: "drop-shadow(0 0 18px rgba(61,214,140,0.35))" } : undefined}
      />
      <g transform={PLANE}>
        <PlateContent i={i} on={on} />
        <text x={8} y={95} fontSize={5.4} letterSpacing={1.2} className="font-mono" fill={on ? "#8af0c0" : "rgba(255,255,255,0.45)"}>
          {layers[i].n} · {layers[i].short}
        </text>
      </g>
    </motion.g>
  );
}

function FlowLines({ gap }: { gap: MotionValue<number> }) {
  const reduce = useReducedMotionSafe();
  const [top, setTop] = useState(() => BASE_Y - 4 * gap.get());
  useMotionValueEvent(gap, "change", (g) => setTop(BASE_Y - 4 * g));
  const xs = [CX - 70, CX, CX + 70];
  return (
    <g>
      {xs.map((x, k) => (
        <g key={x}>
          <line x1={x} x2={x} y1={BASE_Y} y2={top} stroke="rgba(61,214,140,0.16)" strokeWidth={1} />
          {!reduce && (
            <line
              x1={x}
              x2={x}
              y1={BASE_Y}
              y2={top}
              stroke="#8af0c0"
              strokeWidth={1.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.08 0.92"
              className="animate-beam"
              style={{ animationDuration: "2.6s", animationDelay: `${k * 0.7}s`, "--beam-travel": -1 } as CSSProperties}
            />
          )}
        </g>
      ))}
    </g>
  );
}

function ExplodedStack({ highlight }: { highlight: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const gap = useTransform(scrollYProgress, [0, 1], [26, 76]);
  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute inset-x-[15%] bottom-[8%] h-24 rounded-full bg-mint/[0.12] blur-[70px]" />
      <svg viewBox="0 0 720 640" className="relative w-full" role="img" aria-label="Andro's five layers, stacked from the repository indexer up to the agent context API">
        <FlowLines gap={gap} />
        {layers.map((_, i) => (
          <Plate key={i} i={i} gap={gap} on={i === highlight} />
        ))}
      </svg>
    </div>
  );
}

export function Stack() {
  const [hover, setHover] = useState<number | null>(null);
  const [ref, auto] = useStepper<HTMLDivElement>(layers.length, 2200, (i) => (i + 1) % layers.length);
  const highlight = hover ?? auto;

  return (
    <section className="relative px-5 py-24 md:py-36">
      <SectionHeading
        index="07"
        eyebrow="Architecture"
        title={
          <>
            Five layers, from raw files to <Accent>agent-ready context.</Accent>
          </>
        }
        lead="Each layer turns the one below it into something an agent can reason with."
      />

      <div ref={ref} className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
        <Reveal>
          <ExplodedStack highlight={highlight} />
        </Reveal>
        <ol className="space-y-2" onMouseLeave={() => setHover(null)}>
          {[...layers].reverse().map((l) => {
            const i = Number(l.n) - 1;
            const on = i === highlight;
            return (
              <Reveal as="li" key={l.n} delay={(4 - i) * 0.05}>
                <button
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className={cn(
                    "w-full rounded-2xl border px-5 py-4 text-left transition-all duration-500",
                    on ? "border-mint/30 bg-mint/[0.05]" : "border-transparent hover:border-line",
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={cn("font-mono text-[11px] transition-colors", on ? "text-mint" : "text-fg-5")}>{l.n}</span>
                    <span className={cn("text-[16.5px] font-medium tracking-[-0.015em] transition-colors duration-500", on ? "text-fg" : "text-fg-2")}>
                      {l.name}
                    </span>
                  </div>
                  <p className="mt-1.5 pl-[34px] text-[14px] leading-relaxed text-fg-4">{l.body}</p>
                </button>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

