"use client";

import { useInView, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * `useReducedMotion` that reports `false` until after hydration. Components that
 * branch their markup on it would otherwise render differently from the server
 * HTML on the first client pass and trigger a hydration mismatch.
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}

export function useMediaQuery(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/**
 * Steps through `count` states while the element is on screen.
 * `next` decides where to go after each tick (loop back, hold, reset…).
 */
export function useStepper<T extends HTMLElement>(
  count: number,
  interval: number,
  next: (i: number) => number = (i) => (i + 1) % count,
): [RefObject<T | null>, number, (i: number) => void] {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const nextRef = useRef(next);
  nextRef.current = next;

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setIndex((i) => nextRef.current(i)), interval);
    return () => clearInterval(t);
  }, [inView, interval]);

  return [ref, index, setIndex];
}

/**
 * Clamped linear map of a scroll MotionValue, e.g. progress 0.5→0.6 to opacity 1→0.
 *
 * Deliberately uses the function form of `useTransform`: with array ranges, Motion 13
 * hands opacity/filter/background to a native ViewTimeline animation whose range
 * doesn't match `useScroll` offsets on tall sticky targets, so those values drift
 * out of sync with the (JS-driven) transforms.
 */
export function useScrollRange(value: MotionValue<number>, input: [number, number], output: [number, number]) {
  return useTransform(value, (v) => {
    const t = Math.min(1, Math.max(0, (v - input[0]) / (input[1] - input[0])));
    return output[0] + (output[1] - output[0]) * t;
  });
}
