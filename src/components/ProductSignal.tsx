import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'

/* ─────────────────────────────────────────────────────────────────
   ProductSignal v2
   • Neural-network / circuit canvas background (animated nodes + edges)
   • Animated arc-gauge cards instead of flat text
   • Comparison table with animated progress bars
   • Architecture diagram SVG (static but revealled)
───────────────────────────────────────────────────────────────── */

/* ── Neural Network canvas ── */
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0, t = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth  || window.innerWidth
      H = canvas.height = canvas.offsetHeight || 500
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Layered nodes representing input → hidden → output
    const LAYERS = [3, 5, 5, 3]
    type NNode = { x: number; y: number; hue: number; phase: number }
    let nodes: NNode[][] = []

    const buildNodes = () => {
      nodes = LAYERS.map((count, li) => {
        const x = W * (0.12 + li * 0.26)
        return Array.from({ length: count }, (_, ni) => ({
          x,
          y: H * ((ni + 1) / (count + 1)),
          hue: [17, 37, 181, 198][li], // Hero gradient hues only: warm orange, warm peach, bright cyan, deep cyan
          phase: (li * 1.1 + ni * 0.7),
        }))
      })
    }
    buildNodes()

    // Flowing pulses along edges
    const pulses: { li: number; ni: number; nj: number; t: number; speed: number }[] = []
    const spawnPulse = () => {
      if (pulses.length > 28) return
      const li = Math.floor(Math.random() * (LAYERS.length - 1))
      const ni = Math.floor(Math.random() * LAYERS[li])
      const nj = Math.floor(Math.random() * LAYERS[li + 1])
      pulses.push({ li, ni, nj, t: 0, speed: 0.006 + Math.random() * 0.006 })
    }

    const entry = onFrame(() => {
      t++
      if (t % 8 === 0) spawnPulse()

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'

      // Reposition nodes on resize
      if (nodes[0]?.[0]?.x !== W * 0.12) buildNodes()

      // Draw edges
      for (let li = 0; li < LAYERS.length - 1; li++) {
        for (const a of nodes[li]) {
          for (const b of nodes[li + 1]) {
            const a2 = 0.03 + 0.015 * Math.sin(t * 0.007 + a.phase + b.phase)
            ctx.strokeStyle = `rgba(120,180,255,${a2})`
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.speed
        if (p.t > 1) { pulses.splice(i, 1); continue }

        const a = nodes[p.li][p.ni], b = nodes[p.li + 1][p.nj]
        if (!a || !b) { pulses.splice(i, 1); continue }
        const px = a.x + (b.x - a.x) * p.t
        const py = a.y + (b.y - a.y) * p.t
        const col = `hsl(${a.hue},100%,80%)`
        const g = ctx.createRadialGradient(px, py, 0, px, py, 8)
        g.addColorStop(0, col); g.addColorStop(1, col.replace(')', ',0)').replace('hsl','hsla'))
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = col
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill()
      }

      // Draw nodes
      for (const layer of nodes) {
        for (const n of layer) {
          const pulse = 0.55 + 0.45 * Math.sin(t * 0.018 + n.phase)
          const r = 5 + 2 * pulse
          const col = `hsl(${n.hue},90%,75%)`
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
          g.addColorStop(0, col); g.addColorStop(1, `hsla(${n.hue},90%,75%,0)`)
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2); ctx.fill()
          ctx.strokeStyle = col; ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.stroke()
          ctx.fillStyle = 'rgba(4,4,12,0.92)'
          ctx.beginPath(); ctx.arc(n.x, n.y, r - 0.5, 0, Math.PI * 2); ctx.fill()
        }
      }

      ctx.globalCompositeOperation = 'source-over'
    }, canvas)
    return () => { removeFrame(entry); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={ref} aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%',
               pointerEvents:'none', zIndex:0, opacity: 0.55 }} />
  )
}

/* ── Arc-gauge for each quality ── */
function ArcGauge({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as any, { once: true, margin: '-40px' })

  const R  = (size - 10) / 2
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * R
  // start at top (-90 deg), draw CW
  const dashLen = circ * (pct / 100)

  return (
    <div ref={ref} style={{ position:'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle cx={cx} cy={cy} r={R} fill="none"
          stroke={color} strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ - dashLen } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <span style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-mono)', fontSize:'0.7rem', color,
      }}>{pct}%</span>
    </div>
  )
}

