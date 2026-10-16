import { BrandLogo, type Brand } from "@/components/ui/brand-logo";
import { Marquee } from "@/components/ui/marquee";

const agents: { name: string; brand: Brand }[] = [
  { name: "Claude Code", brand: "Claude Code" },
  { name: "Codex", brand: "Codex" },
  { name: "Gemini CLI", brand: "Gemini CLI" },
  { name: "Cursor", brand: "Cursor" },
  { name: "OpenCode", brand: "OpenCode" },
  { name: "Cline", brand: "Cline" },
  { name: "Windsurf", brand: "Windsurf" },
  { name: "GitHub Copilot", brand: "GitHub Copilot" },
  { name: "VS Code", brand: "VS Code" },
  { name: "Any MCP client", brand: "MCP" },
];

export function WorksWith() {
  return (
    <section aria-label="Works with your agents" className="relative py-12 md:py-16">
      <p className="px-5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-fg-4">
        Model-agnostic · built for the agents your team already runs
      </p>
      <Marquee className="mt-8" duration="55s">
        {agents.map((a) => (
          <span
            key={a.name}
            className="flex items-center gap-3 whitespace-nowrap text-[17px] font-medium tracking-[-0.01em] text-fg-3 transition-colors duration-300 hover:text-fg"
          >
            <BrandLogo brand={a.brand} className="size-6" />
            {a.name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
