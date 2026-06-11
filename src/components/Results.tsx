import React from 'react'
import { Reveal, SectionHeader } from './shared'

const METRICS = [
  { num: '10+', label: 'Years across engineering, technical training & editorial' },
  { num: '0', label: 'Handoffs between strategy and build' },
  { num: '100%', label: 'IP and work owned by clients' },
  { num: '1 business day', label: 'First response' },
]

const CASES = [
  {
    sector: 'Fintech · Series C',
    outcome:
      'Document review pipeline, end-to-end RAG. Scoped, built, and running in production before the quarter closed — with a measurable cut in legal review time and an eval suite the team still runs on every release.',
    meta: 'AI Implementation · Pilot Build',
  },
  {
    sector: 'Higher Education · Private University',
    outcome:
      'Comprehensive AI platform assessment across every major vendor category. Three-year TCO modeling at real headcount showed a several-fold spread between deployment models for identical use cases; the recommended platform served all four university constituencies inside FERPA boundaries. One engagement, one decision.',
    meta: 'AI Strategy · Audit & Vendor Evaluation',
  },
  {
    sector: 'Professional Services · Enterprise',
    outcome:
      'AI governance framework and EU AI Act readiness delivered ahead of the regulatory deadline. The board had a defensible, auditable policy position before competitors finished drafting theirs.',
    meta: 'AI Governance · Policy',
  },
  {
    sector: 'HealthTech · Growth Stage',
    outcome:
      'Engineering team went from no AI capability to running agentic workflows in production across two intensive days — working output at the end of each session, still in daily use six months later.',
    meta: 'AI Training · Technical Track',
  },
]

export default function Results() {
  return (
    <section id="section-results" className="section section--deep" aria-label="Selected engagements">
      <div className="section-content">
        <SectionHeader
          kicker="Selected engagements"
          title="What we build,"
          em="ship & hand over"
          lead="Selected engagements. Anonymized because our contracts are, not because the results need to be."
        />

        <Reveal className="results-metrics">
          {METRICS.map(m => (
            <div className="mstat" key={m.label}>
              <span className="mstat-num">{m.num}</span>
              <span className="mstat-label">{m.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="case-grid">
          {CASES.map((c, i) => (
            <Reveal key={c.sector} delay={0.05 * i} className="case-card">
              <span className="case-sector">{c.sector}</span>
              <p className="case-outcome">{c.outcome}</p>
              <span className="case-meta">{c.meta}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
