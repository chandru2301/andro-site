"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const tags = {
  div: motion.div,
  p: motion.p,
  span: motion.span,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  section: motion.section,
} as const;

type RevealProps = {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  amount?: number;
  id?: string;
};

/**
 * Blur-fade-up entrance, the motion signature of the 21st.dev Magic hero
 * (`opacity 0 → 1`, `y 20 → 0`, `blur 8px → 0`, ease [0.25, 1, 0.5, 1]).
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 18,
  blur = 8,
  amount = 0.35,
  id,
}: RevealProps) {
  const Tag = tags[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </Tag>
  );
}
