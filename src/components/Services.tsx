import React from 'react'
import { Reveal, SectionHeader, scrollToId } from './shared'

const SERVICES = [
  {
    id: 'implementation',
    num: '01',
    title: 'AI Implementation Strategy',
    headline: 'The decision everything else depends on.',
    insight:
      "MIT's enterprise research found AI tools built with external partners succeed roughly twice as often as internal builds — and that the failures were integration failures, not model failures. The gap between a board-ready demo and a system people rely on daily is where most AI budgets go to die. Which platform, which partner, and what scope are the decisions that determine which side of that gap you land on.",
    body:
      "We turn \"we should do something with AI\" into a plan your team or vendor can execute: requirements defined against your actual systems, vendor platform versus custom build versus hybrid recommended on fit and three-year cost at real headcount, a reference architecture for your environment, and acceptance criteria precise enough to hold whoever builds it accountable — guardrails, observability, and an eval suite written into the definition of done. We don't take the build, so the recommendation has nothing to sell but the answer — and we'll happily recommend the smaller scope when it's the right one.",
    deliverables: [
      'Implementation roadmap & scope definition', 'Requirements & readiness assessment',
      'Vendor evaluation & selection', 'Build vs buy recommendation',
      'Reference architecture & system design', 'Pilot & evaluation design',
      'Acceptance criteria & vendor oversight', 'Complete knowledge transfer',
    ],
    cta: 'Plan the implementation →',
    accent: 'var(--terracotta)',
    folioInk: 'var(--terracotta-ink)',
  },
  {
    id: 'governance',
    num: '02',
    title: 'AI Audits & Governance',
    headline: 'A decision, not a deck.',
    insight:
      "McKinsey tested 25 organizational attributes against AI's bottom-line impact. The strongest predictor wasn't budget or model choice — it was whether the company redesigned its workflows. Yet one in six organizations still has no C-level owner for AI. Most strategy engagements never touch either fact.",
    body:
      "We audit what you actually have — codebase, contracts, workflows, data boundaries — and tell you where AI creates specific value and where it doesn't. Vendor evaluation modeled on three-year TCO at your real headcount, not the demo price — in past assessments, the spread between deployment models has run to multiples for identical use cases. Governance written for systems that act, not just systems that answer, mapped to the EU AI Act before the regulator asks. The roadmap is precise enough to execute without us.",
    deliverables: [
      'AI readiness audit', 'Vendor evaluation & TCO modeling', 'Build vs buy analysis',
      'Governance & compliance framework', 'EU AI Act regulatory mapping', 'Risk assessment & guardrails',
      'Executable roadmap', 'Executive knowledge transfer',
    ],
    cta: 'Get a straight answer →',
    accent: 'var(--gold)',
    folioInk: 'var(--gold)',
  },
  {
    id: 'training',
    num: '03',
    title: 'AI Training & Capability',
    headline: 'Still in use six months later.',
    insight:
      'Companies raised AI tool spending 23% in late 2025 while cutting AI training budgets 18% — yet organizations with mature AI literacy programs are nearly twice as likely to see significant ROI. Software nobody knows how to use is shelfware with a subscription fee. Most training fails because it transfers information instead of building behavior.',
    body:
      "Programs designed around your team's real work, real tools, and real feedback loops — built by engineers who use these tools daily and have spent years designing developer education that stuck. Your people leave using AI in their actual workflows, with the judgment to know when not to. The capability belongs to the institution, not to the individual who happened to attend.",
    deliverables: [
      'Custom curriculum design', 'Live workshops (half-day to multi-day)', 'Self-paced learning systems',
      'LLM & AI tool training', 'Workflow design & optimization', 'Assessment & competency frameworks',
      'Institutional knowledge capture', 'Mentoring & coaching programs',
    ],
    cta: 'Build capability that sticks →',
    accent: 'var(--slate)',
    folioInk: 'var(--slate)',
  },
]

export default function Services() {
  return (
    <section id="section-services" className="section" aria-label="Services">
      <div className="section-content">
        <SectionHeader
          kicker="Three practices"
          title="What we do."
          em="What you get."
          lead="The implementation plan keeps the strategy honest. The strategy makes the training relevant. The training makes the plan survivable after we leave. One practice — because the handoff between three separate vendors is where AI initiatives actually die."
        />

        {SERVICES.map((svc, i) => (
          <Reveal
            key={svc.id}
            delay={0.05 * i}
            className="chapter"
            style={{ '--chapter-accent': svc.accent, '--chapter-folio-ink': svc.folioInk } as React.CSSProperties}
          >
            <div>
              <span className="chapter-folio">{svc.num} — Practice</span>
              <h3 className="chapter-title">{svc.title}</h3>
              <p className="chapter-headline">{svc.headline}</p>
              <a href="#section-contact" className="link-quiet chapter-cta" onClick={scrollToId('section-contact')}>
                {svc.cta}
              </a>
            </div>
            <div>
              <p className="chapter-insight">{svc.insight}</p>
              <p className="chapter-body">{svc.body}</p>
              <div className="chapter-deliverables">
                <div className="chapter-deliverables-label">What you get</div>
                <ul className="deliverable-list">
                  {svc.deliverables.map(d => <li key={d}>{d}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
