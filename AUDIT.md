# AUDIT — Phase 0 Discovery

*Inventory of the existing codebase against the redesign brief (Direction 1, "The Quiet Publication") and Site Copy v2. June 2026.*

## Stack

| Item | Finding |
|---|---|
| Framework | React 19 + Vite 6, TypeScript strict, SPA (no router) |
| Styling | Single `src/styles/globals.css` (5,056 lines) + inline styles; CSS custom-property tokens |
| Motion | framer-motion 12 + shared rAF loop (`src/hooks/useAnimation.ts`) driving five `<canvas>` animations |
| Fonts | Google Fonts CDN (Cormorant Garamond, Outfit, DM Mono) — render-blocking `<link>`, double-loaded (also `@import` in CSS) |
| Deploy | Vercel (`vercel.json`, SPA rewrite, `/api/send-email` serverless via Resend) — `wrangler` scripts are vestigial |
| Tests | Playwright installed, no specs present |

## Conflicts with the brief (sitewide)

- Base surface is `#040406` void; the entire surface ramp, glass tokens, and text ramp are dark-mode. **Retired.**
- Glassmorphism (`--glass-*`, backdrop blurs) used in nav, cards, tooltip. **Retired.**
- Cyan `hsl(181,100%,80%)` is the primary accent (focus rings, selection, links, borders). **Demoted/removed.**
- Five animated canvases (particles, prism waves, neural net, constellation, triangle cascade) = the exact "AI-product costume" the research retires. **Deleted.**
- Decorative fake metrics: arc gauges, `dPct`/`pPct` bars, radar charts, deliverable bar charts with invented widths. **Deleted (AI-tell).**
- `Results.tsx` exists but is never mounted — the site renders zero proof. **Mounted.**
- Emoji/dingbat glyphs in UI (`❌`, `✦`, `❝`, `◈`, `⬡`, `◎`). **Removed.**
- Mixed British/American spelling ("Organisation", "programmes"). **Standardized American.**

## Disposition by file

| File | Disposition | Reason |
|---|---|---|
| `index.html` | rebuild | New metadata (Copy v2 §2.1), self-hosted fonts, theme-color |
| `src/styles/globals.css` | rebuild | Token system is dark-first throughout; replaced wholesale |
| `src/client.tsx` | restyle | Add path routing for `/accessibility` and `/dev/specimen` |
| `src/App.tsx` | rebuild | New render order; mount `Results`; add `ProofStrip`; drop terminal section, SVG burn filter, ambient layers |
| `src/components/Nav.tsx` | restyle | New links + nav CTA (Copy v2 §2.2); flat surface, no blur |
| `src/components/Hero.tsx` | rebuild | Typographic hero; keep problem-ticker device; delete `CrystalCanvas` + `ParticleField` |
| `src/components/ManifestoBreak.tsx` | rebuild | Canonical stats/chips/manifesto line (§2.5); marquees become static index lines |
| `src/components/Services.tsx` | rebuild | Three chapters, implementation first (§2.6); delete fake bar chart |
| `src/components/ProductSignal.tsx` | rebuild | §2.7; delete neural canvas, gauges, fake percentage bars |
| `src/components/Results.tsx` | rebuild + **mount** | §2.8; canonical metrics; cut LegalTech churn case; delete constellation canvas |
| `src/components/TransformZones.tsx` | rebuild | Becomes the signature self-explaining SVG diagram (§2.9 + Phase 4); delete radar/cascade canvases |
| `src/components/ContrastBreak.tsx` | restyle + recopy | Device kept (§2.10) |
| `src/components/Process.tsx` | restyle + recopy | Structure kept (§2.11) |
| `src/components/FAQ.tsx` | rebuild | Eight items incl. new "Who shouldn't hire you?" (§2.12); native `<details>` |
| `src/components/Contact.tsx` | restyle + recopy | Keep form wiring + `/api/send-email`; new copy (§2.13) |
| `src/components/Footer.tsx` | rebuild | §2.14 + accessibility-statement link |
| `src/components/AmbientLayer.tsx` | delete | Ambient orbs/grain — decoration |
| `src/components/GlobalEffects.tsx` | delete | Scroll glow effects — decoration |
| `src/components/TerminalBlock.tsx` | delete | Terminal motif on a marketing surface (Critical Rule 9) |
| `src/components/PrismVisuals.tsx` | delete | Orphaned (never imported); void-palette visuals |
| `src/components/SpecimenArt.tsx` | delete | Orphaned; void-palette visuals |
| `src/components/GlassTooltip.tsx` | delete | Orphaned; glassmorphism |
| `src/components/SoundToggle.tsx` | delete | Orphaned; sound is out of scope for the brief |
| `src/hooks/useAnimation.ts` | restyle | Keep `useInView`; delete the rAF master loop (no more canvases) |
| `src/utils/animation.ts` | delete | Only served canvases/terminal |
| `api/send-email.ts` | keep | Working contact pipeline |
| `vercel.json` | keep | SPA rewrite already covers new routes |

## New files

- `public/fonts/*.woff2` — self-hosted, subset
- `src/components/ProofStrip.tsx` — proof strip under hero (Copy v2 §2.4)
- `src/pages/Accessibility.tsx` — WCAG statement page (Critical Rule 6)
- `src/pages/Specimen.tsx` — `/dev/specimen` type QA page (Phase 2)
- `DESIGN_DECISIONS.md`, `QA_REPORT.md`, `FINAL_REPORT.md`
