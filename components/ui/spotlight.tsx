"use client";

import { motion } from "motion/react";

type SpotlightProps = {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
};

/**
 * Twin drifting light beams. Ported from the 21st.dev Magic hero `Spotlight`,
 * re-tinted from blue (hsl 210) to Andro mint (hsl 152).
 */
export function Spotlight({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(152, 80%, 80%, .09) 0, hsla(152, 70%, 55%, .025) 50%, hsla(152, 70%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(152, 80%, 80%, .06) 0, hsla(152, 70%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(152, 80%, 80%, .04) 0, hsla(152, 70%, 45%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 8,
  xOffset = 100,
}: SpotlightProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto h-full max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
        className="relative h-full w-full"
      >
        <motion.div
          animate={{ x: [0, xOffset, 0] }}
          transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="pointer-events-none absolute left-0 top-0 z-0 h-screen"
        >
          <div
            style={{ transform: `translateY(${translateY}px) rotate(-45deg)`, background: gradientFirst, width, height }}
            className="absolute left-0 top-0"
          />
          <div
            style={{ transform: "rotate(-45deg) translate(5%, -50%)", background: gradientSecond, width: smallWidth, height }}
            className="absolute left-0 top-0 origin-top-left"
          />
          <div
            style={{ transform: "rotate(-45deg) translate(-180%, -70%)", background: gradientThird, width: smallWidth, height }}
            className="absolute left-0 top-0 origin-top-left"
          />
        </motion.div>

        <motion.div
          animate={{ x: [0, -xOffset, 0] }}
          transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="pointer-events-none absolute right-0 top-0 z-0 h-screen"
        >
          <div
            style={{ transform: `translateY(${translateY}px) rotate(45deg)`, background: gradientFirst, width, height }}
            className="absolute right-0 top-0"
          />
          <div
            style={{ transform: "rotate(45deg) translate(-5%, -50%)", background: gradientSecond, width: smallWidth, height }}
            className="absolute right-0 top-0 origin-top-right"
          />
          <div
            style={{ transform: "rotate(45deg) translate(180%, -70%)", background: gradientThird, width: smallWidth, height }}
            className="absolute right-0 top-0 origin-top-right"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
