# FINAL_REPORT — Code & Clarity redesign

## 0. Post-launch revision: advisory repositioning + UX remediation (June 2026)

By owner decision, all custom-development and engineering *offerings* were removed.
The practice is now **implementation strategy and recommendations**: planning, vendor
evaluation, build-vs-buy, reference architecture, acceptance criteria, vendor oversight,
audits, governance, and training. Engineering history remains as credibility substrate
("we shipped before we consulted", "we only recommend what we could build ourselves")
but nothing on the site or LinkedIn sells a build. New canonical taxonomy:
**AI Implementation Strategy · AI Audits & Governance · AI Training & Capability.**

In the same pass, every finding from the UX expert review was implemented:
ticker now cycles once and stops (WCAG 2.2.2) with `aria-live` removed; diagram nodes
got 30px invisible hit circles, `role="group"` (was `role="img"`, which hid the buttons
from AT), hover affordance, a "Select a practice" hint, and scroll-into-view feedback;
mobile ledger rows regained their column frame via per-cell micro-labels; the contact
form opens with "The 45-minute diagnostic starts here" to close the CTA seam;
`color-scheme: light` set; nav scrollspy added; surface rhythm fixed (proof strip on
paper, ProductSignal deep, Results paper, FAQ deep); redundant manifesto index lines
cut; stat baselines aligned; "See how we work" retargeted to Process; FAQ panels animate
where `interpolate-size` is supported; OG card (`/og.png`) and 32px PNG favicon added;
footer gained a direct email. Lighthouse after the pass: 97 / 100 / 100 / 100, LCP 2.4s, CLS 0.

**Owner decisions on this revision's [VERIFY] items:**
- Vendor-commission metric: **rejected — removed.**
- Case studies: **all removed by owner decision.** With no cases, the Results section had no
  unique content (its remaining metrics duplicate the proof strip/manifesto/contact), so the
  section was unmounted entirely and its nav/footer links removed. Side effect: the page now
  alternates surfaces perfectly (deep/paper) end to end. Proof on the site is now contractual
  facts + cited research only; reintroduce a Results section only when publishable engagements exist.
- Footer/accessibility email `hello@codeclarity.ai` — still [VERIFY]: confirm the inbox exists.

*"The Quiet Publication" applied to the live single-page site, with Site Copy v2 as canonical text. June 2026.*

## 1. What shipped, by phase

