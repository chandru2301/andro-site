import Image from "next/image";
import { Check } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandLogo, type Brand } from "@/components/ui/brand-logo";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";

type Chip = { label: string; brand: Brand };
const inner: Chip[] = [
  { label: "Claude Code", brand: "Claude Code" },
  { label: "Codex", brand: "Codex" },
  { label: "Gemini CLI", brand: "Gemini CLI" },
];
const outer: Chip[] = [
  { label: "Cursor", brand: "Cursor" },
  { label: "OpenCode", brand: "OpenCode" },
  { label: "Cline", brand: "Cline" },
  { label: "Your MCP agent", brand: "MCP" },
];

const points = [
  "Swap models without re-teaching them your codebase.",
  "One structured understanding, shared by every agent session.",
  "Your system map outlives any single model release.",
];

function Ring({ items, size, duration, offset = 0 }: { items: Chip[]; size: string; duration: string; offset?: number }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit rounded-full border border-dashed border-line-2"
      style={{ width: size, height: size, "--orbit-duration": duration } as CSSProperties}
    >
      {items.map(({ label, brand }, i) => {
        const angle = offset + (i / items.length) * Math.PI * 2;
        return (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
          >
            <div className="animate-orbit-reverse" style={{ "--orbit-duration": duration } as CSSProperties}>
              <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line-2 bg-ink-2/95 py-1.5 pl-2 pr-3 text-[12.5px] text-fg-2 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.9)] backdrop-blur">
                <BrandLogo brand={brand} className="size-[18px]" />
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ModelAgnostic() {
  return (
    <section className="relative overflow-hidden px-5 py-24 md:py-36">
      <RetroGrid className="inset-x-0 bottom-0 top-auto h-[55%]" opacity={0.55} />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="text-center lg:text-left">
          <Reveal>
            <Eyebrow index="09">Model-agnostic</Eyebrow>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.08}
            className="text-gradient mt-5 text-balance text-[clamp(2.2rem,5vw,3.9rem)] font-medium leading-[1.03] tracking-[-0.038em]"
          >
            Andro isn&apos;t the model. It&apos;s what the model <Accent>knows.</Accent>
          </Reveal>
          <Reveal as="p" delay={0.16} className="mx-auto mt-5 max-w-xl text-pretty text-[17px] leading-relaxed text-fg-3 md:text-lg lg:mx-0">
            Claude, Codex, Gemini — model providers will keep changing. Andro stays the constant: a structured understanding of
            your code that any agent can use.
          </Reveal>
          <ul className="mx-auto mt-8 max-w-md space-y-3 text-left lg:mx-0">
            {points.map((p, i) => (
              <Reveal as="li" key={p} delay={0.2 + i * 0.06} className="flex items-start gap-3 text-[15px] text-fg-2">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-mint/40 bg-mint/10 text-mint">
                  <Check className="size-3" />
                </span>
                {p}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="relative mx-auto aspect-square w-full max-w-[540px]">
          <div aria-hidden className="absolute inset-[18%] rounded-full bg-mint/[0.1] blur-[80px]" />
          <Ring items={outer} size="92%" duration="90s" offset={Math.PI / 4} />
          <Ring items={inner} size="56%" duration="60s" offset={-Math.PI / 2} />
          <div className="absolute left-1/2 top-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28%] border border-mint/30 bg-ink-2 shadow-[0_0_80px_-10px_rgb(61_214_140/0.55)]">
            <Image src="/brand/andro-mark.png" alt="Andro" width={96} height={96} className="size-[62%]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
