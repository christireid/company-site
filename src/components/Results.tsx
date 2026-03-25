import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { onFrame } from '../hooks/useAnimation'

const rand = (lo: number, hi: number) => Math.random() * (hi - lo) + lo
const PI2  = Math.PI * 2

/* ══════════════════════════════════════════════════════════
   CONVERGENCE CANVAS — Stars + convergence lines + blobs
   Brand palette: indigo/violet/cyan (195–285°)
   ══════════════════════════════════════════════════════════ */
function ConvCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0, t = 0
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth  || window.innerWidth
      H = canvas.height = canvas.offsetHeight || 600
    }
    resize(); window.addEventListener('resize', resize, { passive: true })

    /* ── Stars — brand palette (195–285°) — Reduced for minimalism ─────────────── */
    const stars = Array.from({ length: 60 }, () => ({
      x:     rand(0, 1),
      y:     rand(0, 1),
      r:     rand(0.7, 2.5),
      a:     rand(0.20, 0.50),  // Reduced opacity for subtlety
      phase: rand(0, PI2),
      speed: rand(0.018, 0.042),
      hue:   rand(195, 285),     // brand palette only
    }))

    /* ── Convergence lines — brand palette rays (reduced for academic minimalism) ────────── */
    const FOCAL_X = 0.52, FOCAL_Y = 0.48
    const convLines = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * PI2 + rand(-0.1, 0.1)
      const dist  = rand(0.35, 0.92)
      return {
        sx:    FOCAL_X + Math.cos(angle) * dist,
        sy:    FOCAL_Y + Math.sin(angle) * dist * 0.6,
        phase: rand(0, PI2),
        speed: rand(0.014, 0.032),
        hue:   rand(198, 278),   // brand palette only
        a:     rand(0.05, 0.12),  // Reduced opacity for subtlety
      }
    })

    /* ── Background blobs — brand hue pairs (reduced to 3 for boutique restraint) ────────────── */
    const BLOB_PALETTE = [
      { h: 218, h2: 248 },  // sky → indigo
      { h: 252, h2: 278 },  // indigo → violet
      { h: 198, h2: 224 },  // cyan → sky
      { h: 235, h2: 262 },  // blue-indigo
      { h: 208, h2: 238 },  // sky-blue
    ]
    const blobs = Array.from({ length: 3 }, (_, i) => {
      const paletteIndex = [0, 2, 4][i]  // Keep indices 0, 2, 4
      return {
        x:     rand(0.1, 0.9),
        y:     rand(0.1, 0.9),
        vx:    rand(-0.00008, 0.00008),
        vy:    rand(-0.00007, 0.00007),
        r:     rand(0.12, 0.22),
        h:     BLOB_PALETTE[paletteIndex].h,
        h2:    BLOB_PALETTE[paletteIndex].h2,
        phase: rand(0, PI2),
        speed: rand(0.006, 0.012),
      }
    })

    onFrame(() => {
      t++
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'

      /* Draw brand-hue blobs */
      blobs.forEach(b => {
        b.x += b.vx; b.y += b.vy
        if (b.x < 0.05 || b.x > 0.95) b.vx *= -1
        if (b.y < 0.05 || b.y > 0.95) b.vy *= -1
        const breathe = 0.78 + 0.22 * Math.sin(t * b.speed + b.phase)
        const r       = b.r * breathe * Math.min(W, H)
        const alpha   = (0.090 + 0.040 * Math.sin(t * b.speed * 0.7 + b.phase)) * breathe
        // Oscillate between h and h2
        const hFrac = 0.5 + 0.5 * Math.sin(t * 0.0026 + b.phase)
        const hS = b.h  + (b.h2 - b.h) * hFrac
        const hM = b.h  + (b.h2 - b.h) * Math.min(1, hFrac + 0.5)
        const hE = b.h2 + 5

        // Outer bloom
        const g1 = ctx.createRadialGradient(b.x*W, b.y*H, 0, b.x*W, b.y*H, r * 2.0)
        g1.addColorStop(0,    `hsla(${hS},  88%, 74%, ${alpha * 1.10})`)
        g1.addColorStop(0.35, `hsla(${hM},  82%, 68%, ${alpha * 0.55})`)
        g1.addColorStop(0.70, `hsla(${hE},  74%, 62%, ${alpha * 0.18})`)
        g1.addColorStop(1,    'hsla(0,0%,0%,0)')
        ctx.fillStyle = g1
        ctx.beginPath(); ctx.arc(b.x*W, b.y*H, r * 2.0, 0, PI2); ctx.fill()

        // Inner nucleus
        const g2 = ctx.createRadialGradient(b.x*W, b.y*H, 0, b.x*W, b.y*H, r * 0.46)
        g2.addColorStop(0,   `hsla(${hE},  98%, 92%, ${alpha * 1.85})`)
        g2.addColorStop(0.42,`hsla(${hM},  92%, 84%, ${alpha * 1.05})`)
        g2.addColorStop(1,   'transparent')
        ctx.fillStyle = g2
        ctx.beginPath(); ctx.arc(b.x*W, b.y*H, r * 0.46, 0, PI2); ctx.fill()

      })

      /* Draw convergence lines — each within brand palette */
      convLines.forEach(l => {
        const env = 0.5 + 0.5 * Math.sin(t * l.speed + l.phase)
        const a   = l.a * env
        if (a < 0.005) return
        // Narrow hue sweep (±20° around seed)
        const h0 = l.hue
        const h1 = h0 + 12
        const h2 = h0 + 20
        const g = ctx.createLinearGradient(l.sx*W, l.sy*H, FOCAL_X*W, FOCAL_Y*H)
        g.addColorStop(0,    'transparent')
        g.addColorStop(0.35, `hsla(${h0}, 84%, 80%, ${a * 0.45})`)
        g.addColorStop(0.70, `hsla(${h1}, 88%, 86%, ${a * 0.75})`)
        g.addColorStop(1,    `hsla(${h2}, 94%, 94%, ${a})`)
        ctx.strokeStyle = g
        ctx.lineWidth   = 0.90
        ctx.beginPath()
        ctx.moveTo(l.sx*W, l.sy*H)
        ctx.lineTo(FOCAL_X*W, FOCAL_Y*H)
        ctx.stroke()
      })

      /* Focal-point glow — brand palette (230–265°) */
      const fHue = 235 + 18 * Math.sin(t * 0.014)
      const fHue2 = fHue + 20
      const fA    = 0.34 + 0.16 * Math.sin(t * 0.018)
      const fR    = (0.028 + 0.010 * Math.sin(t * 0.011)) * Math.min(W, H)
      const fg    = ctx.createRadialGradient(FOCAL_X*W, FOCAL_Y*H, 0, FOCAL_X*W, FOCAL_Y*H, fR * 1.7)
      fg.addColorStop(0,    `hsla(${fHue2}, 100%, 96%, ${fA * 1.20})`)
      fg.addColorStop(0.30, `hsla(${fHue},   94%, 88%, ${fA * 0.75})`)
      fg.addColorStop(0.65, `hsla(${fHue-10}, 86%, 78%, ${fA * 0.30})`)
      fg.addColorStop(1,    'hsla(0,0%,0%,0)')
      ctx.fillStyle = fg
      ctx.beginPath(); ctx.arc(FOCAL_X*W, FOCAL_Y*H, fR * 1.7, 0, PI2); ctx.fill()

      /* Draw stars — brand palette, slow shimmer (±10°) */
      stars.forEach(s => {
        const a   = s.a * (0.40 + 0.60 * Math.sin(t * s.speed + s.phase))
        const r   = s.r  * (0.85 + 0.15 * Math.sin(t * s.speed * 0.7 + s.phase))
        const hue = s.hue + Math.sin(t * 0.006 + s.phase * 2) * 10
        if (a < 0.014) return
        ctx.shadowColor = `hsla(${hue}, 86%, 86%, 0.65)`
        ctx.shadowBlur  = r * 7.0
        ctx.fillStyle   = `hsla(${hue}, 84%, 94%, ${a})`
        ctx.beginPath(); ctx.arc(s.x*W, s.y*H, r, 0, PI2); ctx.fill()
        ctx.shadowBlur = 0
      })
    }, canvas)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas ref={canvasRef} className="constellation-canvas" aria-hidden="true" />
}