- **Phase 0 — Discovery:** `AUDIT.md`. Full inventory; every file dispositioned rebuild / restyle / delete.
- **Phase 1 — Codification:** `DESIGN_DECISIONS.md`. Token table, type system, editorial devices, motion rules, document-precedence call, `[VERIFY]` dispositions.
- **Phase 2 — Foundation:** new token system in `globals.css` (warm ivory / warm ink / terracotta / gold / slate; the old 5,056-line dark system replaced by ~1,000 lines); five self-hosted latin-subset woff2 fonts with preloads and metric fallbacks; `/dev/specimen` type-QA page.
- **Phase 3 — Pages:** all thirteen sections rebuilt against Copy v2 in its specified order; `Results` mounted for the first time (the live site previously rendered zero proof); new `ProofStrip`; `/accessibility` statement page; new favicon and `robots.txt`.
- **Phase 4 — Signature moment:** the practice-loop diagram in `TransformZones` — inline SVG (~3 KB), edges draw via CSS scroll-driven animation gated behind `@supports (animation-timeline: view())` *and* no-preference motion, fully legible static otherwise, keyboard-operable nodes that spotlight their practice card.
- **Phase 5 — Motion:** entrances are IntersectionObserver + CSS transitions with the house curve; ticker crossfade in CSS; framer-motion **removed entirely** (everything used was expressible in CSS, per the brief's own hierarchy — and it bought the performance gate).
- **Phase 6 — QA:** `QA_REPORT.md`. Lighthouse mobile 97/100/100/100, LCP 2.4 s, CLS 0; keyboard pass; contrast math for every pairing; AI-tell and copy-fidelity audits.

Deleted: five animated canvases (particles, prism waves, neural net, constellation, triangle cascade), all glassmorphism, the terminal block, sound toggle, glass tooltip, ambient/glow layers, decorative fake metrics (arc gauges, radar charts, invented percentage bars), marquee loops, custom rAF loop.

## 2. Document precedence (the structural call)

The three source documents conflict. Resolution, argued in `DESIGN_DECISIONS.md` §0: **Site Copy v2 governs all words and information architecture** (it is the newest document, maps 1:1 to the repo, and the execution prompt itself names the copy doc canonical and forbids inventing copy); **the execution prompt's Critical Rules govern design**; **the research report supplies the register**.

## 3. Deviations from the briefs, with justification

1. **Single-page architecture retained; no Work/Writing/Frameworks/About pages, no essay template.** The prompt's publication nav has zero copy behind it; Copy v2 specifies its own single-page nav and CTAs. Building empty publication routes would have meant inventing positioning content, which the prompt forbids. *Deferred until writing content exists.*
2. **Positioning is Copy v2's implementation-first "engineers who consult,"** not the prompt's "not selling code" advisor framing. The words were not mine to change; the warm editorial design carries the educator register.
3. **Signature diagram is the three-practice loop** (Copy v2 §2.9, canonical taxonomy), not the research's five-node journey — the five-node version has no copy.
4. **Copy v2's chip/accent HSL annotations (dark-palette values) were treated as design, not copy,** and remapped: Implementation → terracotta, Strategy → gold, Training → slate (cyan demoted per Critical Rule 3).
5. **Marquee strips render as static mono index lines.** A perpetual scroll loop fails the motion-as-pedagogy rule; the content is preserved verbatim, in the "archival index" register.
6. **Sticky CTA bar and scroll-hint removed**; the nav's persistent "Book a diagnostic" carries that job quietly.
7. **Contact "dropdown" is an accessible button group** (same four options) — it preserves the existing working form wiring and is one fewer interaction pattern.
8. **`--gold` darkened** from the copy-era value to `#8a6415` to pass 4.5:1 (QA finding).
9. **Fonts kept on Google-served files but self-hosted** (downloaded, subset, served from `/fonts`) — satisfies the self-hosting rule.

## 4. [VERIFY] dispositions (action needed before/at publish)

| Item | Shipped as | Action |
|---|---|---|
| Diagnostic free vs paid | Free-but-scarce framing, no price named | Confirm; if paid, name the price in CTAs |
| `50+ teams upskilled` | **Removed sitewide** (owner decision; manifesto stat now "1 business day / First response") | Reintroduce only with a documented count |
| Higher-ed case detail | Kept verbatim | Confirm the engagement isn't identifiable at this detail level |
| LegalTech "zero churn" case | **Cut** (copy doc's own recommendation) | Restore only if the churn claim is substantiated |
| FAQ #8 pricing | Included (copy doc recommends) | Confirm |
| Booking URL | All diagnostic CTAs target the contact form | Swap to a scheduler URL when one exists (one constant in each CTA) |
| Footer email | `hello@codeclarity.ai` on the accessibility page | Confirm the address |

## 5. QA numbers

See `QA_REPORT.md`. Headline: Lighthouse mobile **97 perf / 100 a11y / 100 BP / 100 SEO**, LCP **2.4 s**, CLS **0**, TBT 40 ms; zero console errors; zero AI-tell checklist hits; zero `[COPY NEEDED]` placeholders.

## 6. Punch list (deferred)

- Warm-dark secondary theme — **explicitly deferred by the brief; not built.**
- Essay/article template + Writing index + Frameworks page — deferred until content exists (see deviation 1).
- View Transitions API between routes — deferred; with one marketing page plus one statement page there is no meaningful route pair yet.
- Post-deploy: one-off axe DevTools manual pass; verify fonts/headers caching on Vercel; OG image (none existed before; consider a paper-and-ink card).
- `npm run preview`/`deploy` scripts still reference wrangler (vestigial; deploy is Vercel) — harmless, tidy later.
