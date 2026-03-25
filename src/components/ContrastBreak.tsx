import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useAnimation'


/* ─────────────────────────────────────────────────────────────────
   ContrastBreak v3
   Pure-CSS atmospheric background — no canvas. Two-column layout
   with animated row entries (bad left, good right) and a VS rail.
───────────────────────────────────────────────────────────────── */

const pairs = [
  {
    bad:  '"Strategy" that takes three months to produce eighty slides',
    good: 'Problem defined, approach agreed, roadmap delivered — in weeks',
    icon: '◈',
    theme: '#FF7E4A',
  },
  {
    bad:  'Pilot that impresses the board. Teaches nothing. Scales to nothing.',
    good: 'Pilot designed to answer one specific question before you commit',
    icon: '◕',
    theme: '#FFD040',
  },
  {
    bad:  'Training completed. Certificate issued. Old habits resumed by Monday.',
    good: 'Capability your team still uses six months after we leave',
    icon: '◎',
    theme: '#97FEFF',
  },
  {
    bad:  'Three consultants, four frameworks, zero accountability',
    good: 'One practice. Strategy, training, and delivery in the same room.',
    icon: '⬡',
    theme: '#0099FF',
  },
  {
    bad:  'Governance framework written after the regulator asked for one',
    good: 'Policy position defensible before the regulation requires it',
    icon: '◐',
    theme: '#FF7E4A',
  },
  {
    bad:  'Software delivered. Capability to maintain it stayed with the vendor.',
    good: 'Software delivered with the knowledge to run it. Capability transfers, not just code.',
    icon: '◑',
    theme: '#97FEFF',
  },
  {
    bad:  'AI demo that wows in a boardroom. Users abandon it by week two.',
    good: 'A complete AI product — designed for delight, built for adoption.',
    icon: '⬡',
    theme: '#8B5CF6',
  },
]

function ContrastRow({ pair, index }: { pair: typeof pairs[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className="contrast-row">
      {/* BAD side */}
      <motion.div
        className="contrast-cell contrast-cell-bad"
        initial={{ opacity: 0, x: -28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="contrast-cell-icon contrast-cell-icon-bad" aria-hidden="true">✕</span>
        <span className="contrast-cell-text">{pair.bad}</span>
      </motion.div>

      {/* Centre node */}
      <div className="contrast-row-node" aria-hidden="true">
        <motion.div
          className="contrast-node-dot"
          style={{ background: pair.theme, boxShadow: `0 0 10px ${pair.theme}66` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.06 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <span style={{ color: pair.theme, filter: `drop-shadow(0 0 4px ${pair.theme})` }}>
            {pair.icon}
          </span>
        </motion.div>
      </div>

      {/* GOOD side */}
      <motion.div
        className="contrast-cell contrast-cell-good"
        initial={{ opacity: 0, x: 28 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.06 + 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="contrast-cell-icon contrast-cell-icon-good"
          style={{ color: pair.theme }}
          aria-hidden="true"
        >✦</span>
        <span className="contrast-cell-text contrast-cell-text-good">{pair.good}</span>
      </motion.div>
    </div>
  )
}


/* Animated vertical rail that draws down between all rows */
function ContrastRail() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className="contrast-rail-wrap" aria-hidden="true">
      <motion.div
        className="contrast-rail"
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top' }}
      />
    </div>
  )
}

export default function ContrastBreak() {
  return (
    <section id="section-contrast" className="contrast-break" aria-label="Two approaches to AI" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Pure CSS atmospheric background — no canvas */}
      <div className="contrast-bg-css" aria-hidden="true" />

      {/* Heading */}
      <motion.div
        className="contrast-heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="section-eyebrow">Two ways this ends.</span>
        <h2 className="contrast-title">
          Which column<br />
          <em className="text-prism">is yours right now?</em>
        </h2>

        {/* Column labels */}
        <div className="contrast-col-labels">
          <span className="contrast-col-label-bad">The pattern we see</span>
          <span className="contrast-col-label-mid" aria-hidden="true" />
          <span className="contrast-col-label-good">With Code &amp; Clarity</span>
        </div>
      </motion.div>

      {/* Row grid with shared vertical rail */}
      <div className="contrast-rows-wrap">
        <ContrastRail />
        <div className="contrast-rows">
          {pairs.map((pair, i) => (
            <ContrastRow key={i} pair={pair} index={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="contrast-cta-block"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="contrast-cta-label">If the right column is where you want to be:</p>
        <a
          href="#section-contact"
          className="hero-cta-primary"
          style={{ display: 'inline-flex' }}
          onClick={e => {
            e.preventDefault()
            document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span className="btn-text">Get started →</span>
          <span className="btn-shimmer" />
        </a>
      </motion.div>

    </section>
  )
}
