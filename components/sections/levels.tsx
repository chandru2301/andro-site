"use client";

import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ComponentType, type ReactNode } from "react";
import { useLenis } from "@/components/providers/providers";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import { DependencyVisual, FilesVisual, RelationsVisual, SymbolsVisual, SystemVisual } from "./levels-visuals";

type Level = { key: string; title: string; body: string; Visual: ComponentType };

const levels: Level[] = [
  {
    key: "File",
    title: "Files",
    body: "Every file, language and module — plus what changed since the last index, so understanding stays current.",
    Visual: FilesVisual,
  },
  {
    key: "Symbol",
    title: "Symbols",
    body: "Instead of treating UserService.java as one giant document, Andro reasons about createUser(), findUser() and every symbol inside.",
    Visual: SymbolsVisual,
  },
  {
    key: "Relationship",
    title: "Relationships",
    body: "Who calls what, and what touches which model. UserController → UserService → UserRepository → User.",
    Visual: RelationsVisual,
  },
  {
    key: "Dependency",
    title: "Dependencies",
    body: "The stack a request actually travels through — API, framework, service layer, ORM, database.",
    Visual: DependencyVisual,
  },
  {
    key: "Repository",
    title: "The whole system",
    body: "Frontend, controllers, services, databases and queues — the repository as one connected model, not search results.",
    Visual: SystemVisual,
  },
];

function StepProgress({ progress, i }: { progress: MotionValue<number>; i: number }) {
  const n = levels.length;
  const scaleX = useTransform(progress, [i / n, (i + 1) / n], [0, 1]);
  return (
    <span className="mt-4 block h-px w-full overflow-hidden bg-line">
      <motion.span style={{ scaleX }} className="block h-full origin-left bg-gradient-to-r from-mint-3 to-mint" />
    </span>
  );
}

function StickyLevels() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(levels.length - 1, Math.max(0, Math.floor(v * levels.length))));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const target = top + ((i + 0.5) / levels.length) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(target);
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const ActiveVisual = levels[active].Visual;

  return (
    <div ref={ref} data-sticky="levels" className="relative hidden h-[420vh] lg:block">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-14 px-5">
          <div>
            <Eyebrow index="03">What Andro understands</Eyebrow>
            <h2 className="text-gradient mt-5 text-balance text-[clamp(2.2rem,4.2vw,3.6rem)] font-medium leading-[1.03] tracking-[-0.038em]">
              Five levels of <Accent>understanding.</Accent>
            </h2>
            <ol className="mt-10 space-y-1">
              {levels.map((l, i) => (
                <li key={l.key}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className={cn(
                      "w-full rounded-2xl px-4 py-3.5 text-left transition-colors duration-500",
                      i === active ? "bg-white/[0.03]" : "hover:bg-white/[0.015]",
                    )}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className={cn("font-mono text-[11px] transition-colors", i === active ? "text-mint" : "text-fg-5")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("text-[17px] font-medium tracking-[-0.015em] transition-colors duration-500", i === active ? "text-fg" : "text-fg-4")}>
                        {l.title}
                      </span>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: i === active ? "auto" : 0, opacity: i === active ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden pl-[34px]"
                    >
                      <p className="pt-2 text-[14.5px] leading-relaxed text-fg-3">{l.body}</p>
                      <StepProgress progress={scrollYProgress} i={i} />
                    </motion.div>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="surface relative aspect-[5/4.2] w-full overflow-hidden rounded-3xl bg-ink-1/70">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_80%)]" />
            <div className="absolute left-5 top-4 z-10 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-5">
              {levels[active].key} level
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={levels[active].key}
                initial={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 pt-8"
              >
                <ActiveVisual />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mounts children once they scroll into view, so their entrance plays on screen. */
function MountInView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  return (
    <div ref={ref} className={className}>
      {seen && children}
    </div>
  );
}

function StackedLevels() {
  return (
    <div className="px-5 lg:hidden">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <Eyebrow index="03">What Andro understands</Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.08} className="text-gradient mt-5 text-balance text-[clamp(2.2rem,8vw,3.2rem)] font-medium leading-[1.03] tracking-[-0.038em]">
          Five levels of <Accent>understanding.</Accent>
        </Reveal>
      </div>
      <div className="mx-auto mt-12 max-w-xl space-y-5">
        {levels.map(({ key, title, body, Visual }, i) => (
          <Reveal key={key} className="surface overflow-hidden rounded-3xl bg-ink-1/70">
            <div className="p-5 pb-0">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-mint">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px] font-medium text-fg">{title}</span>
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-3">{body}</p>
            </div>
            <MountInView className="relative h-[330px]">
              <Visual />
            </MountInView>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Levels() {
  return (
    <section id="levels" className="relative py-20 lg:py-0">
      <StickyLevels />
      <StackedLevels />
    </section>
  );
}
