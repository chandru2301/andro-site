"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AndroLogo } from "@/components/ui/andro-logo";
import { ButtonLink } from "@/components/ui/button";
import { earlyAccessHref, nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border pl-5 pr-2",
          "transition-[background-color,border-color,box-shadow] duration-500",
          scrolled || open
            ? "border-line bg-ink-1/70 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" aria-label="Andro — back to top" className="shrink-0">
          <AndroLogo />
        </a>

        <nav className="hidden items-center md:flex" aria-label="Primary" onPointerLeave={() => setHover(null)}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onPointerEnter={() => setHover(item.href)}
              className="relative px-3.5 py-2 text-[13.5px] text-fg-3 transition-colors duration-300 hover:text-fg"
            >
              {hover === item.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {site.docsUrl && (
            <a href={site.docsUrl} className="hidden px-2 text-[13.5px] text-fg-3 transition-colors hover:text-fg sm:inline">
              Docs
            </a>
          )}
          <ButtonLink href={earlyAccessHref()} size="sm" variant="light" className="h-9 px-4">
            Get early access
          </ButtonLink>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-full border border-line-2 text-fg-2 md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="surface mx-auto mt-2 max-w-6xl rounded-3xl bg-ink-1/95 p-2 backdrop-blur-xl md:hidden"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] text-fg-2 transition-colors hover:bg-white/[0.04] hover:text-fg"
              >
                {item.label}
                <ArrowUpRight className="size-4 text-fg-4" />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
