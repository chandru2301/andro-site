import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShimmerButtonProps = {
  href: string;
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  borderRadius?: string;
  background?: string;
  className?: string;
};

/**
 * Magic UI `ShimmerButton` (from the 21st.dev repo) rendered as a link:
 * a spark orbits the border while an inset highlight lifts on hover.
 */
export function ShimmerButton({
  href,
  children,
  shimmerColor = "#8af0c0",
  shimmerSize = "0.07em",
  shimmerDuration = "3s",
  borderRadius = "999px",
  background = "linear-gradient(180deg, #0d1d15 0%, #060c09 100%)",
  className,
}: ShimmerButtonProps) {
  return (
    <a
      href={href}
      style={
        {
          "--spread": "90deg",
          "--shimmer-color": shimmerColor,
          "--radius": borderRadius,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
          "--bg": background,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap",
        "border border-mint/25 px-6 py-3 text-[15px] font-medium text-white [background:var(--bg)] [border-radius:var(--radius)]",
        "shadow-[0_0_0_1px_rgb(61_214_140/0.08),0_12px_40px_-12px_rgb(61_214_140/0.45)]",
        "transform-gpu transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_0_0_1px_rgb(61_214_140/0.2),0_16px_50px_-10px_rgb(61_214_140/0.6)] active:translate-y-px",
        className,
      )}
    >
      {/* spark container */}
      <span className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
        <span className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
          <span className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </span>
      </span>

      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>

      {/* highlight */}
      <span
        className={cn(
          "absolute inset-0 size-full rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff14]",
          "transform-gpu transition-all duration-300 ease-in-out",
          "group-hover:shadow-[inset_0_-6px_10px_#ffffff2e] group-active:shadow-[inset_0_-10px_10px_#ffffff2e]",
        )}
      />

      {/* backdrop */}
      <span className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
    </a>
  );
}
