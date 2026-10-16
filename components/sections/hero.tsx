"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { DotHighlight } from "@/components/ui/dot-highlight";
import { HeroPill } from "@/components/ui/hero-pill";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Spotlight } from "@/components/ui/spotlight";
import { TiltOnScroll } from "@/components/ui/tilt-on-scroll";
import { earlyAccessHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ContextGraphApp } from "./context-graph-app";
import { useReducedMotionSafe } from "@/lib/hooks";

const ease = [0.25, 1, 0.5, 1] as const;

function Word({ children, delay, accent }: { children: ReactNode; delay: number; accent?: boolean }) {
  return (
    <motion.span
      className={cn(
        "inline-block pr-[0.22em] last:pr-0",
        accent ? "text-mint pr-[0.06em] font-serif text-[1.08em] font-normal italic leading-none tracking-[-0.01em]" : "text-gradient",
      )}
      initial={{ opacity: 0, y: "0.32em", filter: "blur(12px)" }}
      animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
      transition={{ duration: 0.95, delay, ease }}
    >
      {children}
    </motion.span>
  );
}

/** Echo of the Andro mark: a tilted orbit with a satellite travelling around the headline. */
function Orbit() {
  const reduce = useReducedMotionSafe();
  const path = "M 30 310 a 520 150 0 1 0 1040 0 a 520 150 0 1 0 -1040 0";
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[70px] -z-10 h-[620px] w-[1100px] -translate-x-1/2 [mask-image:radial-gradient(ellipse_40%_24%_at_50%_80%,transparent_62%,#000_100%)] md:top-[60px]">
      <svg viewBox="0 0 1100 620" className="h-full w-full">
        <defs>
          <linearGradient id="orbit-edge" x1="0" x2="1">
            <stop offset="0" stopColor="#3dd68c" stopOpacity="0.45" />
            <stop offset="0.3" stopColor="#3dd68c" stopOpacity="0.08" />
            <stop offset="0.7" stopColor="#3dd68c" stopOpacity="0.08" />
            <stop offset="1" stopColor="#3dd68c" stopOpacity="0.45" />
          </linearGradient>
          <radialGradient id="orbit-sat">
            <stop offset="0" stopColor="#c3f9de" />
            <stop offset="0.35" stopColor="#3dd68c" stopOpacity="0.8" />
            <stop offset="1" stopColor="#3dd68c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform="rotate(-11 550 310)">
          <ellipse cx="550" cy="310" rx="520" ry="150" fill="none" stroke="url(#orbit-edge)" strokeWidth="1" />
          <ellipse cx="550" cy="310" rx="430" ry="118" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeDasharray="2 7" />
          {!reduce && (
            <g>
              <circle r="14" fill="url(#orbit-sat)">
                <animateMotion dur="22s" repeatCount="indefinite" path={path} />
              </circle>
              <circle r="3" fill="#e9fff4">
                <animateMotion dur="22s" repeatCount="indefinite" path={path} />
              </circle>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pb-8 pt-32 md:pt-40">
      <DotHighlight className="[mask-image:radial-gradient(ellipse_75%_60%_at_50%_28%,#000_15%,transparent_75%)]" />
      <Spotlight />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[780px] bg-[radial-gradient(55%_45%_at_50%_0%,rgb(61_214_140/0.15),transparent_72%)]" />
      <Orbit />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <HeroPill
          href="#how-it-works"
          announcement="Early access"
          label={
            <>
              <span className="sm:hidden">Context engine for AI agents</span>
              <span className="hidden sm:inline">The context engine for AI coding agents</span>
            </>
          }
        />

        <h1 className="mt-8 text-balance text-[clamp(2.6rem,6.5vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.045em]">
          <span className="block">
            {["Agents", "read", "files."].map((w, i) => (
              <Word key={w} delay={0.18 + i * 0.07}>
                {w}
              </Word>
            ))}
          </span>
          <span className="block">
            {["Andro", "gives", "them", "the"].map((w, i) => (
              <Word key={w} delay={0.42 + i * 0.07}>
                {w}
              </Word>
            ))}
            <Word delay={0.75} accent>
              system.
            </Word>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.85, ease }}
          className="mt-7 max-w-2xl text-pretty text-[17px] leading-relaxed text-fg-3 md:text-[19px]"
        >
          Andro indexes your repository into a living graph of files, symbols, dependencies and architecture — then hands
          Claude, Codex, Gemini or any agent exactly the context each task needs.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 1.0, ease }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ShimmerButton href={earlyAccessHref()}>
            Get early access
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </ShimmerButton>
          <ButtonLink href="#how-it-works" variant="ghost" size="lg">
            See how it works
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div
        id="product"
        initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.3, delay: 1.1, ease }}
        className="relative z-10 mx-auto mt-16 max-w-[1220px] scroll-mt-28 px-3 md:mt-20 md:px-6"
      >
        <div aria-hidden className="absolute inset-x-[12%] -top-6 h-48 rounded-full bg-mint/[0.14] blur-[100px]" />
        <TiltOnScroll>
          <MockupFrame>
            <Mockup>
              <ContextGraphApp />
            </Mockup>
          </MockupFrame>
        </TiltOnScroll>
      </motion.div>
    </section>
  );
}
