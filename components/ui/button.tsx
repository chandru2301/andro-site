import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "light" | "ghost" | "mint";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  light:
    "bg-fg text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.12),0_8px_24px_-10px_rgb(255_255_255/0.35)] hover:bg-white",
  ghost: "border border-line-2 bg-white/[0.02] text-fg-2 hover:border-line-3 hover:bg-white/[0.05] hover:text-fg",
  mint: "bg-mint text-[#03140b] shadow-[inset_0_-2px_0_rgb(0_0_0/0.15),0_10px_30px_-10px_rgb(61_214_140/0.6)] hover:bg-mint-2",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[13px] rounded-full",
  md: "h-10 px-5 text-[14px] rounded-full",
  lg: "h-12 px-6 text-[15px] rounded-full",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant = "light", size = "md", className, ...props }: ButtonLinkProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 active:translate-y-px",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
