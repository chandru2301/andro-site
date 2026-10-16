"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Window } from "@/components/ui/window";
import { useStepper } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ops = [
  {
    name: "search_context",
    sig: "(query, { budget })",
    desc: "Hybrid retrieval, ranked for the task at hand.",
    call: `await andro.search_context("add Razorpay payments", {\n  budget: 6000,\n})`,
    res: `{\n  "items": 12,\n  "top": [\n    "PaymentService.processPayment()",\n    "PaymentProvider (interface)",\n    "WebhookRouter.register()"\n  ],\n  "tokens": 4096\n}`,
  },
  {
    name: "find_symbol",
    sig: "(name)",
    desc: "Definitions, signatures and locations.",
    call: `await andro.find_symbol("processPayment")`,
    res: `{\n  "symbol": "PaymentService.processPayment",\n  "kind": "method",\n  "file": "src/payments/PaymentService.java",\n  "lines": [42, 89],\n  "signature": "Payment processPayment(Charge c)"\n}`,
  },
  {
    name: "find_references",
    sig: "(symbol)",
    desc: "Every usage across the repository.",
    call: `await andro.find_references("PaymentProvider")`,
    res: `{\n  "references": 7,\n  "files": [\n    "PaymentService.java:18",\n    "StripeProvider.java:9",\n    "PaymentConfig.java:31"\n  ]\n}`,
  },
  {
    name: "find_dependents",
    sig: "(symbol, { depth })",
    desc: "What could break if this changes.",
    call: `await andro.find_dependents("PaymentService", {\n  depth: 2,\n})`,
    res: `{\n  "dependents": [\n    { "name": "OrderService", "edge": "CALLS" },\n    { "name": "PaymentController", "edge": "CALLS" },\n    { "name": "RefundJob", "edge": "CALLS" }\n  ],\n  "tests": ["PaymentServiceTest", "CheckoutFlowIT"]\n}`,
  },
  {
    name: "trace_dependency",
    sig: "(from, to)",
    desc: "The path between two components.",
    call: `await andro.trace_dependency("checkout.tsx", "MySQL")`,
    res: `{\n  "path": [\n    "checkout.tsx",\n    "PaymentController",\n    "PaymentService",\n    "PaymentRepository",\n    "MySQL"\n  ],\n  "hops": 4\n}`,
  },
  {
    name: "get_related_tests",
    sig: "(symbol)",
    desc: "Tests that exercise this code.",
    call: `await andro.get_related_tests("OrderService.createOrder")`,
    res: `{\n  "tests": [\n    { "name": "OrderServiceTest", "cases": 6 },\n    { "name": "CheckoutFlowIT", "cases": 3 }\n  ]\n}`,
  },
  {
    name: "get_architecture_context",
    sig: "(module)",
    desc: "A module's place in the whole system.",
    call: `await andro.get_architecture_context("payments")`,
    res: `{\n  "module": "payments",\n  "layer": "service",\n  "upstream": ["api", "orders"],\n  "downstream": ["db", "events"],\n  "owners": ["@payments"]\n}`,
  },
];

/** Tiny highlighter for the controlled snippets above (TS call + JSON result). */
function Highlighted({ code }: { code: string }) {
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(\d+)\b|\b(await|const|true|false|null)\b|([A-Za-z_]\w*)(?=\()/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    if (m[1]) {
      out.push(
        <span key={k++} className={m[2] ? "text-fg-2" : "text-mint-2"}>
          {m[1]}
        </span>,
      );
      if (m[2]) out.push(m[2]);
    } else if (m[3]) {
      out.push(
        <span key={k++} className="text-amber">
          {m[3]}
        </span>,
      );
    } else if (m[4]) {
      out.push(
        <span key={k++} className="text-violet">
          {m[4]}
        </span>,
      );
    } else if (m[5]) {
      out.push(
        <span key={k++} className="text-sky">
          {m[5]}
        </span>,
      );
    }
    last = re.lastIndex;
  }
  if (last < code.length) out.push(code.slice(last));
  return <>{out}</>;
}

function StreamedResponse({ code }: { code: string }) {
  const lines = code.split("\n");
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= lines.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [code, lines.length]);
  return (
    <pre className="overflow-x-auto whitespace-pre font-mono text-[12px] leading-[1.75] text-fg-3">
      <Highlighted code={lines.slice(0, shown).join("\n")} />
      {shown < lines.length && <span className="ml-0.5 inline-block h-[1em] w-[6px] translate-y-[2px] animate-blink bg-mint/80" />}
    </pre>
  );
}

export function AgentApi() {
  const [ref, active, setActive] = useStepper<HTMLDivElement>(ops.length, 4200);
  const op = ops[active];

  return (
    <section id="api" className="relative scroll-mt-24 px-5 py-24 md:py-36">
      <SectionHeading
        index="08"
        eyebrow="Agent context API"
        title={
          <>
            An engineering knowledge <Accent>interface.</Accent>
          </>
        }
        lead="Instead of blindly searching the filesystem, agents ask Andro structural questions — and get back exactly the part of the system they need."
      />

      <div ref={ref} className="mx-auto mt-16 grid max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Reveal>
          <ul className="space-y-1">
            {ops.map((o, i) => (
              <li key={o.name}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "group w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                    i === active ? "border-mint/30 bg-mint/[0.05]" : "border-transparent hover:border-line hover:bg-white/[0.015]",
                  )}
                >
                  <div className="flex items-baseline gap-1 font-mono text-[13.5px]">
                    <span className={cn("transition-colors", i === active ? "text-mint" : "text-fg-2 group-hover:text-fg")}>{o.name}</span>
                    <span className="truncate text-fg-5">{o.sig}</span>
                  </div>
                  <p className={cn("mt-1 text-[13.5px] transition-colors", i === active ? "text-fg-3" : "text-fg-4")}>{o.desc}</p>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <Window
            title="agent → andro · tool call"
            right={<span className="font-mono text-[10.5px] text-mint/80">connected</span>}
            bodyClassName="divide-y divide-line"
          >
            <div className="p-5 md:p-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">Call</p>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={op.name}
                  initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="overflow-x-auto whitespace-pre font-mono text-[12.5px] leading-[1.75] text-fg-2"
                >
                  <Highlighted code={op.call} />
                </motion.pre>
              </AnimatePresence>
            </div>
            <div className="min-h-[290px] bg-ink/40 p-5 md:p-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-fg-5">
                <span>Result</span>
                <span className="normal-case tracking-normal">structured · ranked · grounded in the graph</span>
              </div>
              <StreamedResponse key={op.name} code={op.res} />
            </div>
          </Window>
        </Reveal>
      </div>
    </section>
  );
}
