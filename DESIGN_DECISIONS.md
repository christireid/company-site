# DESIGN_DECISIONS — Phase 1 Codification

*Single reference for the rebuild. Direction 1, "The Quiet Publication," reconciled with Site Copy v2. Cited in commits as DD.*

## 0. Document precedence (the load-bearing call)

The three source documents conflict in places. Precedence used throughout:

1. **Site Copy v2 is canonical for all rendered text, information architecture, section order, nav links, and CTAs.** It is the newest document (June 2026), maps 1:1 to the real repo, and the execution prompt itself declares the copy doc canonical and forbids inventing positioning language.
2. **The execution prompt's Critical Rules are canonical for design**: warm-light palette, no glass, accent discipline, typography redeployment, motion-as-pedagogy, WCAG 2.1 AA, anti-AI-slop checklist, no emoji.
3. **The design research report supplies the register** (Quiet Publication: paper, editorial devices, mono metadata, pedagogical motion).

Consequences, each a deliberate deviation recorded in FINAL_REPORT:

- **Single-page architecture stays.** The prompt's `Work / Writing / Frameworks / About / Contact` nav has zero copy behind it; Copy v2 specifies its own nav (`Implementation · Services · Results · Process · FAQ` + "Book a diagnostic"). Copy wins. `/accessibility` ships as a real route (Critical Rule 6); the essay template & Writing index are deferred until writing content exists.
- **Copy v2's positioning ("engineers who consult", implementation-first) supersedes the prompt's advisor-educator framing.** The warm editorial design carries the educator register; the words stay v2's.
- **The signature diagram** is the three-practice loop (Implementation / Strategy / Training) from Copy v2 §2.9 — not the five-node journey from the research — because the copy doc's canonical taxonomy is three practices and supplies the node/edge copy.
- **Copy v2's chip color annotations (old dark-palette HSL values) are treated as design, not copy**, and re-mapped to the ink-friendly palette below.

## 1. Color tokens (all pairings verified against #faf9f5)

| Token | Value | Role | Contrast on paper |
|---|---|---|---|
| `--paper` | `#faf9f5` | base surface | — |
| `--paper-deep` | `#f3f1ea` | alternating section band, cards (two surfaces only — no deeper ramp) | — |
| `--ink` | `#141413` | display text, headlines | 17.6:1 |
| `--ink-body` | `#33312d` | body text | 12.2:1 |
| `--ink-muted` | `#605c53` | captions, kickers, metadata | 5.9:1 |
| `--rule` | `rgba(20,20,19,.14)` | hairlines | n/a (decorative) |
| `--rule-strong` | `rgba(20,20,19,.28)` | table rules | n/a |
| `--terracotta` | `#c2552c` | primary accent: graphics, large/display accents, borders, dots — never small text | 4.3:1 (≥3:1 large/graphic) |
| `--terracotta-ink` | `#a8451f` | links, small accent text, buttons, italic display lines | 5.6:1 |
| `--gold` | `#8a6415` | secondary accent (ink-safe at any size): kicker accents, folios | 5.1:1 |
| `--gold-soft` | `#e8c87f` | gradient stop, thin bars only — never text | n/a |
| `--slate` | `#46666a` | third categorical accent (Training) — demoted, de-tech'd cyan | 5.9:1 |
| `--ok` | `#3a6b40` | ✓ column marks | 5.9:1 |
| `--no` | `#9a3b2e` | ✕ column marks | 6.6:1 |

Practice accents: Implementation `--terracotta`, Strategy `--gold`, Training `--slate`.

**Prism gradient** retuned `linear-gradient(90deg, #c2552c, #e8c87f 55%, #9c7218)` (warm → gold). Appears **only** on: the logo tick, 2px section divider rules, the footer rule. Never a background fill, never on cards, never as text fill.

Dark mode: **not built** (explicitly deferred).

## 2. Typography

