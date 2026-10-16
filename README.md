# Andro — marketing site

Landing page for **Andro**, the intelligence layer for AI engineering agents.
Next.js 16 (App Router, statically prerendered) · Tailwind CSS v4 · Motion 13 · Lenis smooth scroll.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static production build
npm run typecheck
```

## Before launch

Everything that isn't live yet is `null` in [`lib/site.ts`](lib/site.ts), so the page never ships a dead link:

| Field | Effect while `null` |
| --- | --- |
| `earlyAccessUrl` | "Get early access" buttons scroll to the `#early-access` section |
| `docsUrl` / `githubUrl` | Docs / GitHub links are hidden |
| `contactEmail` | "Talk to the team" button is hidden |

Also set `NEXT_PUBLIC_SITE_URL` to the real domain — it feeds `metadataBase`, so the Open Graph image URL is absolute.

## Page structure

`app/page.tsx` assembles the sections in `components/sections/`, in story order:

| # | Section | What moves |
| --- | --- | --- |
| – | `hero` + `context-graph-app` | Word-by-word headline, orbit satellite, live context graph whose focus cycles through symbols while the panel assembles focused context; tilts flat on scroll |
| – | `works-with` | Brand-logo marquee |
| 01 | `problem` | The rediscovery loop vs. the one-pass Andro path |
| 02 | `chunks-to-chain` | Sticky scroll: four scattered search results assemble into one system path (lg+) |
| 03 | `levels` + `levels-visuals` | Sticky scroll through file → symbol → relationship → dependency → repository |
| 04 | `retrieval` | Keyword / semantic / symbol / graph beams fusing into one ranking |
| 05 | `context-demo` | Scripted "Add Razorpay payment support" session with replay |
| 06 | `graph-bento` | Node inspector, typed edges, vector-vs-graph, incremental re-index |
| 07 | `stack` | Isometric five-layer stack that separates on scroll |
| 08 | `agent-api` | The seven agent operations with streamed sample results |
| 09 | `model-agnostic` | Agent logos orbiting the Andro mark over a retro grid |
| 10 | `picto-loop` | Clickable architecture canvas + runnable "Add caching here" loop |
| 11 | `faq`, `cta`, `footer` | Accordion, aurora CTA, wordmark footer |

Demo data (the sample `shop-platform` repo, token counts, scores) lives in `lib/graph.ts` and inside each section — it is illustrative product UI, not benchmark data.

## 21st.dev components used

Ported from `../21st` (and its registry) into `components/ui/`, restyled to the Andro palette:

| Component | Source | Used in |
| --- | --- | --- |
| `Spotlight` | 21st Magic hero | Hero light beams |
| `RotatingText` | 21st Magic hero | Hero command bar |
| `ShimmerButton` | Magic UI via 21st | Primary CTAs |
| `TextShimmer` | 21st UI | "Assembling context…" states |
| `HeroPill` | Codehagen / Origin UI | Hero announcement |
| `Mockup`, `MockupFrame` | 21st UI | Hero product frame |
| `TiltOnScroll` | Aceternity Container Scroll | Hero mockup 3D tilt |
| `DotHighlight` | Aceternity Hero Highlight | Hero pointer spotlight |
| `AnimatedBeam` | Magic UI Animated Beam | Retrieval section |
| `Marquee` | Magic UI Marquee | Works-with strip |
| `RetroGrid` | Hero Section Dark | Model-agnostic floor |
| Aurora (`.aurora`) | 21st AuroraBackground | Final CTA |
| `Accordion` | 21st / shadcn | FAQ |
| Blur-fade reveal (`Reveal`) | 21st Magic hero motion | Every section |
| Feature steps pattern | Serenity UI Feature Section | Five-levels section |

## Brand assets

- `public/brand/` — Andro mark and wordmark (from `andromedia/landing`).
- `public/logos/` — agent/editor logos from [SVGL](https://svgl.app) (the logo library 21st.dev's Magic integrates), plus Cline and the Codex app icon from `@lobehub/icons`. All marks belong to their respective owners and are used to show compatibility.

## Motion notes

- **Reduced motion** is respected everywhere: Lenis is disabled, Motion skips transform animations, CSS loops stop, and scripted demos jump to their final state. `useReducedMotionSafe()` (in `lib/hooks.ts`) only reports the preference after hydration, so markup never differs from the server HTML.
- **Scroll-linked opacity:** use `useScrollRange()` from `lib/hooks.ts`, not `useTransform(value, [..], [..])`. With array ranges, Motion 13 hands `opacity`/`filter`/`backgroundColor` to a native `ViewTimeline` whose range doesn't match `useScroll` offsets on tall sticky targets, so those values drift out of sync with the transforms.
