"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RotatingTextProps = {
  words: string[];
  /** Controlled index so the rotation can drive other UI (e.g. graph focus). */
  index: number;
  className?: string;
};

/**
 * Width-animated word rotator, generalised from the 21st.dev Magic hero
 * `RotatingText`: the slot eases to each word's measured width while words
 * blur in from below and out above.
 */
export function RotatingText({ words, index, className }: RotatingTextProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => setWidths(Array.from(el.children).map((c) => (c as HTMLElement).offsetWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [words]);

  const word = words[index % words.length] ?? "";

  return (
    <span className={cn("relative inline-flex align-bottom", className)}>
      <motion.span
        className="relative inline-block h-[1.35em] overflow-hidden"
        animate={{ width: widths[index % words.length] ?? "auto" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={word}
            className="absolute left-0 top-0 whitespace-nowrap"
            initial={{ opacity: 0, y: "70%", filter: "blur(5px)" }}
            animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
            exit={{ opacity: 0, y: "-70%", filter: "blur(5px)" }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 flex flex-col">
        {words.map((w) => (
          <span key={w} className="w-max whitespace-nowrap">
            {w}
          </span>
        ))}
      </span>
      <span className="sr-only">{word}</span>
    </span>
  );
}
