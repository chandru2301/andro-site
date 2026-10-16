import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accent, Eyebrow } from "@/components/ui/section-heading";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { earlyAccessHref, site } from "@/lib/site";

export function Cta() {
  return (
    <section id="early-access" className="relative isolate scroll-mt-10 overflow-hidden px-5 py-32 md:py-48">
      {/* 21st.dev AuroraBackground, re-tuned to mint */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora" />
      </div>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px glint-line opacity-60" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <Reveal>
          <Eyebrow>Early access</Eyebrow>
        </Reveal>
        <Reveal
          as="h2"
          delay={0.08}
          className="text-gradient mt-6 text-balance text-[clamp(2.8rem,8vw,6.2rem)] font-medium leading-[0.98] tracking-[-0.05em]"
        >
          Understand first. <Accent>Then change.</Accent>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-fg-3 md:text-lg">
          Give your agents a map of the system before they touch it. Andro is opening to early teams building with Claude,
          Codex and Gemini.
        </Reveal>
        <Reveal delay={0.24} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <ShimmerButton href={earlyAccessHref()} className="px-7 py-3.5 text-[15.5px]">
            Get early access
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </ShimmerButton>
          {site.contactEmail && (
            <ButtonLink href={`mailto:${site.contactEmail}`} variant="ghost" size="lg">
              Talk to the team
            </ButtonLink>
          )}
          {site.docsUrl && (
            <ButtonLink href={site.docsUrl} variant="ghost" size="lg">
              Read the docs
            </ButtonLink>
          )}
        </Reveal>
      </div>
    </section>
  );
}
