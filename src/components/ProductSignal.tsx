import React from 'react'
import { Reveal, SectionHeader, scrollToId } from './shared'

const FEATURES = [
  {
    title: 'Implementation planning',
    body:
      'The right technical approach for your requirements — vendor platform, selective custom build, or hybrid — evaluated against your infrastructure, security posture, and three-year cost at real headcount. The answer is shaped by your requirements, not by what generates the largest build.',
  },
  {
    title: 'Production-grade by default',
    body:
      'Idempotent actions, guardrails, observability, and an eval suite from day one. Built for real traffic and real edge cases, because "worked in the demo" is not an acceptance criterion.',
  },
  {
    title: 'Integrated, not bolted on',
    body:
      "Your auth, your data boundaries, your existing systems. MIT's research found failed AI pilots were integration failures, not model failures — so integration is where we spend the effort.",
  },
  {
    title: 'Scoped to ship',
    body:
      'Tight scopes, visible milestones, working software early. Timelines agreed honestly up front instead of promised optimistically and renegotiated later — then complete handover: documentation, runbooks, and a team that can run it without us.',
  },
]

const LEDGER = [
  {
    demo: 'Impresses a board with hardcoded data',
    product: 'Runs on your real infrastructure with your real data',
  },
  {
    demo: 'Works when you script the questions',
    product: 'Evaluated against your requirements, with an eval suite to prove it',
  },
  {
    demo: 'Abandoned three weeks after launch',
    product: 'Designed around the workflow it lives inside',
  },
  {
    demo: 'Configured by consultants who leave',
    product: 'Handed over with docs, runbooks, and a trained team',
  },
]

const ARCH = [
  { name: 'Client Interface', sub: 'Web / Mobile · Integration with existing systems', accent: 'var(--terracotta)' },
  { name: 'API Gateway', sub: 'Auth · Rate-limit · Observability · Monitoring', accent: 'var(--gold)' },
  { name: 'LLM Orchestration', sub: 'RAG · Agents · Guardrails · Vendor or custom', accent: 'var(--slate)' },
  { name: 'Data Layer', sub: 'Vector DB · Structured store · Your infrastructure', accent: 'var(--terracotta)' },
]

export default function ProductSignal() {
  return (
    <section id="section-product" className="section" aria-label="AI implementation">
      <div className="section-content">
        <SectionHeader
          kicker="AI Implementation"
          title="The demo is easy."
          em="Production is the job."
          lead="Anyone can make a model look good for eight minutes in a boardroom. We build for the Tuesday afternoon eighteen months from now when the person who configured it has left."
        />

        <Reveal className="feature-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-block" key={f.title}>
              <span className="feature-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="ledger">
          <div className="ledger-head">
            <span className="ledger-col-label ledger-col-label--demo">The demo</span>
            <span className="ledger-col-label ledger-col-label--product">The product</span>
          </div>
          {LEDGER.map(row => (
            <div className="ledger-row" key={row.demo}>
              <div className="ledger-cell ledger-cell--demo">
                <span className="mark" aria-hidden="true">✕</span>
                <span>{row.demo}</span>
              </div>
              <div className="ledger-cell ledger-cell--product">
                <span className="mark" aria-hidden="true">✓</span>
                <span>{row.product}</span>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="arch-stack">
          <div className="arch-label">
            <span className="kicker">Typical custom implementation architecture</span>
          </div>
          {ARCH.map((l, i) => (
            <div className="arch-layer" key={l.name} style={{ '--layer-accent': l.accent } as React.CSSProperties}>
              <span className="arch-layer-name">{i + 1}. {l.name}</span>
              <span className="arch-layer-sub">{l.sub}</span>
            </div>
          ))}
        </Reveal>

        <Reveal style={{ textAlign: 'center', marginTop: '3rem' }}>
          <a href="#section-contact" className="btn btn--primary" onClick={scrollToId('section-contact')}>
            Scope the build →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
