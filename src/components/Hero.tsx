import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { lerp } from '../utils/animation'
import { onFrame, removeFrame, useScrollReveal } from '../hooks/useAnimation'

/* ── Cycling problem ticker ───────────────────────────────── */
const PROBLEMS = [
  'Six-figure consultancy. Eighty slides. No decision made.',
  'Training done. Back to old workflows within a week.',
  'Pilot built. Demo was great. Production never happened.',
  'Strategy written by people who have never shipped a model.',
  'Governance framework — written after the regulator asked.',
  'Wrong vendor for your use case. Discovered too late.',
]

function ProblemTicker() {
  const [idx, setIdx]     = useState(0)
  const [visible, setVis] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      setVis(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % PROBLEMS.length)
        setVis(true)
      }, 400)
    }, 4800)
    return () => clearInterval(cycle)
  }, [])

  return (
    <div className="problem-ticker-wrap" aria-live="polite">
      <span className="problem-ticker-label">Sound familiar?</span>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.span key={idx} className="problem-ticker-text"
            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{   opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
            {PROBLEMS[idx]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Floating particle field ──────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0

    const resize = () => { W = canvas.width = canvas.offsetWidth || window.innerWidth; H = canvas.height = canvas.offsetHeight || window.innerHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const PRISM_HUES = [17, 22, 28, 37, 181, 186, 198] // Hero gradient colors only: warm orange→peach, cyan range
    // Responsive particle count: mobile gets visible particles
    const isMobile = window.innerWidth < 768
    const N = isMobile ? 12 : 24 // Increased mobile count for better visibility
    const px  = Array.from({ length: N }, () => Math.random())
    const py  = Array.from({ length: N }, () => Math.random())
    const pvx = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.00014)
    const pvy = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.00012)
    const pr  = Array.from({ length: N }, () => isMobile ? 1.2 + Math.random() * 2.0 : 0.8 + Math.random() * 2.2)
    const pa  = Array.from({ length: N }, () => isMobile ? 0.25 + Math.random() * 0.50 : 0.15 + Math.random() * 0.45)
    const ph  = Array.from({ length: N }, () => PRISM_HUES[Math.floor(Math.random() * PRISM_HUES.length)])
    const pph = Array.from({ length: N }, () => Math.random() * Math.PI * 2)
    let t = 0

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'
      const mx = mouseRef.current.x, my = mouseRef.current.y

      for (let i = 0; i < N; i++) {
        const dx = px[i] - mx, dy = py[i] - my
        const dist = Math.sqrt(dx*dx + dy*dy*1.4)
        if (dist < 0.18) {
          const f = (0.18 - dist) / 0.18 * 0.00012
          pvx[i] += dx * f; pvy[i] += dy * f
        }
        pvx[i] *= 0.998; pvy[i] *= 0.998
        px[i] += pvx[i]; py[i] += pvy[i]
        if (px[i] < 0) { px[i] = 0; pvx[i] *= -1 }
        if (px[i] > 1) { px[i] = 1; pvx[i] *= -1 }
        if (py[i] < 0) { py[i] = 0; pvy[i] *= -1 }
        if (py[i] > 1) { py[i] = 1; pvy[i] *= -1 }

        const a = pa[i] * (0.4 + 0.6 * Math.sin(t * 0.009 + pph[i]))
        const h = ph[i] + Math.sin(t * 0.005 + i) * 16
        const x = px[i] * W, y = py[i] * H

        ctx.shadowColor = `hsla(${h},90%,80%,${a * 0.55})`
        ctx.shadowBlur  = pr[i] * 5
        ctx.fillStyle   = `hsla(${h},85%,92%,${a})`
        ctx.beginPath(); ctx.arc(x, y, pr[i], 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur  = 0

        // Optimized: reduce connection drawing on mobile, skip on small screens
        if (!isMobile && t % 3 === 0) {
          let connections = 0
          for (let j = i + 1; j < N && connections < 2; j++) {
            const ex = (px[i]-px[j])*W, ey = (py[i]-py[j])*H
            const d = Math.sqrt(ex*ex + ey*ey)
            if (d < 110) {
              const ca = (1 - d/110) * 0.055 * a
              if (ca >= 0.003) {
                const h2 = ph[j] + Math.sin(t * 0.005 + j) * 16
                const eg = ctx.createLinearGradient(x, y, px[j]*W, py[j]*H)
                eg.addColorStop(0, `hsla(${h},88%,80%,${ca})`)
                eg.addColorStop(1, `hsla(${h2},88%,80%,${ca})`)
                ctx.strokeStyle = eg; ctx.lineWidth = 0.5
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(px[j]*W, py[j]*H); ctx.stroke()
                connections++
              }
            }
          }
        }
      }
    }, canvas)

    return () => {
      removeFrame(entry)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%',
               pointerEvents:'none', zIndex:1, mixBlendMode:'screen' }}
      aria-hidden="true"
    />
  )
}

