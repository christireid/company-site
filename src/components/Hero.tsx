import React, { useEffect, useState } from 'react'
import { Reveal, scrollToId } from './shared'

const PROBLEMS = [
  'Six-figure strategy engagement. Eighty slides. No decision.',
  'Pilot demoed beautifully. Production never happened.',
  'Training finished Friday. Old workflows back by Monday.',
  'Roadmap written by people who have never shipped a model.',
  'Governance drafted after the regulator asked.',
  'Per-seat AI pricing that punishes successful adoption.',
]

/* Cycling ticker — runs through all six lines once, then stops on the
   last (WCAG 2.2.2: auto-updating content must not run indefinitely
   without a pause control). Static first line under reduced motion.
   Not a live region: the lines are rhetorical, not status updates. */
function ProblemTicker() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) { setPaused(true); return }
    const cycle = setInterval(() => {
      setIdx(i => {
        if (i + 1 >= PROBLEMS.length - 1) clearInterval(cycle)
        return Math.min(i + 1, PROBLEMS.length - 1)
      })
    }, 5200)
    return () => clearInterval(cycle)
  }, [])

  return (
    <div className="ticker">
      <span className="ticker-label">Sound familiar?</span>
      {paused ? (
        <span className="ticker-line">{PROBLEMS[0]}</span>
      ) : (
        <span key={idx} className="ticker-line ticker-line--cycling">
          {PROBLEMS[idx]}
        </span>
      )}
    </div>
  )
}

const PILLARS = [
  { name: 'AI Implementation Strategy', sub: 'Vendor, scope, architecture — decided.', accent: 'var(--terracotta-ink)' },
  { name: 'Audits & Governance', sub: 'A decision, not a deck.', accent: 'var(--gold)' },
  { name: 'Training & Capability', sub: 'Still in use six months later.', accent: 'var(--slate)' },
]

const CAPABILITIES = [
  'Implementation Strategy', 'Vendor Evaluation', 'Build vs Buy Analysis', 'Reference Architecture',
  'Pilot & Eval Design', 'TCO Modeling', 'Strategic Assessment', 'AI Governance & Policy',
  'EU AI Act Compliance', 'Vendor Oversight', 'Capability Building', 'Knowledge Transfer',
]

export default function Hero() {
  return (
    <section id="section-hero" className="hero" aria-label="Introduction">
      <div className="hero-grid">
        <div>
          <Reveal>
            <span className="kicker">
              Code <span className="amp">&amp;</span> Clarity
            </span>
            <h1 className="hero-headline">
              Most AI pilots die between the strategy
              <em> and the build. We were built for that gap.</em>
            </h1>
            <p className="hero-sub">
              Implementation strategy, audits, governance, and training — from a team with 10+
              years across engineering, technical training, and editorial. We shipped before we
              consulted.
            </p>
            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Accepting new engagements — limited capacity</span>
            </div>
            <div className="hero-actions">
              <a href="#section-contact" className="btn btn--primary" onClick={scrollToId('section-contact')}>
                Book a 45-minute diagnostic →
              </a>
              <a href="#section-process" className="link-quiet" onClick={scrollToId('section-process')}>
                See how we work ›
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="hero-aside">
          <p className="hero-tagline">
            MIT&rsquo;s enterprise research found AI tools built with{' '}
            <strong>external partners succeed roughly twice as often</strong> as internal builds.
            Which platform, which partner, what scope, at what three-year cost — those decisions
            determine the outcome, and they&rsquo;re our whole job. Independent implementation
            strategy for mid-market SaaS companies, universities, and PE-backed portfolios:
            vendor platform, custom build, or hybrid, recommended on fit and total cost of
            ownership — not on what&rsquo;s easiest to sell.
          </p>
          <ProblemTicker />
        </Reveal>
      </div>

      <Reveal delay={0.18} className="hero-pillars">
        {PILLARS.map((p, i) => (
          <div className="pillar" key={p.name} style={{ '--pillar-accent': p.accent } as React.CSSProperties}>
            <span className="pillar-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="pillar-name">{p.name}</span>
            <span className="pillar-sub">{p.sub}</span>
          </div>
        ))}
      </Reveal>

      <div className="hero-index">
        <p className="index-strip" aria-label="Capabilities">
          {CAPABILITIES.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <span className="dot" aria-hidden="true">·</span>}
              <span>{c}</span>
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