const metrics = [
  { num: '6+',     label: 'Years AI Practice\nIn Production'         },
]

const cases = [
  {
    sector: 'Fintech · Series C',
    outcome: 'Document review pipeline built end-to-end with RAG. Scoped, built, and the team were running it in production before the quarter closed. Measurable reduction in legal review time.',
    meta: 'AI Integration · Pilot Build',
  },
  {
    sector: 'Professional Services · FTSE 100',
    outcome: 'AI governance framework and EU AI Act readiness delivered ahead of the regulatory deadline. The board had a defensible position and an auditable policy trail before their competitors had finished drafting.',
    meta: 'AI Strategy · Policy Analysis',
  },
  {
    sector: 'HealthTech · Growth Stage',
    outcome: 'Engineering team went from no AI capability to running agentic workflows in production in two intensive days. Tangible output at the end of each session. Still in use six months later.',
    meta: 'Workshop · Technical Track',
  },
  {
    sector: 'LegalTech · Scale-Up',
    outcome: 'Full AI product built from scratch: LLM-powered contract analysis interface with a client-facing UI designed for non-technical users. Users adopted it within 48 hours. Zero churn in first quarter. Complete handover with full documentation and operational runbooks.',
    meta: 'Full AI Implementation · Product UX',
  },
]

/* No testimonials — we only publish what we can fully stand behind */

