/**
 * Site-wide links and launch gating.
 *
 * Anything that is not live yet is `null` instead of a made-up URL. Components
 * fall back to an in-page anchor (or hide the link) so the page never ships a
 * dead link or a promise that is not true yet.
 */
export const site = {
  name: "Andro",
  tagline: "The intelligence layer for AI engineering agents.",
  description:
    "Andro builds a structured understanding of your codebase — files, symbols, dependencies and architecture — and gives Claude, Codex, Gemini or any agent the exact context each task needs.",

  /** Early-access / waitlist destination. Falls back to the #early-access section. */
  earlyAccessUrl: null as string | null,
  /** Docs site. Hidden while null. */
  docsUrl: null as string | null,
  /** Public GitHub repo. Hidden while null. */
  githubUrl: null as string | null,
  /** Contact address for the "Talk to us" button. Hidden while null. */
  contactEmail: null as string | null,
};

export const nav = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Context graph", href: "#graph" },
  { label: "Agent API", href: "#api" },
  { label: "Picto", href: "#picto" },
];

export function earlyAccessHref() {
  return site.earlyAccessUrl ?? "#early-access";
}

/** Shared site URL for metadata. Set NEXT_PUBLIC_SITE_URL before deploying. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return fromEnv ? fromEnv.replace(/\/$/, "") : "http://localhost:3000";
}
