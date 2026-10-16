import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type WindowProps = {
  title?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** Minimal app-window chrome shared by every product demo on the page. */
export function Window({ title, right, children, className, bodyClassName }: WindowProps) {
  return (
    <div className={cn("surface relative overflow-hidden rounded-2xl bg-ink-1/80", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-line px-4">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <div className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-fg-4">{title}</div>
        <div className="flex min-w-10 justify-end">{right}</div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
