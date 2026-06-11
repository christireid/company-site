import React from 'react'
import { Reveal, SectionHeader } from './shared'

const FAQS = [
  {
    q: 'Who is this for?',
    a: 'Mid-market SaaS companies, universities, and PE-backed portfolios with a real AI decision in front of them — not a vague mandate to "explore AI." If you know what you need, we\'ll scope it in the first call. If you don\'t, the diagnostic exists to figure that out.',
  },
  {
    q: "Who shouldn't hire you?",
    a: "Three honest cases. If your board needs a Big Four logo on the deck for political cover, buy the logo — we can't provide it. If you need a $5K chatbot configured, a freelancer is the right answer and we'll say so. And if you want a strategy document with no intention of acting on it, we're a bad fit on purpose: every engagement we take is designed to end in something that runs — even though we won't be the ones typing the code.",
  },
  {
    q: 'What does a typical engagement look like?',
    a: "It starts with a 45-minute diagnostic, not a pitch. Audits and strategy run a few weeks and end in an executable decision. Training programs are built around your team's actual tools. Implementation strategy runs to a clearly defined scope with weekly working output. All three combine when the problem calls for it.",
  },
  {
    q: 'How are you different from a traditional AI consultancy?',
    a: "Accountability. Traditional firms separate the people who write the strategy from the people who understand execution — which is how you get LLM architecture recommendations from people who've never shipped one. Here the recommendation comes from engineers who have built and run these systems, and it arrives with the acceptance criteria to hold whoever builds yours accountable. MIT's enterprise research found external implementation partners succeed roughly twice as often as internal builds; choosing that partner well is precisely the decision we're hired for.",
  },
  {
    q: "What's the training approach?",
    a: "Programs grounded in how skills actually form: real problems, real feedback, real output — your workflows, not a vendor's sample dataset. Years of designing developer education taught us that information transfer doesn't produce capability. Application does.",
  },
  {
    q: "What's your approach to implementation?",
    a: "We plan it; we don't build it. Vendor platform, custom build, or hybrid — recommended on your requirements and three-year cost of ownership, with a reference architecture for your environment and acceptance criteria precise enough to hold your vendor or internal team to. We stay through the build as your independent reviewer if you want us to, and the handover is complete: decisions, documentation, and a team that knows why every choice was made.",
  },
  {
    q: 'What does working with you look like day to day?',
    a: "Scope in writing before anything starts. Working output every week. At close: decisions that hold, documentation written for the people who'll execute them, and a knowledge transfer session. You should be able to act on everything without us — that's the definition of done.",
  },
  {
    q: 'What does it cost?',
    a: 'Every engagement is scoped and priced in writing before work begins — fixed-scope where the work is well-defined, hourly where flexibility serves you better. The diagnostic comes first precisely so we can price the actual problem instead of padding for the unknown. Either way: no surprise change orders.',
  },
]

export default function FAQ() {
  return (
    <section id="section-faq" className="section section--deep" aria-label="Frequently asked questions">
      <div className="section-content">
        <SectionHeader kicker="Questions" title="The things people" em="actually ask." />

        <Reveal className="faq-list">
          {FAQS.map(item => (
            <details className="faq-item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-marker" aria-hidden="true" />
              </summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
