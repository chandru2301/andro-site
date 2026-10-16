"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type TextShimmerProps = {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
};

/** 21st.dev `TextShimmer`: a light band sweeps across muted text. */
export function TextShimmer({ children, className, duration = 1.8, spread = 2 }: TextShimmerProps) {
  const dynamicSpread = children.length * spread;
  return (
    <motion.span
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--base-color:#62666d] [--base-gradient-color:#d7ffe9]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
        } as CSSProperties
      }
    >
      {children}
    </motion.span>
  );
}
