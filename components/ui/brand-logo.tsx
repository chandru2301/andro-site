import { cn } from "@/lib/utils";

/**
 * Official marks for the agents and editors Andro works with, served from
 * /public/logos (sourced from SVGL — the logo library 21st.dev's Magic
 * integrates — and @lobehub/icons for Cline and the Codex app icon).
 */
const logos = {
  "Claude Code": "/logos/claude.svg",
  Codex: "/logos/codex-color.svg",
  "Gemini CLI": "/logos/gemini.svg",
  Cursor: "/logos/cursor.svg",
  OpenCode: "/logos/opencode.svg",
  Cline: "/logos/cline.svg",
  Windsurf: "/logos/windsurf.svg",
  "GitHub Copilot": "/logos/copilot.svg",
  "VS Code": "/logos/vscode.svg",
  MCP: "/logos/mcp.svg",
} as const;

export type Brand = keyof typeof logos;

export function BrandLogo({ brand, className }: { brand: Brand; className?: string }) {
  return (
    // Plain <img>: these are tiny static SVGs, so image optimisation adds nothing.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logos[brand]}
      alt=""
      width={20}
      height={20}
      loading="lazy"
      decoding="async"
      className={cn("size-5 shrink-0 object-contain", brand === "OpenCode" && "rounded-[4px]", className)}
    />
  );
}
