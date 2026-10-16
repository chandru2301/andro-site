import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/** Serif-italic mint accent used for the one word a headline leans on. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-mint pr-[0.08em] font-serif font-normal italic tracking-[-0.01em]", className)}>
      {children}
    </span>
  );
}

export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-4", className)}>
      {index && <span className="text-mint">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-line-3" />}
      <span>{children}</span>
    </div>
  );
}

type SectionHeadingProps = {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({ index, eyebrow, title, lead, align = "center", className }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-5", centered ? "items-center text-center" : "items-start text-left", className)}>
      <Reveal>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal
        as="h2"
        delay={0.08}
        className={cn(
          "text-gradient max-w-4xl text-balance text-[clamp(2.2rem,5.2vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.038em]",
          centered && "mx-auto",
        )}
      >
        {title}
      </Reveal>
      {lead && (
        <Reveal
          as="p"
          delay={0.16}
          className={cn("max-w-2xl text-pretty text-[17px] leading-relaxed text-fg-3 md:text-lg", centered && "mx-auto")}
        >
          {lead}
        </Reveal>
      )}
    </div>
  );
}