const qualities = [
  {
    icon: '◈',
    label: 'Implementation planning',
    body: 'The right technical approach for your requirements — vendor platform, selective custom development, or hybrid. Evaluated against your operational reality, not theoretical best practices.',
    accent: 'hsl(17, 85%, 62%)', // Warm orange from hero gradient
    metric: 'Fit-for-purpose',
  },
  {
    icon: '⬡',
    label: 'Production-ready systems',
    body: 'Implemented for real traffic and real edge cases, not demo conditions. Client-facing systems designed for operational reliability and daily use.',
    accent: 'hsl(181, 85%, 75%)', // Bright cyan from hero gradient
    metric: 'Production-tested',
  },
  {
    icon: '◎',
    label: 'Built for your environment',
    body: 'Vendor platform, custom build, or hybrid — we select and implement the approach that fits your infrastructure, security requirements, and operational constraints. Complete documentation and production handover.',
    accent: 'hsl(198, 78%, 65%)', // Medium cyan from hero gradient
    metric: 'Production-ready',
  },
  {
    icon: '◐',
    label: 'Six weeks, not six months',
    body: 'Scoped to deliver working systems fast. Clear implementation milestones. Production deployment before the next budget cycle.',
    accent: 'hsl(37, 85%, 74%)', // Warm peach from hero gradient
    metric: 'On-time delivery',
  },
]

const demoVsProduct = [
  { demo: 'Impressive demo with hardcoded data', product: 'Implementation on your real infrastructure', dPct: 22, pPct: 95 },
  { demo: 'Pilot that works when you script the questions', product: 'Implementation evaluated against your real requirements', dPct: 18, pPct: 91 },
  { demo: 'Platform nobody uses after the launch demo', product: 'Implementation designed around your operational needs', dPct: 30, pPct: 88 },
  { demo: 'Vendor platform configured by consultants who leave.', product: 'Implementation matched to your requirements with full handover.', dPct: 15, pPct: 100 },
]