export default function Results() {
  return (
    <section id="section-results" className="section section-results" aria-label="Our work">
      <ConvCanvas />
      <div
        className="glow-orb glow-orb-violet"
        style={{ width:600, height:600, top:'5%', left:'50%', transform:'translateX(-50%)', animationDelay:'2s', zIndex:0 }}
        aria-hidden="true"
      />

      <div className="results-content section-content">
        <motion.div
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.3 }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          style={{ textAlign:'center' }}
        >
          <h2 className="section-title">What we<br/><em className="text-prism accent-underline">build, ship &amp; hand over</em></h2>
          <p className="body-text" style={{ maxWidth:520, textAlign:'center', margin:'1rem auto 0' }}>
            Strategy that ends in a decision. Training that sticks. Implementation that meets your requirements — vendor platform, custom build, or hybrid.
          </p>
        </motion.div>

        {/* Honest metrics — only claims we can fully stand behind */}
        <div className="results-metrics-grid" aria-label="Practice facts">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="result-metric"
              initial={{ opacity:0, y:32 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.3 }}
              transition={{ delay: i*0.10, duration:0.75, ease:[0.16,1,0.3,1] }}
            >
              <div className="result-metric-num">{m.num}</div>
              <div className="result-metric-label" style={{ whiteSpace:'pre-line' }}>{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Case studies — real engagements, no fabricated numbers */}
        <div className="case-studies-strip" aria-label="Selected outcomes">
          {cases.map((c, i) => (
            <motion.div
              key={c.sector}
              className="case-study-card"
              initial={{ opacity:0, y:28 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ delay: i*0.10, duration:0.75, ease:[0.16,1,0.3,1] }}
            >
              <div className="cs-eyebrow">{c.sector}</div>
              <p className="cs-outcome">{c.outcome}</p>
              <div className="cs-meta">{c.meta}</div>
            </motion.div>
          ))}
        </div>

        {/* What we don't publish */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.4 }}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          style={{ textAlign:'center', marginTop:'3rem' }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            letterSpacing: '.14em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            We don't publish testimonials or fabricated ROI percentages.<br/>
            Ask us directly — we'll tell you specifically what we've done, for whom, and what it produced.
          </p>
          <motion.a
            href="#section-contact"
            className="hero-cta-primary"
            style={{ display:'inline-flex', marginTop:'1.6rem' }}
            onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({ behavior:'smooth' }) }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <span className="btn-text">Ask us directly →</span>
            <span className="btn-shimmer" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
