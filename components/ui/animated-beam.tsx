"use client";

import { useEffect, useId, useState, type CSSProperties, type RefObject } from "react";
import { cn } from "@/lib/utils";

type Side = "left" | "right" | "top" | "bottom";

type AnimatedBeamProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  fromSide?: Side;
  toSide?: Side;
  curvature?: number;
  duration?: number;
  delay?: number;
  active?: boolean;
  className?: string;
};

/**
 * Layout position of `el` inside `container`, from the offsetParent chain.
 * Offsets ignore CSS transforms, so entrance animations on the endpoints
 * don't skew the beam while they play.
 */
function box(el: HTMLElement, container: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function anchor(b: ReturnType<typeof box>, side: Side) {
  switch (side) {
    case "left":
      return { x: b.x, y: b.y + b.h / 2 };
    case "right":
      return { x: b.x + b.w, y: b.y + b.h / 2 };
    case "top":
      return { x: b.x + b.w / 2, y: b.y };
    case "bottom":
      return { x: b.x + b.w / 2, y: b.y + b.h };
  }
}

/**
 * Magic UI `AnimatedBeam` pattern (21st.dev registry), simplified: measures two
 * elements, joins them with a curve, and sends a comet along it. The comet is a
 * normalised dash (pathLength = 1), so it travels correctly in any direction.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  fromSide = "right",
  toSide = "left",
  curvature = 0,
  duration = 3.2,
  delay = 0,
  active = true,
  className,
}: AnimatedBeamProps) {
  const id = useId();
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const c = containerRef.current;
      const a = fromRef.current;
      const b = toRef.current;
      if (!c || !a || !b) return;
      const p1 = anchor(box(a, c), fromSide);
      const p2 = anchor(box(b, c), toSide);
      const horizontal = fromSide === "left" || fromSide === "right";
      const mid = horizontal ? (p1.x + p2.x) / 2 : (p1.y + p2.y) / 2;
      const path = horizontal
        ? `M ${p1.x},${p1.y} C ${mid},${p1.y - curvature} ${mid},${p2.y - curvature} ${p2.x},${p2.y}`
        : `M ${p1.x},${p1.y} C ${p1.x - curvature},${mid} ${p2.x - curvature},${mid} ${p2.x},${p2.y}`;
      setSize({ w: c.offsetWidth, h: c.offsetHeight });
      setD(path);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef, fromSide, toSide, curvature]);

  if (!d) return null;

  const comet = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    "--beam-travel": -1,
  } as CSSProperties;

  return (
    <svg
      aria-hidden
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      className={cn("pointer-events-none absolute left-0 top-0 overflow-visible", className)}
    >
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path d={d} fill="none" stroke="rgb(255 255 255 / 0.09)" strokeWidth={1.25} />
      <g className={cn("transition-opacity duration-500", active ? "opacity-100" : "opacity-25")}>
        <path
          d={d}
          fill="none"
          pathLength={1}
          stroke="#3dd68c"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray="0.1 0.9"
          filter={`url(#glow-${id})`}
          className="animate-beam opacity-60"
          style={comet}
        />
        <path
          d={d}
          fill="none"
          pathLength={1}
          stroke="#b8f7d8"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeDasharray="0.1 0.9"
          className="animate-beam"
          style={comet}
        />
      </g>
    </svg>
  );
}
