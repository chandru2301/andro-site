import Image from "next/image";
import { AndroLogo } from "@/components/ui/andro-logo";
import { earlyAccessHref, site } from "@/lib/site";

const product = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Retrieval", href: "#retrieval" },
  { label: "Context graph", href: "#graph" },
  { label: "Agent API", href: "#api" },
];

const ecosystem = [
  { name: "Andro", role: "Code intelligence" },
  { name: "Picto", role: "Architecture canvas" },
  { name: "Tempest", role: "Agent runtime" },
];

export function Footer() {
  const start = [
    { label: "Early access", href: earlyAccessHref() },
    ...(site.docsUrl ? [{ label: "Docs", href: site.docsUrl }] : []),
    ...(site.githubUrl ? [{ label: "GitHub", href: site.githubUrl }] : []),
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line px-5 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <AndroLogo />
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-fg-4">{site.tagline}</p>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-5">Product</p>
          <ul className="mt-4 space-y-2.5">
            {product.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[14px] text-fg-3 transition-colors hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-5">Workspace</p>
          <ul className="mt-4 space-y-2.5">
            {ecosystem.map((e) => (
              <li key={e.name} className="text-[14px] text-fg-3">
                {e.name} <span className="text-fg-5">· {e.role}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-fg-5">Get started</p>
          <ul className="mt-4 space-y-2.5">
            {start.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-[14px] text-fg-3 transition-colors hover:text-fg">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col justify-between gap-2 border-t border-line py-6 font-mono text-[11px] text-fg-5 sm:flex-row">
        <span>© 2026 Andro</span>
        <span>Understand first. Then change.</span>
      </div>

      <div aria-hidden className="pointer-events-none mx-auto -mb-[3%] max-w-7xl select-none opacity-[0.07] [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]">
        <Image src="/brand/andro-wordmark.png" alt="" width={1068} height={200} className="h-auto w-full" />
      </div>
    </footer>
  );
}
