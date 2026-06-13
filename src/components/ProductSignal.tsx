import React from 'react'
import { Reveal, SectionHeader, scrollToId } from './shared'

const FEATURES = [
  {
    title: 'Implementation planning',
    body:
      'The right technical approach for your requirements — vendor platform, custom build, or hybrid — evaluated against your infrastructure, security posture, and three-year cost at real headcount. The answer is shaped by your requirements, not by what generates the largest engagement.',
  },
  {
    title: 'Specified for production',
    body:
      'Guardrails, observability, idempotent actions, and an eval suite — written into the acceptance criteria from day one, because "mostly works" is a failure state and "worked in the demo" is not a definition of done.',
  },
  {
    title: 'Integrated, not bolted on',
    body:
      "Your auth, your data boundaries, your existing systems. MIT's research found failed AI pilots were integration failures, not model failures — so integration is where the plan spends its effort.",
  },
  {
    title: 'Scoped to be executed',
    body:
      'Tight scope, visible milestones, acceptance criteria your vendor signs against. Timelines set honestly up front instead of promised optimistically and renegotiated later — then a handover plan: documentation, decision records, and a team that can own what gets built.',
  },
]

/* "Where we sit" — the one diagram that explains the advisory model:
   we're hired by you, independent of the builder, and we hold both
   directions of the work. Edges draw on scroll via the same gated
   CSS animation as the practice loop; fully legible static. */
function WhereWeSit() {
  const arrow = (x2: number, y: number, dir: 1 | -1) =>
    `${x2},${y} ${x2 - 7 * dir},${y - 4} ${x2 - 7 * dir},${y + 4}`

  return (
    <div className="wws">
      <div className="arch-label">
        <span className="kicker">Where we sit</span>
      </div>
      <svg
        className="loop-svg wws-svg"
        viewBox="0 0 600 200"
        role="img"
        aria-label="Diagram of the engagement model: Code and Clarity sits between your team and whoever builds — the decision and training flow to your team, acceptance criteria flow to the builder, and evidence and evaluations flow back."
      >
        {/* your team */}
        <rect className="wws-box" x="20" y="74" width="130" height="52" rx="2" />
        <text className="wws-label" x="85" y="96" textAnchor="middle">Your team</text>
        <text className="wws-sub" x="85" y="112" textAnchor="middle">OWNS THE OUTCOME</text>

        {/* us */}
        <rect className="wws-box wws-box--us" x="235" y="74" width="130" height="52" rx="2" />
        <text className="wws-label" x="300" y="96" textAnchor="middle">Code <tspan className="wws-amp">&amp;</tspan> Clarity</text>
        <text className="wws-sub" x="300" y="112" textAnchor="middle">INDEPENDENT ADVISOR</text>

        {/* the builder */}
        <rect className="wws-box" x="450" y="74" width="130" height="52" rx="2" />
        <text className="wws-label" x="515" y="96" textAnchor="middle">The build</text>
        <text className="wws-sub" x="515" y="112" textAnchor="middle">VENDOR OR IN-HOUSE</text>

        {/* us → your team: the decision & training */}
        <path className="loop-edge" pathLength={1} d="M 235 87 L 158 87" />
        <polygon className="loop-arrow" points={arrow(152, 87, -1)} />
        <path className="loop-flow" pathLength={1} d="M 235 87 L 158 87" style={{ '--flow-color': 'var(--terracotta)', animationDelay: '0s' } as React.CSSProperties} />
        <text className="loop-edge-note" x="195" y="64" textAnchor="middle">decision &amp; training</text>

        {/* your team → us: the problem */}
        <path className="loop-edge" pathLength={1} d="M 150 113 L 227 113" />
        <polygon className="loop-arrow" points={arrow(233, 113, 1)} />
        <path className="loop-flow" pathLength={1} d="M 150 113 L 227 113" style={{ '--flow-color': 'var(--gold)', animationDelay: '-0.9s' } as React.CSSProperties} />
        <text className="loop-edge-note" x="192" y="146" textAnchor="middle">the problem</text>

        {/* us → builder: acceptance criteria */}
        <path className="loop-edge" pathLength={1} d="M 365 87 L 442 87" />
        <polygon className="loop-arrow" points={arrow(448, 87, 1)} />
        <path className="loop-flow" pathLength={1} d="M 365 87 L 442 87" style={{ '--flow-color': 'var(--terracotta)', animationDelay: '-1.8s' } as React.CSSProperties} />
        <text className="loop-edge-note" x="407" y="64" textAnchor="middle">acceptance criteria</text>

        {/* builder → us: evidence & evals */}
        <path className="loop-edge" pathLength={1} d="M 450 113 L 373 113" />
        <polygon className="loop-arrow" points={arrow(367, 113, -1)} />
        <path className="loop-flow" pathLength={1} d="M 450 113 L 373 113" style={{ '--flow-color': 'var(--gold)', animationDelay: '-2.7s' } as React.CSSProperties} />
        <text className="loop-edge-note" x="410" y="146" textAnchor="middle">evidence &amp; evals</text>
      </svg>
      {/* Stacked variant for narrow screens — the SVG's labels render
          below legible size on phones, so the layout changes, not the scale. */}
      <div
        className="wws-stack"
        role="img"
        aria-label="Diagram of the engagement model: Code and Clarity sits between your team and whoever builds — the decision and training flow to your team, acceptance criteria flow to the builder, and evidence and evaluations flow back."
      >
        <div className="wws-m-box">
          <span className="wws-m-name">Your team</span>
          <span className="wws-m-sub">Owns the outcome</span>
        </div>
        <div className="wws-m-flow">
          <span>the problem ↓</span>
          <span>↑ decision &amp; training</span>
        </div>
        <div className="wws-m-box wws-m-box--us">
          <span className="wws-m-name">Code <span className="amp">&amp;</span> Clarity</span>
          <span className="wws-m-sub">Independent advisor</span>
        </div>
        <div className="wws-m-flow">
          <span>acceptance criteria ↓</span>
          <span>↑ evidence &amp; evals</span>
        </div>
        <div className="wws-m-box">
          <span className="wws-m-name">The build</span>
          <span className="wws-m-sub">Vendor or in-house</span>
        </div>
      </div>
      <p className="wws-caption">
        We sit on your side of the table — hired by you, independent of every vendor.
      </p>
    </div>
  )
}

const ARCH = [
  { name: 'Client Interface', sub: 'Web / Mobile · Integration with existing systems', accent: 'var(--terracotta)' },
  { name: 'API Gateway', sub: 'Auth · Rate-limit · Observability · Monitoring', accent: 'var(--gold)' },
  { name: 'LLM Orchestration', sub: 'RAG · Agents · Guardrails · Vendor or custom', accent: 'var(--slate)' },
  { name: 'Data Layer', sub: 'Vector DB · Structured store · Your infrastructure', accent: 'var(--terracotta)' },
]

export default function ProductSignal() {
  return (
    <section id="section-product" className="section section--deep" aria-label="AI implementation strategy">
      <div className="section-content">
        <SectionHeader
          kicker="AI Implementation Strategy"
          title="The demo is easy."
          em="Production is the job."
          lead="Anyone can make a model look good for eight minutes in a boardroom. We plan for the Tuesday afternoon eighteen months from now when the person who configured it has left — and we write the standard your implementation is held to."
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

        <Reveal style={{ marginTop: 'clamp(2.8rem, 5vw, 4rem)' }}>
          <WhereWeSit />
        </Reveal>

        <Reveal className="arch-stack">
          <div className="arch-label">
            <span className="kicker">Typical reference architecture</span>
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
            Plan the implementation →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
