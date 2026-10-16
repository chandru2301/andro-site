"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Adapted from Aceternity's `ContainerScroll` (21st.dev registry): the card
 * starts tipped back in 3D and settles flat as it scrolls into view — without
 * the original's fixed 80rem scroll track, so it can sit inside any section.
 */
export function TiltOnScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.18"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div ref={ref} className={cn("relative [perspective:1400px]", className)}>
      <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 0%" }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
