"use client";

import { motion } from "motion/react";
import { Check, ChevronDown, FileCode2, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/hooks";

const ease = [0.25, 1, 0.5, 1] as const;

function useTicker(count: number, ms: number) {
  const reduce = useReducedMotionSafe();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => clearInterval(t);
  }, [count, ms, reduce]);
  return i;
}

/* 01 — File level ------------------------------------------------------- */

const tree = [
  { depth: 0, name: "src", dir: true },
  { depth: 1, name: "controllers", dir: true },
  { depth: 2, name: "UserController.java", lang: "java" },
  { depth: 2, name: "OrderController.java", lang: "java" },
  { depth: 1, name: "services", dir: true },
  { depth: 2, name: "UserService.java", lang: "java", changed: true },
  { depth: 2, name: "OrderService.java", lang: "java" },
  { depth: 1, name: "repositories", dir: true },
  { depth: 2, name: "UserRepository.java", lang: "java" },
  { depth: 1, name: "models", dir: true },
  { depth: 2, name: "User.java", lang: "java" },
  { depth: 1, name: "config", dir: true },
  { depth: 2, name: "application.yml", lang: "yaml", changed: true },
];

export function FilesVisual() {
  return (
    <div className="relative flex h-full flex-col p-5 md:p-6">
      <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">
        <span>Explorer · shop-platform</span>
        <span className="text-mint/80">indexing</span>
      </div>
      <div className="relative mt-4 flex-1 overflow-hidden rounded-xl border border-line bg-ink/60 py-2">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-transparent via-mint/[0.09] to-transparent" />
        {tree.map((row, i) => (
          <motion.div
            key={row.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.045, ease }}
            className="flex items-center gap-2 px-3 py-[3px] font-mono text-[11.5px]"
            style={{ paddingLeft: 12 + row.depth * 16 }}
          >
            {row.dir ? (
              <>
                <ChevronDown className="size-3 text-fg-5" />
                <Folder className="size-3.5 text-fg-4" />
                <span className="text-fg-3">{row.name}</span>
              </>
            ) : (
              <>
                <FileCode2 className="ml-5 size-3.5 text-fg-5" />
                <span className="truncate text-fg-2">{row.name}</span>
                {row.changed && <span className="size-1.5 shrink-0 rounded-full bg-amber" title="changed" />}
                <span className="ml-auto rounded border border-line px-1 text-[9.5px] text-fg-5">{row.lang}</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                >
                  <Check className="size-3 text-mint" />
                </motion.span>
              </>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] text-fg-4">
        <span>
          <span className="text-fg-2">2,418</span> files
        </span>
        <span>java · ts · yaml · sql</span>
        <span>
          <span className="text-amber">12</span> changed since last index
        </span>
      </div>
    </div>
  );
}

/* 02 — Symbol level ------------------------------------------------------ */

const symbols = [
  { name: "createUser", args: "dto", ret: "User", line: 12, at: 1 },
  { name: "updateUser", args: "id, dto", ret: "User", line: 38, at: 4 },
  { name: "deleteUser", args: "id", ret: "void", line: 61, at: 7 },
  { name: "findUser", args: "id", ret: "User?", line: 74, at: 9 },
];
const codeBars = [42, 70, 56, 30, 74, 52, 38, 66, 44, 72, 48, 26];

export function SymbolsVisual() {
  const active = useTicker(symbols.length, 1300);
  return (
    <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 p-5 md:p-6">
      <div className="flex min-w-0 flex-col rounded-xl border border-line bg-ink/60">
        <div className="border-b border-line px-3 py-2 font-mono text-[11px] text-fg-3">UserService.java</div>
        <div className="flex-1 space-y-[7px] px-3 py-3">
          {codeBars.map((w, i) => {
            const sym = symbols.findIndex((s) => s.at === i);
            const on = sym === active;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-4 text-right font-mono text-[8.5px] text-fg-5">{i * 6 + 12}</span>
                <motion.span
                  className="h-[5px] rounded-full"
                  style={{ width: `${w}%` }}
                  animate={{
                    backgroundColor: on ? "rgba(61,214,140,0.85)" : sym >= 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                  }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-2.5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">4 symbols · class UserService</p>
        {symbols.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.09, duration: 0.5, ease }}
            className={cn(
              "rounded-xl border px-3 py-2.5 transition-colors duration-300",
              i === active ? "border-mint/35 bg-mint/[0.07]" : "border-line bg-white/[0.02]",
            )}
          >
            <div className="flex items-center justify-between gap-2 font-mono text-[11.5px]">
              <span className="truncate">
                <span className="text-violet">ƒ</span> <span className={i === active ? "text-fg" : "text-fg-2"}>{s.name}</span>
                <span className="text-fg-4">({s.args})</span>
              </span>
              <span className="shrink-0 text-[10px] text-fg-5">L{s.line}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-fg-4">
              returns <span className="text-sky">{s.ret}</span> · public
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 03 — Relationship level ------------------------------------------------ */

const chain = [
  { name: "UserController", kind: "controller" },
  { name: "UserService", kind: "service" },
  { name: "UserRepository", kind: "repository" },
  { name: "User", kind: "model" },
];
const chainEdges = ["calls", "calls", "accesses"];

export function RelationsVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-5 md:p-6">
      {chain.map((n, i) => (
        <div key={n.name} className="flex w-full max-w-[300px] flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.2, duration: 0.45, ease }}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-4 py-3",
              i === 0 ? "border-mint/35 bg-mint/[0.07]" : "border-line-2 bg-white/[0.025]",
            )}
          >
            <span className="font-mono text-[13px] text-fg">{n.name}</span>
            <span className="font-mono text-[10px] text-fg-4">{n.kind}</span>
          </motion.div>
          {i < chainEdges.length && (
            <div className="relative flex h-12 w-full items-center justify-center">
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.2 + 0.14, duration: 0.3, ease }}
                className="absolute inset-y-1 w-px origin-top bg-gradient-to-b from-mint/70 to-mint/20"
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 + 0.26 }}
                className="relative ml-24 rounded-md border border-mint/20 bg-ink-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mint"
              >
                {chainEdges[i]}
              </motion.span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* 04 — Dependency level -------------------------------------------------- */

const stack = [
  { name: "API", detail: "REST · /users, /orders" },
  { name: "Spring", detail: "web · security · validation" },
  { name: "Service", detail: "UserService · OrderService" },
  { name: "JPA", detail: "Hibernate · repositories" },
  { name: "MySQL", detail: "users · orders · payments" },
];

export function DependencyVisual() {
  const reduce = useReducedMotionSafe();
  return (
    <div className="relative flex h-full flex-col justify-center gap-2.5 p-5 md:p-8">
      <span aria-hidden className="absolute bottom-12 left-[42px] top-12 w-px bg-line-2 md:left-[50px]" />
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute left-[39px] size-[7px] rounded-full bg-mint shadow-[0_0_12px_2px_rgb(61_214_140/0.6)] md:left-[47px]"
          initial={{ top: "14%" }}
          animate={{ top: ["14%", "84%"] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
        />
      )}
      {stack.map((l, i) => (
        <motion.div
          key={l.name}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease }}
          className="relative flex items-center gap-4"
        >
          <span className="relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border border-line-2 bg-ink-2 font-mono text-[10px] text-fg-4">
            {i + 1}
          </span>
          <div
            className="flex flex-1 items-center justify-between rounded-xl border border-line bg-white/[0.025] px-4 py-3"
            style={{ marginRight: `${i * 4}%` }}
          >
            <span className="text-[15px] font-medium tracking-[-0.01em] text-fg">{l.name}</span>
            <span className="truncate pl-3 font-mono text-[10.5px] text-fg-4">{l.detail}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* 05 — Repository level -------------------------------------------------- */

export function SystemVisual() {
  const box = "fill-[#0e0f12] stroke-[rgba(255,255,255,0.14)]";
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { delay, duration: 0.6, ease },
  });
  const pop = (delay: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.45, ease },
  });
  return (
    <div className="flex h-full items-center justify-center p-4 md:p-6">
      <svg viewBox="0 0 420 360" className="h-full max-h-[380px] w-full" aria-hidden>
        <motion.g {...pop(0)}>
          <rect x="135" y="14" width="150" height="46" rx="12" className={box} />
          <text x="210" y="42" textAnchor="middle" className="fill-fg text-[13px] font-medium">Frontend</text>
        </motion.g>
        <motion.path d="M 210 60 L 210 104" stroke="#3dd68c" strokeOpacity="0.6" {...draw(0.15)} />
        <motion.text x="222" y="86" className="fill-mint font-mono text-[9.5px] tracking-[0.12em]" {...pop(0.2)}>
          REST
        </motion.text>
        <motion.g {...pop(0.25)}>
          <rect x="135" y="104" width="150" height="46" rx="12" className={box} />
          <text x="210" y="132" textAnchor="middle" className="fill-fg text-[13px] font-medium">Controllers</text>
        </motion.g>
        <motion.path d="M 210 150 L 210 194" stroke="#3dd68c" strokeOpacity="0.6" {...draw(0.38)} />
        <motion.g {...pop(0.48)}>
          <rect x="135" y="194" width="150" height="46" rx="12" className="fill-[#0f2a1d] stroke-[rgba(61,214,140,0.45)]" />
          <text x="210" y="222" textAnchor="middle" className="fill-fg text-[13px] font-medium">Services</text>
        </motion.g>
        <motion.path d="M 180 240 C 180 272, 110 268, 110 296" fill="none" stroke="#3dd68c" strokeOpacity="0.6" {...draw(0.6)} />
        <motion.path d="M 240 240 C 240 272, 310 268, 310 296" fill="none" stroke="#3dd68c" strokeOpacity="0.6" {...draw(0.6)} />
        <motion.g {...pop(0.72)}>
          <rect x="40" y="296" width="140" height="46" rx="12" className={box} />
          <text x="110" y="324" textAnchor="middle" className="fill-fg text-[13px] font-medium">Database</text>
        </motion.g>
        <motion.g {...pop(0.8)}>
          <rect x="240" y="296" width="140" height="46" rx="12" className={box} />
          <text x="310" y="324" textAnchor="middle" className="fill-fg text-[13px] font-medium">Queue</text>
        </motion.g>
        <motion.text x="18" y="236" className="fill-fg-5 font-mono text-[9px] tracking-[0.1em]" {...pop(0.9)}>
          READS / WRITES
        </motion.text>
        <motion.text x="334" y="236" className="fill-fg-5 font-mono text-[9px] tracking-[0.1em]" {...pop(0.9)}>
          PUBLISHES
        </motion.text>
      </svg>
    </div>
  );
}