/* ── Animated comparison row ── */
function CompareRow({ row, i }: { row: typeof demoVsProduct[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as any, { once: true, margin: '-30px' })

  return (
    <div ref={ref} className="dvp-row" style={{ alignItems:'stretch', gap:'1rem' }}>
      {/* Bad column */}
      <div className="dvp-cell dvp-cell-bad" style={{ position:'relative', paddingBottom:'1.6rem' }}>
        {row.demo}
        <div style={{ position:'absolute', bottom:6, left:8, right:8 }}>
          <div style={{ height:2, background:'rgba(255,255,255,0.05)', borderRadius:1, overflow:'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${row.dPct}%` } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.16,1,0.3,1] }}
              style={{ height:'100%', background:'rgba(239,68,68,0.55)', borderRadius:1 }}
            />
          </div>
        </div>
      </div>

      <div className="dvp-divider" aria-hidden="true">→</div>

      {/* Good column */}
      <div className="dvp-cell dvp-cell-good" style={{ position:'relative', paddingBottom:'1.6rem' }}>
        {row.product}
        <div style={{ position:'absolute', bottom:6, left:8, right:8 }}>
          <div style={{ height:2, background:'rgba(255,255,255,0.05)', borderRadius:1, overflow:'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${row.pPct}%` } : {}}
              transition={{ duration: 0.9, delay: 0.35 + i * 0.06, ease: [0.16,1,0.3,1] }}
              style={{ height:'100%', background:'rgba(151,254,255,0.6)', borderRadius:1,
                       boxShadow:'0 0 6px rgba(151,254,255,0.4)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Architecture stack diagram ── */
function ArchDiagram() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const layers = [
    { label: 'Client Interface', sub: 'Web / Mobile · Integration with existing systems', color: 'hsl(181, 85%, 75%)', delay: 0 },
    { label: 'API Gateway', sub: 'Auth · Rate-limit · Observability · Monitoring', color: 'hsl(198, 78%, 65%)', delay: 0.1 },
    { label: 'LLM Orchestration', sub: 'RAG · Agents · Guardrails · Vendor or custom', color: 'hsl(37, 85%, 74%)', delay: 0.2 },
    { label: 'Data Layer', sub: 'Vector DB · Structured store · Your infrastructure', color: 'hsl(17, 85%, 62%)', delay: 0.3 },
  ]

  return (
    <div ref={ref}
      style={{ maxWidth: 560, margin: '3rem auto 0', display:'flex', flexDirection:'column', gap:'0.5rem' }}>
      <div style={{ textAlign:'center', marginBottom:'1rem' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.7rem', letterSpacing:'0.12em',
                       textTransform:'uppercase', color:'rgba(151,254,255,0.45)' }}>
          Typical custom implementation architecture
        </span>
      </div>
      {layers.map((l, i) => (
        <motion.div key={l.label}
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: l.delay, ease:[0.16,1,0.3,1] }}
          style={{
            background: `${l.color}0A`,
            border: `1px solid ${l.color}22`,
            borderLeft: `3px solid ${l.color}`,
            borderRadius: 8, padding: '0.7rem 1rem',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}
        >
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.8rem', color: l.color, fontWeight:600 }}>
            {i + 1}. {l.label}
          </span>
          <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', fontFamily:'var(--font-mono)' }}>
            {l.sub}
          </span>
        </motion.div>
      ))}
      {/* Connecting arrows */}
      {[0,1,2].map(i => (
        <motion.div key={i}
          initial={{ opacity:0, scaleY:0 }}
          animate={inView ? { opacity:1, scaleY:1 } : {}}
          transition={{ duration:0.3, delay:0.1*(i+1)+0.25, ease:[0.16,1,0.3,1] }}
          style={{ textAlign:'center', fontSize:'0.8rem', color:'rgba(151,254,255,0.25)',
                   lineHeight:1, transformOrigin:'top', margin:'-0.5rem 0' }}>
          ↕
        </motion.div>
      ))}
    </div>
  )
}

export default function ProductSignal() {
  const headRef = useRef<HTMLDivElement>(null)
  const inView  = useInView(headRef, { once: true, margin: '-60px' })

  return (
    <section
      id="section-product"
      className="section section-product"
      aria-label="Full AI implementation"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--deep)' }}
    >
      <NeuralCanvas />
      {/* Brand glow orbs */}
      <div className="glow-orb" style={{ width:500, height:500, top:'-8%', right:'-6%', background:'radial-gradient(circle,rgba(139,92,246,.18) 0%,transparent 70%)', zIndex:0 }} aria-hidden="true"/>
      <div className="glow-orb" style={{ width:400, height:400, bottom:'-10%', left:'-4%', background:'radial-gradient(circle,rgba(0,85,255,.15) 0%,transparent 70%)', zIndex:0 }} aria-hidden="true"/>

      <div className="section-content" style={{ position: 'relative', zIndex: 2 }}>

        {/* ── Headline ── */}
        <motion.div ref={headRef} className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center' }}
        >
          <div className="section-eyebrow">AI Implementation</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            The right implementation.<br />
            <em className="text-prism">For your requirements.</em>
          </h2>
          <p className="section-lead" style={{ textAlign: 'center', maxWidth: 560, margin: '1rem auto 0' }}>
            We implement complete AI solutions — from planning and vendor selection through to deployment and operational handover. Finding the correct implementation approach for your requirements: vendor platform, selective custom build, or hybrid.
          </p>
        </motion.div>

        {/* ── Four quality pillars with arc gauges ── */}
        <div className="product-signal-grid">
          {qualities.map((q, i) => (
            <motion.div key={q.label} className="product-signal-card"
              style={{ '--ps-accent': q.accent } as any}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.6rem' }}>
                <div>
                  <span className="ps-icon" style={{ color: q.accent, fontSize:'1.4rem', display:'block', lineHeight:1 }}>{q.icon}</span>
                  <strong className="ps-label" style={{ color: q.accent, fontSize:'0.82rem' }}>{q.label}</strong>
                </div>
              </div>
              <p className="ps-body">{q.body}</p>
              <div style={{ marginTop:'0.6rem', fontFamily:'var(--font-mono)', fontSize:'0.65rem',
                            color: q.accent, opacity:0.7, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                ✦ {q.metric}
              </div>
              <div className="ps-glow" aria-hidden="true" />
            </motion.div>
          ))}
        </div>

        {/* ── Comparison table with animated bars ── */}
        <motion.div className="dvp-wrap"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="dvp-col-labels">
            <span className="dvp-col-label dvp-col-label-bad">❌ Typical AI demo</span>
            <span aria-hidden="true" />
            <span className="dvp-col-label dvp-col-label-good">✦ Code &amp; Clarity build</span>
          </div>
          {demoVsProduct.map((row, i) => (
            <CompareRow key={i} row={row} i={i} />
          ))}
        </motion.div>

        {/* ── Architecture stack ── */}
        <ArchDiagram />

        {/* ── CTA ── */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#section-contact" className="hero-cta-primary"
            style={{ display: 'inline-flex' }}
            onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
            <span className="btn-text">Implement strategically →</span>
            <span className="btn-shimmer" />
          </a>
        </motion.div>

      </div>
    </section>
  )
}