/* ── Prism wave canvas ────────────────────────────────────── */
function CrystalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth  || window.innerWidth
      H = canvas.height = canvas.offsetHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const BAR_SPACING = 16, BAR_WIDTH = 1.5
    const cosA = Math.cos(Math.PI/4), sinA = Math.sin(Math.PI/4)
    const nx = -sinA, ny = cosA
    const WAVE_SPEED = 3.2, WAVE_BAND = 400, WAVE_INTERVAL = 160
    const waves: { y: number }[] = []
    let frame = 0

    const STOPS: readonly (readonly [number,number,number,number,number])[] = [
      [0.00,  20,  10,   4, 0.00],
      [0.06,  90,  40,  15, 0.48],
      [0.13, 230,  80,  35, 0.82],
      [0.20, 255, 126,  74, 1.00],
      [0.30, 255, 210, 140, 1.00],
      [0.38, 255, 255, 255, 1.00],
      [0.46, 151, 254, 255, 1.00],
      [0.54,  20, 160, 220, 0.92],
      [0.60,  40,  52,  55, 0.28],
      [0.68, 190, 248, 255, 0.78],
      [0.76, 255, 255, 255, 0.90],
      [0.84, 255, 150,  86, 0.75],
      [0.92,  60,  44,  28, 0.32],
      [1.00,   4,   4,   6, 0.00],
    ]

    function waveColor(t: number): [number,number,number,number] {
      let i = 0
      while (i < STOPS.length - 2 && STOPS[i+1][0] <= t) i++
      const s0 = STOPS[i], s1 = STOPS[i+1], f = (t - s0[0]) / (s1[0] - s0[0])
      return [lerp(s0[1],s1[1],f), lerp(s0[2],s1[2],f), lerp(s0[3],s1[3],f), lerp(s0[4],s1[4],f)]
    }

    function drawBar(cx: number, cy: number) {
      const d = (W + H) * 1.15
      ctx.beginPath()
      ctx.moveTo(cx - cosA*d, cy - sinA*d)
      ctx.lineTo(cx + cosA*d, cy + sinA*d)
      ctx.stroke()
    }

    const entry = onFrame(() => {
      frame++
      if (frame === 1 || frame % WAVE_INTERVAL === 0) waves.push({ y: -WAVE_BAND * 0.22 })
      for (let i = waves.length-1; i >= 0; i--) {
        waves[i].y += WAVE_SPEED
        if (waves[i].y > H + WAVE_BAND) waves.splice(i, 1)
      }
      ctx.fillStyle = '#040404'; ctx.fillRect(0, 0, W, H)
      ctx.save(); ctx.globalCompositeOperation = 'screen'
      const numBars = Math.ceil(Math.sqrt(W*W+H*H)*2/BAR_SPACING)+4
      for (let bi = 0; bi < numBars; bi++) {
        const perp = (bi - numBars/2) * BAR_SPACING
        const bcx = W*0.5 + nx*perp, bcy = H*0.5 + ny*perp
        let peakA = 0, accR = 0, accG = 0, accB = 0, accA = 0
        for (const w of waves) {
          const behind = bcy - w.y
          if (behind < 0 || behind > WAVE_BAND) continue
          const [r,g,b,a] = waveColor(behind/WAVE_BAND)
          if (a < 0.01) continue
          peakA = Math.max(peakA, a); accR=Math.min(255,accR+r*a); accG=Math.min(255,accG+g*a); accB=Math.min(255,accB+b*a); accA=Math.min(1,accA+a)
        }
        if (peakA < 0.015) { ctx.strokeStyle='rgba(38,34,28,0.055)'; ctx.lineWidth=BAR_WIDTH; drawBar(bcx,bcy); continue }
        const R=Math.round(Math.min(255,accR)), G=Math.round(Math.min(255,accG)), B=Math.round(Math.min(255,accB)), A=Math.min(1,accA)
        for (const p of [
          {w:BAR_WIDTH*42, a:A*0.045},
          {w:BAR_WIDTH*18, a:A*0.16},
          {w:BAR_WIDTH*6,  a:A*0.52},
          {w:BAR_WIDTH,    a:Math.min(1,A*1.2)},
        ]) {
          ctx.strokeStyle=`rgba(${R},${G},${B},${p.a.toFixed(3)})`; ctx.lineWidth=p.w; drawBar(bcx,bcy)
        }
      }
      ctx.restore()
    }, canvas)

    return () => {
      removeFrame(entry)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
}

