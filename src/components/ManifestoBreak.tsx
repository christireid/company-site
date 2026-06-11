import React from 'react'
import { Reveal } from './shared'

const STATS = [
  { num: '10+', label: 'Years across engineering, technical training & editorial' },
  { num: '100%', label: 'Work and IP owned by you' },
  { num: '1 business day', label: 'First response' },
]

const CHIPS = [
  { label: 'AI Implementation Strategy', accent: 'var(--terracotta)' },
  { label: 'Audits & Governance', accent: 'var(--gold)' },
  { label: 'Training & Capability', accent: 'var(--slate)' },
]

export default function ManifestoBreak() {
  return (
    <section id="section-manifesto" className="section section--deep" aria-label="Why we exist">
      <div className="section-content">
        <Reveal>
          <span className="kicker">Why we exist</span>
        </Reveal>
        <Reveal delay={0.08}>
          <blockquote className="manifesto-quote" style={{ marginTop: '1.6rem' }}>
            We started Code &amp; Clarity because AI consulting was built backwards: strategy
            people who never deployed anything, advising engineering teams on deployment.
            We&rsquo;re <em>engineers who consult</em> — not consultants who learned about
            engineering. We name trade-offs out loud, we only recommend what we could build
            ourselves, and we&rsquo;d rather lose an engagement by being honest about fit than
            win one with a deck.
          </blockquote>
        </Reveal>

        <Reveal delay={0.1} className="manifesto-stats">
          {STATS.map(s => (
            <div className="mstat" key={s.label}>
              <span className={`mstat-num ${s.num.length > 6 ? 'mstat-num--long' : ''}`}>{s.num}</span>
              <span className="mstat-label">{s.label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.12}>
          <div className="practice-chips">
            {CHIPS.map(c => (
              <span className="practice-chip" key={c.label} style={{ '--chip-accent': c.accent } as React.CSSProperties}>
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
