import React, { useRef, useState } from 'react'
import { Reveal, SectionHeader } from './shared'

/* ─────────────────────────────────────────────────────────────────
   The signature moment: a self-explaining diagram of the practice
   loop. Inline SVG; edges draw on scroll via CSS scroll-driven
   animation (gated in globals.css); fully legible static without it.
   Nodes are real buttons: large invisible hit circles (WCAG 2.5.8),
   keyboard operable, and activation spotlights the matching card.
───────────────────────────────────────────────────────────────── */

type PracticeId = 'implementation' | 'governance' | 'training'

const NODES: { id: PracticeId; label: string; x: number; y: number; accent: string; accentInk: string; labelY: number }[] = [
  { id: 'implementation', label: 'Implementation Strategy', x: 210, y: 64, accent: 'var(--terracotta)', accentInk: 'var(--terracotta-ink)', labelY: 30 },
  { id: 'governance', label: 'Audits & Governance', x: 346, y: 272, accent: 'var(--gold)', accentInk: 'var(--gold)', labelY: 308 },
  { id: 'training', label: 'Training', x: 74, y: 272, accent: 'var(--slate)', accentInk: 'var(--slate)', labelY: 308 },
]

/* Cycle: Implementation Strategy → Audits & Governance → Training → … */
const EDGES: [PracticeId, PracticeId][] = [
  ['implementation', 'governance'],
  ['governance', 'training'],
  ['training', 'implementation'],
]

const CARDS: { id: PracticeId; name: string; body: string; accent: string }[] = [
  {
    id: 'implementation',
    name: 'Implementation Strategy',
    body: 'The plan is the lie detector. A recommendation means more when it comes from people who have shipped — and who write acceptance criteria your vendor has to meet.',
    accent: 'var(--terracotta)',
  },
  {
    id: 'governance',
    name: 'Audits & Governance',
    body: "The audit reads your codebase, not just your org chart. Recommendations get tested against what's actually buildable in your environment.",
    accent: 'var(--gold)',
  },
  {
    id: 'training',
    name: 'Training & Capability',
    body: "Training designed by the people who specified the system — around the workflows it actually changes, not a vendor's sample dataset.",
    accent: 'var(--slate)',
  },
]

const NOTES = [
  { from: 'Strategy', to: 'Training', note: 'turns the plan into capability' },
  { from: 'Training', to: 'Implementation', note: 'turns capability into product' },
  { from: 'Implementation', to: 'Strategy', note: 'turns product back into insight' },
]

const R = 13 // visible node radius
const HIT_R = 30 // invisible hit-target radius (≥ 24px target size)
const GAP = 22 // edge offset from node center

function LoopDiagram({ active, onToggle }: { active: PracticeId | null; onToggle: (id: PracticeId) => void }) {
  const byId = Object.fromEntries(NODES.map(n => [n.id, n])) as Record<PracticeId, (typeof NODES)[0]>

  return (
    <div className="loop-svg-wrap">
      <svg
        className="loop-svg"
        viewBox="0 0 420 330"
        role="group"
        aria-label="The practice loop: implementation strategy, audits and governance, and training feed one another in a continuous cycle. Each node is a button that highlights its practice."
      >
        {EDGES.map(([fromId, toId], i) => {
          const a = byId[fromId], b = byId[toId]
          const dx = b.x - a.x, dy = b.y - a.y
          const len = Math.hypot(dx, dy)
          const ux = dx / len, uy = dy / len
          const x1 = a.x + ux * GAP, y1 = a.y + uy * GAP
          const x2 = b.x - ux * GAP, y2 = b.y - uy * GAP
          // arrowhead just before the target node
          const tipX = x2, tipY = y2
          const px = -uy, py = ux
          const b1x = tipX - ux * 8 + px * 4.5, b1y = tipY - uy * 8 + py * 4.5
          const b2x = tipX - ux * 8 - px * 4.5, b2y = tipY - uy * 8 - py * 4.5
          const d = `M ${x1} ${y1} L ${x2} ${y2}`
          return (
            <g key={`${fromId}-${toId}`}>
              <path className="loop-edge" pathLength={1} d={d} />
              <polygon className="loop-arrow" points={`${tipX},${tipY} ${b1x},${b1y} ${b2x},${b2y}`} />
              <path
                className="loop-flow"
                pathLength={1}
                d={d}
                style={{ '--flow-color': a.accent, animationDelay: `${i * -1.2}s` } as React.CSSProperties}
              />
            </g>
          )
        })}

        {NODES.map(n => (
          <g
            key={n.id}
            className={`loop-node-btn ${active === n.id ? 'is-active' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={active === n.id}
            aria-label={`${n.label} — highlight this practice`}
            onClick={() => onToggle(n.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggle(n.id)
              }
            }}
          >
            {/* invisible hit target — keeps the whole node area clickable */}
            <circle className="loop-node-hit" cx={n.x} cy={n.y} r={HIT_R} />
            <circle className="loop-node-ring" cx={n.x} cy={n.y} r={R} style={{ stroke: n.accent }} />
            <circle cx={n.x} cy={n.y} r={4} style={{ fill: n.accent }} />
            <text
              className="loop-node-label"
              x={n.x}
              y={n.labelY}
              textAnchor="middle"
              style={active === n.id ? { fill: n.accentInk } : undefined}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="loop-hint" aria-hidden="true">Select a practice</p>
    </div>
  )
}

export default function TransformZones() {
  const [active, setActive] = useState<PracticeId | null>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const toggle = (id: PracticeId) => {
    setActive(cur => {
      const next = cur === id ? null : id
      // Bring the spotlit card into view if it's off-screen — the
      // interaction's feedback must be visible to mean anything.
      if (next && cardsRef.current) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        cardsRef.current
          .querySelector(`#practice-card-${next}`)
          ?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
      }
      return next
    })
  }

  return (
    <section id="section-transform" className="section" aria-label="Why one practice">
      <div className="section-content">
        <SectionHeader
          kicker="Why one practice"
          title="Three disciplines."
          em="One integrated practice."
          lead="The standard model splits AI work across a strategy firm, a training vendor, and an implementation shop — then loses the project in the handoffs between them. We run all three disciplines in the same room, so nothing survives by staying vague."
        />

        <div className="loop-row">
          <Reveal>
            <LoopDiagram active={active} onToggle={toggle} />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="loop-explainer-lead">
              When the same people define the strategy, run the training, and specify the build,
              the work checks itself. The strategy informs the training. The training shapes
              what gets built. The build reveals what the strategy missed.
            </p>
            <ul className="loop-notes">
              {NOTES.map(n => (
                <li key={`${n.from}-${n.to}`}>
                  <span className="ln-pair">{n.from}</span>
                  <span className="ln-arrow" aria-hidden="true">→</span>
                  <span className="ln-pair">{n.to}</span>
                  <span>{n.note}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="loop-cards" ref={cardsRef}>
          {CARDS.map((c, i) => (
            <Reveal
              key={c.id}
              delay={0.05 * i}
              className={`loop-card ${active === c.id ? 'spotlit' : ''}`}
              style={{ '--card-accent': c.accent } as React.CSSProperties}
            >
              <div id={`practice-card-${c.id}`}>
                <span className="loop-card-name">{c.name}</span>
                <p className="loop-card-body">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
