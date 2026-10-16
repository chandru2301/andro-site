"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useScrollRange } from "@/lib/hooks";

type Chunk = {
  file: string;
  role: string;
  score: string;
  name: string;
  edge?: string;
  code: ReactNode;
  scatter: { x: string; y: string; r: number };
  final: string;
};

const k = (s: string) => <span className="text-violet">{s}</span>;
const t = (s: string) => <span className="text-sky">{s}</span>;
const a = (s: string) => <span className="text-amber">{s}</span>;
const str = (s: string) => <span className="text-mint-2">{s}</span>;

const chunks: Chunk[] = [
  {
    file: "OrderController.java",
    role: "controller",
    score: "match 0.82",
    name: "OrderController",
    edge: "calls",
    code: (
      <>
        {a("@PostMapping")}({str('"/orders"')}){"\n"}
        {t("Order")} create({t("OrderRequest")} r) {"{"}
        {"\n"}  {k("return")} orders.createOrder(r);{"\n"}
        {"}"}
      </>
    ),
    scatter: { x: "-122%", y: "-82%", r: -8 },
    final: "-175%",
  },
  {
    file: "OrderService.java",
    role: "service",
    score: "match 0.79",
    name: "OrderService",
    edge: "calls",
    code: (
      <>
        {a("@Transactional")}
        {"\n"}
        {t("Order")} createOrder({t("OrderRequest")} r) {"{"}
        {"\n"}  {k("var")} order = {t("Order")}.from(r);{"\n"}  {k("return")} repository.save(order);{"\n"}
        {"}"}
      </>
    ),
    scatter: { x: "118%", y: "-96%", r: 6 },
    final: "-58.33%",
  },
  {
    file: "OrderRepository.java",
    role: "repository",
    score: "match 0.64",
    name: "OrderRepository",
    edge: "writes",
    code: (
      <>
        {k("interface")} {t("OrderRepository")} {k("extends")}
        {"\n"}    {t("JpaRepository")}&lt;{t("Order")}, {t("Long")}&gt; {"{"}
        {"\n"}  {t("List")}&lt;{t("Order")}&gt; findByUser({t("Long")} id);{"\n"}
        {"}"}
      </>
    ),
    scatter: { x: "-152%", y: "58%", r: 5 },
    final: "58.33%",
  },
  {
    file: "application.yml",
    role: "database",
    score: "match 0.41",
    name: "MySQL",
    code: (
      <>
        spring.datasource:{"\n"}  url: {str("jdbc:mysql://db:3306/shop")}
        {"\n"}  driver: {str("com.mysql.cj.jdbc.Driver")}
        {"\n"}spring.jpa.hibernate: {str("validate")}
      </>
    ),
    scatter: { x: "130%", y: "54%", r: -7 },
    final: "175%",
  },
];

function ChunkCard({ chunk, i, progress }: { chunk: Chunk; i: number; progress: MotionValue<number> }) {
  const start = 0.14 + i * 0.035;
  const end = 0.58 + i * 0.035;
  const x = useTransform(progress, [start, end], [chunk.scatter.x, chunk.final]);
  const y = useTransform(progress, [start, end], [chunk.scatter.y, "0%"]);
  const rotate = useTransform(progress, [start, end], [chunk.scatter.r, 0]);
  const scale = useTransform(progress, [start, end], [0.93, 1]);
  const lit = 0.68 + i * 0.045;
  const borderMix = useScrollRange(progress, [lit, lit + 0.05], [0, 1]);
  const borderColor = useTransform(borderMix, (m) => `rgba(${255 - 194 * m}, ${255 - 41 * m}, ${255 - 115 * m}, ${0.08 + 0.3 * m})`);
  const glow = useScrollRange(progress, [lit, lit + 0.05], [0, 1]);
  const scoreOpacity = useScrollRange(progress, [0.5, 0.6], [1, 0]);
  const roleOpacity = useScrollRange(progress, [0.6, 0.7], [0, 1]);
  const connector = useScrollRange(progress, [0.66 + i * 0.05, 0.74 + i * 0.05], [0, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, borderColor }}
      className="absolute left-1/2 top-1/2 w-[clamp(200px,20vw,256px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-ink-2/90 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur"
    >
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="pointer-events-none absolute -inset-px rounded-2xl shadow-[0_0_40px_-8px_rgb(61_214_140/0.45)]"
      />
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
        <span className="truncate font-mono text-[11px] text-fg-3">{chunk.file}</span>
        <span className="relative ml-2 shrink-0 font-mono text-[10px]">
          <motion.span style={{ opacity: scoreOpacity }} className="text-fg-5">
            {chunk.score}
          </motion.span>
          <motion.span style={{ opacity: roleOpacity }} className="absolute right-0 top-0 text-mint">
            {chunk.role}
          </motion.span>
        </span>
      </div>
      <pre className="overflow-hidden whitespace-pre px-3 py-3 font-mono text-[clamp(8.5px,0.7vw,10px)] leading-[1.7] text-fg-3">{chunk.code}</pre>

      {chunk.edge && (
        <motion.div
          style={{ scaleX: connector, opacity: connector }}
          className="absolute left-full top-1/2 flex h-px w-[16.67%] origin-left items-center bg-gradient-to-r from-mint/70 to-mint"
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.06em] text-mint">
            {chunk.edge}
          </span>
          <span className="absolute -right-0.5 size-1.5 rotate-45 border-r border-t border-mint" />
        </motion.div>
      )}
    </motion.div>
  );
}

