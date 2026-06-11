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

/* Cycling ticker — copy device kept from v1. Static first line under
   prefers-reduced-motion. */
function ProblemTicker() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) { setPaused(true); return }
    const cycle = setInterval(() => setIdx(i => (i + 1) % PROBLEMS.length), 5200)
    return () => clearInterval(cycle)
  }, [])

  return (
    <div className="ticker" aria-live="polite">
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
  { name: 'AI Implementation', sub: 'Production code. Full handover.', accent: 'var(--terracotta-ink)' },
  { name: 'Strategy, Audits & Governance', sub: 'A decision, not a deck.', accent: 'var(--gold)' },
  { name: 'Training & Capability', sub: 'Still in use six months later.', accent: 'var(--slate)' },
]

const CAPABILITIES = [
  'Strategic Implementation', 'LLM Integration', 'RAG Systems', 'Agentic Pipelines',
  'Production Deployment', 'Strategic Assessment', 'Vendor Evaluation', 'Build vs Buy Analysis',
  'AI Governance & Policy', 'EU AI Act Compliance', 'TCO Modeling', 'Capability Building',
  'Knowledge Transfer',
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
              Implementation, strategy, governance, and training — from a team with 10+ years
              across engineering, technical training, and editorial. We shipped before we consulted.
            </p>
            <div className="hero-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Accepting new engagements — limited capacity</span>
            </div>
            <div className="hero-actions">
              <a href="#section-contact" className="btn btn--primary" onClick={scrollToId('section-contact')}>
                Book a 45-minute diagnostic →
              </a>
              <a href="#section-transform" className="link-quiet" onClick={scrollToId('section-transform')}>
                See how we work ›
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="hero-aside">
          <p className="hero-tagline">
            MIT&rsquo;s enterprise research found AI tools built with{' '}
            <strong>external partners succeed roughly twice as often</strong> as internal builds.
            We&rsquo;re the external partner that writes the production code — for mid-market SaaS
            companies, universities, and PE-backed portfolios. Vendor platform, custom build, or
            hybrid: chosen on fit and total cost of ownership, not on what&rsquo;s easiest to sell.
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