- **Cormorant Garamond** — display only: H1/H2/H3, pull-quote manifesto, stat numerals. Weights 500/600 + italic 500 (heavier than the old 300 — Cormorant is fragile on screen; 500 holds on ivory).
- **Outfit** — body & UI. 400/500.
- **DM Mono** — kickers, labels, metadata, table column heads, index strips, stat captions, form labels. 400/500. Uppercase kickers: `0.72rem / .16em` tracking.
- Self-hosted woff2, latin subset, `font-display: swap`, display weight preloaded, metric-compatible fallbacks (`georgia`, `system-ui`) with `size-adjust`/`ascent-override` overrides to hold CLS.
- The ampersand in "Code & Clarity" always renders `--terracotta`.
- Prose measure: `max-width: 68ch` body, `78ch` leads.
- Type scale (display, Cormorant): hero `clamp(2.6rem, 5.4vw, 4.4rem)`; section `clamp(2rem, 4vw, 3.1rem)`; card `clamp(1.35rem, 2vw, 1.7rem)`. Body 1.0625rem/1.7.
- Em-line treatment (old "prism text"): italic Cormorant in `--terracotta-ink`. No gradient text anywhere.

## 3. Spacing, shape, surface

- Section padding `clamp(4.5rem, 9vw, 8rem)`; content max-width `1140px`; prose blocks tighter.
- Cards: flat `--paper` or `--paper-deep`, `1px solid var(--rule)`, **2px radius** (near-square, print-like) — uniform-radius rounded-card grids are an AI tell.
- No shadows except a 1px-blur lift on the sticky nav once scrolled. No blurs anywhere.
- Editorial devices in active use: mono kickers, folio numerals (`01 — 04`), hairline rules between list rows, two-column ledger tables, pull-quote manifesto with terracotta side rule.

## 4. Motion (pedagogy rule)

- House curve `cubic-bezier(.16,1,.3,1)`; durations 0.5–0.8s; rises ≤ 14px.
- framer-motion only for section-entrance reveals and the FAQ; `<MotionConfig reducedMotion="user">` wraps the app so every variant collapses for `prefers-reduced-motion`.
- Signature moment: inline SVG practice-loop diagram. Edges draw via **CSS scroll-driven animation** gated behind `@supports (animation-timeline: view())` **and** `(prefers-reduced-motion: no-preference)`; the un-gated default is the fully-drawn static diagram. Nodes are real `<button>`s (keyboard-operable, `aria-pressed`/`aria-controls`) that spotlight the matching practice card. Total added weight: ~4KB inline SVG + CSS.
- Problem ticker: kept (copy device), crossfade only; cycling disabled under reduced motion (first line static).
- Deleted: all canvases, marquee loops (capability strips render as static mono index lines), shimmer sweeps, scan lines, glow orbs.

## 5. Accessibility gates

- WCAG 2.1 AA: every text/background pairing in §1 ≥ 4.5:1 (small) or 3:1 (large/graphic). Focus-visible: 2px `--terracotta-ink` outline, 3px offset. Skip link. Landmarks: `header/nav/main/section[aria-label]/footer`. Native cursor. Native `<details>` for FAQ. `/accessibility` statement page in the footer.

## 6. Copy decisions on [VERIFY] items (flagged, conservative defaults)

| Item | Decision |
|---|---|
| Diagnostic free vs paid | Copy assumes free (no price named) — as written in Copy v2 |
| `50+ teams upskilled` | **Removed sitewide** (owner decision, June 2026 — unsourced); manifesto stat replaced with the contractual "1 business day / First response" |
| Higher-ed case detail | Kept as written; flagged — soften if the engagement is identifiable |
| LegalTech "zero churn" case | **Cut** (Copy v2's own recommendation absent verification) |
| FAQ #8 pricing | Included (Copy v2 recommends) |
| Booking URL | None exists — all diagnostic CTAs target `#section-contact`; swap to a scheduler URL when one exists |

## 7. Page/route map

| Route | Content |
|---|---|
| `/` | Nav → Hero → ProofStrip → ManifestoBreak → Services → ProductSignal → Results → TransformZones (diagram) → ContrastBreak → Process → FAQ → Contact → Footer |
| `/accessibility` | Accessibility statement (WCAG 2.1 AA conformance, measures, contact) |
| `/dev/specimen` | Type/token QA specimen (not linked from the site) |