/* ── Hero ─────────────────────────────────────────────────── */
export default function Hero() {
  // Use shared scroll reveal hook instead of duplicate logic
  useScrollReveal()

  const itemV = { hidden:{opacity:0,y:30}, visible:{opacity:1,y:0,transition:{duration:.9,ease:[.16,1,.3,1] as any}} }
  const contV = { hidden:{}, visible:{transition:{staggerChildren:.12}} }

  return (
    <section id="section-hero" className="section section-hero" aria-label="Hero">
      <CrystalCanvas />
      <ParticleField />
      <div className="hero-prism-spill" aria-hidden="true" />
      <div className="hero-scan-line" aria-hidden="true" />

      <motion.div className="hero-upper" variants={contV} initial="hidden" animate="visible">
        {/* ── Left: value prop ── */}
        <div className="hero-upper-left">
          <div className="hero-title-block">
            <motion.span className="hero-sup"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              transition={{duration:.7,delay:.1,ease:[.16,1,.3,1]}}>
              Code &amp; Clarity
            </motion.span>

            <motion.h1
              className="hero-headline"
              initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
              transition={{duration:.9,delay:.22,ease:[.16,1,.3,1]}}>
              AI consulting that actually<br />
              <span className="text-prism">changes how you operate.</span>
            </motion.h1>

            <motion.p className="hero-sub"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              transition={{duration:.8,delay:.42,ease:[.16,1,.3,1]}}>
              Strategy, governance & compliance. Training & capability building. Strategic AI implementation.
            </motion.p>
          </div>

        </div>

        {/* ── Right: problem + CTA ── */}
        <div className="hero-upper-right">
          <div className="hero-right-inner">
            <motion.div className="hero-status-row" variants={itemV}>
              <span className="status-dot" aria-hidden="true" />
              <span>Currently taking new engagements</span>
            </motion.div>

            <motion.p className="hero-tagline-large" variants={itemV}>
              We deliver <strong>complete AI solutions</strong> for companies, universities, and institutions —
              from strategic assessments and governance frameworks to capability building and implementation.
              Vendor platform, selective custom build, or hybrid — we find the correct approach for your needs.
            </motion.p>

            <motion.div variants={itemV}>
              <ProblemTicker />
            </motion.div>

            <motion.div className="hero-actions" variants={itemV}>
              <a href="#section-contact" className="hero-cta-primary"
                onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({behavior:'smooth'}) }}>
                <span className="btn-text">Start the conversation →</span>
                <span className="btn-shimmer" />
              </a>
              <a href="#section-transform" className="hero-cta-ghost"
                onClick={e => { e.preventDefault(); document.getElementById('section-transform')?.scrollIntoView({behavior:'smooth'}) }}>
                See how we work ›
              </a>
            </motion.div>

            <motion.div className="hero-pillars-row" variants={itemV}>
              {[
                ['Strategy & Governance','Honest. Executable. Compliant.'],
                ['Training & Capability','Institutional learning that sticks.'],
                ['Strategic Implementation','The right solution. Done correctly.'],
              ].map(([t,s]) => (
                <div className="hero-pillar" key={t}>
                  <span className="pillar-name">{t}</span>
                  <span className="pillar-sub">{s}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="hero-lower">
        <div className="hero-marquee-strip">
          <div className="hero-marquee-inner">
            {[
              'Strategic Assessment','AI Governance & Policy','EU AI Act Compliance',
              'Vendor Evaluation','Strategic Implementation','LLM Integration',
              'RAG Systems','Capability Building','Build vs Buy Analysis',
              'Agentic Pipelines','Knowledge Transfer','Production Deployment',
              'Strategic Assessment','AI Governance & Policy','EU AI Act Compliance',
            ].flatMap((txt,i) => [
              <span key={`t${i}`}>{txt}</span>,
              <span key={`s${i}`} className="m-sep">·</span>,
            ])}
          </div>
        </div>
      </div>

      <div
        className="hero-scroll-hint"
        aria-hidden="true"
        onClick={() => document.getElementById('section-transform')?.scrollIntoView({behavior:'smooth'})}
        style={{cursor:'pointer'}}
      >
        <div className="scroll-arrow" />
        <span>Scroll</span>
      </div>
    </section>
  )
}