function StickyAssembly() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const before = useScrollRange(scrollYProgress, [0.5, 0.62], [1, 0]);
  const after = useScrollRange(scrollYProgress, [0.58, 0.7], [0, 1]);
  const beforeY = useScrollRange(scrollYProgress, [0.5, 0.62], [0, -12]);
  const afterY = useScrollRange(scrollYProgress, [0.58, 0.7], [12, 0]);
  const pathOpacity = useScrollRange(scrollYProgress, [0.78, 0.9], [0, 1]);

  return (
    <div ref={ref} data-sticky="chunks" className="relative hidden h-[250vh] lg:block">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="relative h-8 w-full text-center font-mono text-[12px] uppercase tracking-[0.2em]">
          <motion.p style={{ opacity: before, y: beforeY }} className="absolute inset-x-0 text-fg-4">
            4 isolated search results
          </motion.p>
          <motion.p style={{ opacity: after, y: afterY }} className="absolute inset-x-0 text-mint">
            1 path through the system
          </motion.p>
        </div>
        <div className="relative mt-6 h-[430px] w-full max-w-6xl">
          {chunks.map((c, i) => (
            <ChunkCard key={c.file} chunk={c} i={i} progress={scrollYProgress} />
          ))}
        </div>
        <motion.p style={{ opacity: pathOpacity }} className="mt-2 font-mono text-[13px] text-fg-3">
          OrderController <span className="text-mint">→</span> OrderService <span className="text-mint">→</span> OrderRepository{" "}
          <span className="text-mint">→</span> MySQL
        </motion.p>
      </div>
    </div>
  );
}

function MobileChain() {
  return (
    <div className="mx-auto mt-12 flex max-w-sm flex-col items-center px-5 pb-8 lg:hidden">
      {chunks.map((c, i) => (
        <Reveal key={c.file} delay={i * 0.06} className="flex w-full flex-col items-center">
          <div className="w-full rounded-2xl border border-mint/25 bg-ink-2/90">
            <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
              <span className="font-mono text-[11px] text-fg-3">{c.file}</span>
              <span className="font-mono text-[10px] text-mint">{c.role}</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre px-3.5 py-3 font-mono text-[10.5px] leading-[1.65] text-fg-3">{c.code}</pre>
          </div>
          {c.edge && (
            <div className="flex flex-col items-center py-2 text-mint">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.12em]">{c.edge}</span>
              <ArrowDown className="size-3.5" />
            </div>
          )}
        </Reveal>
      ))}
    </div>
  );
}

export function ChunksToChain() {
  return (
    <section id="difference" className="relative">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 pt-10 text-center md:pt-16">
        <Reveal>
          <Eyebrow index="02">The difference</Eyebrow>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="text-gradient mt-5 text-balance text-[clamp(2.2rem,5.2vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.038em]"
        >
          Search results aren&apos;t <Accent>understanding.</Accent>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-5 max-w-2xl text-pretty text-[17px] leading-relaxed text-fg-3 md:text-lg">
          Retrieval hands an agent four snippets that happen to match. Andro hands it the path through the system — the
          thing the change actually depends on.
        </Reveal>
      </div>
      <StickyAssembly />
      <MobileChain />
    </section>
  );
}
