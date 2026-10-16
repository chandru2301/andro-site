import { cn } from "@/lib/utils";

type RetroGridProps = {
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lineColor?: string;
  className?: string;
};

/** `RetroGrid` from the 21st.dev "Hero Section Dark" component: a perspective floor that scrolls toward you. */
export function RetroGrid({
  angle = 65,
  cellSize = 64,
  opacity = 0.5,
  lineColor = "rgb(61 214 140 / 0.22)",
  className,
}: RetroGridProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute size-full overflow-hidden [perspective:200px]", className)}
      style={{ opacity }}
    >
      <div className="absolute inset-0" style={{ transform: `rotateX(${angle}deg)` }}>
        <div
          className="animate-retro-grid"
          style={{
            backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 0), linear-gradient(to bottom, ${lineColor} 1px, transparent 0)`,
            backgroundRepeat: "repeat",
            backgroundSize: `${cellSize}px ${cellSize}px`,
            height: "300vh",
            inset: "0% 0px",
            marginLeft: "-200%",
            transformOrigin: "100% 0 0",
            width: "600vw",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent to-90%" />
    </div>
  );
}
