"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroPillProps = {
  href: string;
  label: ReactNode;
  announcement?: ReactNode;
  className?: string;
};

/**
 * Announcement pill — a blend of the Codehagen and Origin UI `HeroPill`
 * components from 21st.dev: tag + label + nudging arrow.
 */
export function HeroPill({ href, label, announcement = "New", className }: HeroPillProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-white/[0.03] py-1 pl-1 pr-3.5",
        "text-[13px] text-fg-2 backdrop-blur-md transition-colors hover:border-line-3 hover:bg-white/[0.05]",
        className,
      )}
    >
      <span className="whitespace-nowrap rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mint ring-1 ring-mint/25">
        {announcement}
      </span>
      <span className="whitespace-nowrap">{label}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-fg-3 transition-transform duration-300 group-hover:translate-x-0.5">
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="currentColor"
        />
      </svg>
    </motion.a>
  );
}
