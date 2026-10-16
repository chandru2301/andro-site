import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** 21st.dev `Mockup` + `MockupFrame`: a glassy bezel around product UI. */
export function MockupFrame({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex w-full overflow-hidden rounded-[22px] border border-white/[0.06] p-1.5 backdrop-blur-xl lg:p-2",
        "bg-gradient-to-t from-white/[0.015] to-white/[0.06]",
        className,
      )}
      {...props}
    />
  );
}

export function Mockup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] border-t-white/[0.12] bg-ink-1",
        "shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9),0_0_0_1px_rgb(0_0_0/0.6)]",
        className,
      )}
      {...props}
    />
  );
}
