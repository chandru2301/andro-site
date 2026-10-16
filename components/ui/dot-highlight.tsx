"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity `HeroHighlight` background (21st.dev): a quiet dot grid, with a
 * mint-dot spotlight that follows the pointer across the parent section.
 */
export function DotHighlight({ className, radius = 220 }: { className?: string; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    const onLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [mouseX, mouseY]);

  const dots = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: "22px 22px",
  });

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute inset-0" style={dots("rgb(255 255 255 / 0.07)")} />
      <motion.div
        className="absolute inset-0"
        style={{ ...dots("rgb(61 214 140 / 0.85)"), WebkitMaskImage: mask, maskImage: mask }}
      />
    </div>
  );
}
