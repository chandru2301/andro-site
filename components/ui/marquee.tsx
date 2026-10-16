import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  duration?: string;
  reverse?: boolean;
  className?: string;
};

/** Magic UI `Marquee` (21st.dev): two copies of the track slide by half their width. */
export function Marquee({ children, duration = "45s", reverse = false, className }: MarqueeProps) {
  return (
    <div className={cn("group mask-fade-x flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        <div className="flex shrink-0 items-center gap-12 pr-12">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-12 pr-12">
          {children}
        </div>
      </div>
    </div>
  );
}
