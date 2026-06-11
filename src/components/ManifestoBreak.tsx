import React from 'react'
import { Reveal } from './shared'

const STATS = [
  { num: '10+', label: 'Years across engineering, technical training & editorial' },
  { num: '50+', label: 'Teams upskilled' },
  { num: '100%', label: 'Work and IP owned by you' },
]

const CHIPS = [
  { label: 'AI Implementation', accent: 'var(--terracotta)' },
  { label: 'Strategy, Audits & Governance', accent: 'var(--gold)' },
  { label: 'Training & Capability', accent: 'var(--slate)' },
]

const INDEX_1 = [
  'Production LLM Systems', 'RAG Architecture', 'Agentic Pipelines',
  'Vendor Integration', 'Scoped Builds', 'Full Handover',
]
const INDEX_2 = [
  'Strategic Assessment', 'TCO Modeling', 'EU AI Act Compliance',
  'Governance for Systems That Act', 'Capability Building', 'Knowledge Transfer',
]

function IndexLine({ items }: { items: string[] }) {
  return (
    <p className="index-strip">
      {items.map((c, i) => (
        <React.Fragment key={c}>
          {i > 0 && <span className="dot" aria-hidden="true">·</span>}
          <span>{c}</span>
        </React.Fragment>
      ))}
    </p>
  )
}

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
            engineering. We name trade-offs out loud, we put our recommendations in production,
            and we&rsquo;d rather lose an engagement by being honest about fit than win one
            with a deck.
          </blockquote>
        </Reveal>

        <Reveal delay={0.1} className="manifesto-stats">
          {STATS.map(s => (
            <div className="mstat" key={s.label}>
              <span className="mstat-num">{s.num}</span>
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
          <div className="manifesto-index">
            <IndexLine items={INDEX_1} />
            <IndexLine items={INDEX_2} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
