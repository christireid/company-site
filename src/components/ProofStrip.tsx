import React from 'react'

const FACTS = [
  '10+ years across engineering, technical training & editorial',
  '50+ teams upskilled',
  '100% of IP stays with you',
  'Scope agreed in writing before work begins',
]

export default function ProofStrip() {
  return (
    <aside className="proof-strip" aria-label="Practice facts">
      <p className="proof-strip-inner">
        {FACTS.map((f, i) => (
          <React.Fragment key={f}>
            {i > 0 && <span className="dot" aria-hidden="true">·</span>}
            <span>{f}</span>
          </React.Fragment>
        ))}
      </p>
    </aside>
  )
}
