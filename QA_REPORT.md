# QA_REPORT — Phase 6 Gauntlet

*Run against the production build (`vite build` → `vite preview`), June 2026. Tooling: Playwright (preinstalled Chromium 141), Lighthouse 12 (mobile emulation, simulated throttling), programmatic WCAG contrast math.*

## 1. Visual pass (Playwright)

Screenshots captured at desktop 1440px, tablet 834px, mobile 390px; reduced-motion on and off; plus `/accessibility` and `/dev/specimen`. All sections render fully at every breakpoint; reduced-motion renders the entire page in its final static state with no entrance animation. Zero console errors, zero page errors.

Keyboard-only run (desktop): tab order is skip-link → logo → five nav links → nav CTA → hero primary CTA → hero ghost link → in-page CTAs, all with visible 2px terracotta focus outlines. FAQ items are native `<details>/<summary>` (keyboard operable by default); diagram nodes are focusable `role="button"` elements operable with Enter/Space.

## 2. Accessibility

- **Lighthouse accessibility: 100.**
- Contrast, verified mathematically for every token pairing on both surfaces (`#faf9f5`, `#f3f1ea`):

| Pairing | on paper | on deep | Requirement |
|---|---|---|---|
| ink `#141413` | 17.5 | 16.3 | 4.5 ✓ |
| ink-body `#33312d` | 12.3 | 11.5 | 4.5 ✓ |
| ink-muted `#605c53` | 6.3 | 5.9 | 4.5 ✓ |
| terracotta `#c2552c` (large/graphic only) | 4.3 | 4.0 | 3.0 ✓ |
| terracotta-ink `#a8451f` (small text) | 5.6 | 5.3 | 4.5 ✓ |
| gold `#8a6415` | 5.1 | 4.8 | 4.5 ✓ |
| slate `#46666a` | 5.9 | 5.5 | 4.5 ✓ |
| ok `#3a6b40` / no `#9a3b2e` | 5.9 / 6.6 | 5.5 / 6.1 | 4.5 ✓ |
| paper on ink (buttons) | 17.5 | — | 4.5 ✓ |

  During this audit two failures were found and fixed: raw terracotta and the original gold (`#9c7218`, 4.1:1) were used on small mono text; small-text uses now route through `--terracotta-ink`, and `--gold` was darkened to `#8a6415`.
- Landmarks: `nav`, `main`, labeled `section`s, `footer`; skip link; semantic headings; `aria-live="polite"` ticker; `role="alert"` form errors; `role="status"` success state; `aria-pressed` on the interest buttons and diagram nodes.
- Reduced motion: every entrance collapses to final static state (CSS media query); ticker cycling stops (static first line); SVG edge-draw never activates (it is opt-in behind `@supports (animation-timeline: view()) and (prefers-reduced-motion: no-preference)`).
- Native cursor throughout. `/accessibility` statement page ships and is linked in the footer.
- Note: axe-core CLI was not runnable in this environment (browser download blocked by network policy); Lighthouse's axe-derived audit ran via the preinstalled Chromium and scored 100. Recommend a one-off axe DevTools pass after deploy.

## 3. Performance (Lighthouse 12, mobile, simulated throttling)

| Metric | Result | Gate |
|---|---|---|
| Performance score | **97** | ≥ 90 ✓ |
| Accessibility | **100** | — |
| Best practices | **100** | — |
| SEO | **100** | — |
| LCP | **2.4 s** | ≤ 2.5 s ✓ |
| CLS | **0** | ≤ 0.1 ✓ |
| FCP / TBT | 1.6 s / 40 ms | — |

Levers that got it green: framer-motion removed entirely (−43 KB gz; entrances are IO + CSS transitions per the brief's "CSS first" hierarchy), fonts self-hosted as 5 latin-subset woff2 files (124 KB total) with `font-display: swap`, display+body faces preloaded, metric-compatible fallbacks (CLS 0), `robots.txt` added (SPA rewrite was serving HTML for it).

Bundle after rebuild: 25 KB CSS (5.5 gz), ~230 KB JS total (~76 KB gz) including React; five lazy chunks below the fold.

## 4. AI-tell audit (Critical Rule 7 checklist)

- No purple/blue gradients, no gradient mesh, no particle/neural visuals, no robot/brain imagery, no AI-generated images — all five canvases deleted.
- No glassmorphism, no backdrop blur anywhere (grep-verified: zero `backdrop-filter`).
- No Inter/system-default type; triad is Cormorant/Outfit/DM Mono, self-hosted.
- No three-icon-card grid with uniform radii — cards are 2px-radius hairline panels in varied editorial layouts (chapters, ledgers, index strips).
- No dark Linear/Vercel clone styling — the void palette is gone.
- Vocabulary grep over all rendered copy: zero hits for *solutions* (except the deliverable "Vendor solution integration" from the copy doc), *journey, unlock, empower, delve, dive in, seamless, leverage, cutting-edge, game-changing*.
- Zero emoji (programmatic scan; the only non-ASCII glyphs are sanctioned typographic marks: ✕ ✓ → › · —).
- No decorative fake metrics: the `dPct`/`pPct` bars, arc gauges, radar charts, and invented deliverable bar-widths are deleted; the only numbers on the site are externally sourced or contractual.

## 5. Copy fidelity vs Site Copy v2

Rendered text transcribed 1:1 from the copy doc for: metadata, nav, hero (headline option A, sub, status, tagline, ticker ×6, CTAs, pillars, capability strip), proof strip, manifesto (stats, chips, index lines, manifesto paragraph), all three service chapters, ProductSignal (header, 4 features, 4 ledger rows, arch labels, CTA), Results (header, 4 metrics, 4 cases), TransformZones (header, labels, 3 cards, loop explainer, 3 notes), ContrastBreak (7 pairs, labels, CTA), Process (4 steps, CTA), FAQ (8 items), Contact (header, intro, chips, stats, options, placeholders, success state), footer.

Recorded deviations and `[VERIFY]` dispositions are listed in `FINAL_REPORT.md` §3–4. No `[COPY NEEDED]` placeholders were required.
