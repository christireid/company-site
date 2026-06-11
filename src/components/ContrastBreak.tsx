import React from 'react'
import { Reveal, SectionHeader, scrollToId } from './shared'

const PAIRS = [
  {
    demo: 'Six-figure strategy engagement ends in eighty slides and no decision',
    product: 'Problem defined, approach priced, decision made — on a timeline agreed up front',
  },
  {
    demo: 'Pilot impresses the board, teaches nothing, scales to nothing',
    product: 'Pilot designed to answer one specific question before you commit real budget',
  },
  {
    demo: 'Training completed, certificates issued, old habits back by Monday',
    product: 'Capability your team still uses six months after we leave',
  },
  {
    demo: 'Three vendors, four frameworks, zero accountability in the handoffs',
    product: 'One practice: strategy, training, and implementation planning in the same room',
  },
  {
    demo: 'Governance written after the regulator asked',
    product: 'A defensible, auditable position before the regulation requires one',
  },
  {
    demo: 'Vendor picked on the demo price; the per-seat bill arrives at scale',
    product: 'Three-year TCO modeled at your real headcount before you sign',
  },
  {
    demo: 'Software delivered; the ability to run it leaves with the consultants',
    product: 'A plan, the criteria to hold your vendor to, and a team trained to own what gets built',
  },
]

export default function ContrastBreak() {
  return (
    <section id="section-contrast" className="section section--deep" aria-label="Two ways this ends">
      <div className="section-content">
        <SectionHeader kicker="Two ways this ends." title="Which one" em="is yours right now?" />

        <Reveal
          className="ledger"
          style={{ marginTop: 0, '--label-demo': '"The industry default"', '--label-product': '"With Code & Clarity"' } as React.CSSProperties}
        >
          <div className="ledger-head">
            <span className="ledger-col-label ledger-col-label--demo">The industry default</span>
            <span className="ledger-col-label ledger-col-label--product">With Code &amp; Clarity</span>
          </div>
          {PAIRS.map(row => (
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

        <Reveal style={{ marginTop: '2.8rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.6rem' }}>
          <p className="contrast-cta-line">If the right column is where you want to be:</p>
          <a href="#section-contact" className="btn btn--primary" onClick={scrollToId('section-contact')}>
            Book a 45-minute diagnostic →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
