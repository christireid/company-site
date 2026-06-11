import React from 'react'
import { Reveal, SectionHeader, scrollToId } from './shared'

const STEPS = [
  {
    title: 'A straight answer first',
    body:
      "A 45-minute diagnostic. You bring the problem; we tell you honestly whether we can help, what the engagement would produce, and what it costs — including the cases where the honest answer is that you don't need us yet.",
  },
  {
    title: 'Scope agreed in writing',
    body:
      'Deliverables, timeline, acceptance criteria, and pricing locked in writing before the first billable hour — fixed-scope or hourly, whichever fits the work. Scope changes require a new agreement. No ambiguity, no surprises.',
  },
  {
    title: 'Progress you can see weekly',
    body:
      'Working output every week — running code, written decisions, draft frameworks — not a status deck. Redirect any week you like.',
  },
  {
    title: 'Handover built in from day one',
    body:
      "The engagement closes when your team can operate and extend the work without us. Code written to be read. Docs written for the people who'll maintain them. If you still need us afterward, we didn't finish.",
  },
]

export default function Process() {
  return (
    <section id="section-process" className="section" aria-label="How we work">
      <div className="section-content">
        <SectionHeader kicker="How we work" title="No surprises." em="No open endings." />

        <div className="process-steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={0.04 * i} className="process-step">
              <div>
                <span className="step-folio">{String(i + 1).padStart(2, '0')} — Step</span>
                <h3 className="step-title">{s.title}</h3>
              </div>
              <p className="step-body">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="process-cta">
          <p className="process-cta-text">
            Every engagement starts with a 45-minute diagnostic — whether you need a build,
            an audit, a training program, or you&rsquo;re still working out which.
          </p>
          <a href="#section-contact" className="btn btn--primary" onClick={scrollToId('section-contact')}>
            Book the diagnostic →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
