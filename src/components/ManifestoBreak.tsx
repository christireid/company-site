import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'

/* ─────────────────────────────────────────────────────────────────
   ManifestoBreak v3
   • Live signal-line / oscilloscope canvas (3 overlapping waves)
   • Word-by-word animated BigStatement
   • Two scrolling ticker tapes (opposite directions)
   • Draw-in prism hairlines top + bottom
   • Animated counting micro-stats
   • Floating hexagonal particle field
───────────────────────────────────────────────────────────────── */

/* ── Oscilloscope / Signal canvas ── */
function SignalCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    let W = 0, H = 0, t = 0

    const resize = () => {
      W = c.width  = c.offsetWidth  || window.innerWidth
      H = c.height = c.offsetHeight || 180
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const signals = [
      { freq: 1.2,  amp: 0.28, phase: 0,        color: '#FF7E4A', width: 1.5, alpha: 0.55 },
      { freq: 2.1,  amp: 0.18, phase: Math.PI/3, color: '#97FEFF', width: 1.2, alpha: 0.45 },
      { freq: 0.75, amp: 0.22, phase: Math.PI/5, color: '#8B5CF6', width: 1.0, alpha: 0.38 },
    ]

    // sparse vertical markers
    const markers: { x: number; label: string; hue: number }[] = []
    for (let i = 0; i < 6; i++) {
      markers.push({ x: (i + 1) / 7, label: `v${i+1}`, hue: [30, 181, 270, 15, 210, 60][i] })
    }

    const entry = onFrame(() => {
      t += 0.5
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'

      // baseline grid lines (very faint)
      ctx.strokeStyle = 'rgba(151,254,255,0.04)'
      ctx.lineWidth = 0.5
      for (let row = 0; row <= 4; row++) {
        const y = (row / 4) * H
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // animated signals
      for (const sig of signals) {
        const pts: [number, number][] = []
        for (let px = 0; px <= W; px += 2) {
          const nx = px / W  // 0..1
          const noise = 0.06 * Math.sin(nx * 31 + t * 0.09 + sig.phase * 3)
          const wave  = sig.amp * Math.sin(nx * Math.PI * 2 * sig.freq * 4 + t * 0.022 + sig.phase)
          const beat  = 0.04 * Math.sin(t * 0.008 + sig.phase)
          const y = H * 0.5 + H * (wave + noise + beat)
          pts.push([px, y])
        }

        // glow pass
        ctx.shadowColor = sig.color
        ctx.shadowBlur  = 8
        const grad = ctx.createLinearGradient(0, 0, W, 0)
        grad.addColorStop(0, sig.color + '00')
        grad.addColorStop(0.2, sig.color + Math.round(sig.alpha * 255).toString(16).padStart(2,'0'))
        grad.addColorStop(0.8, sig.color + Math.round(sig.alpha * 255).toString(16).padStart(2,'0'))
        grad.addColorStop(1, sig.color + '00')
        ctx.strokeStyle = grad
        ctx.lineWidth = sig.width
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // animated scan line
      const scanX = (((t * 1.4) % W))
      const sg = ctx.createLinearGradient(scanX - 40, 0, scanX + 4, 0)
      sg.addColorStop(0, 'rgba(151,254,255,0)')
      sg.addColorStop(0.8, 'rgba(151,254,255,0.12)')
      sg.addColorStop(1, 'rgba(151,254,255,0.22)')
      ctx.strokeStyle = sg; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, H); ctx.stroke()

      ctx.globalCompositeOperation = 'source-over'
    }, c)
    return () => { removeFrame(entry); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={ref} aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'180px', top:'auto', bottom:0,
               pointerEvents:'none', opacity:0.7 }} />
  )
}

/* ── Floating hex particle field ── */
function HexField() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    let W = 0, H = 0, t = 0

    const resize = () => {
      W = c.width  = c.offsetWidth  || window.innerWidth
      H = c.height = c.offsetHeight || 600
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const HUES = [348, 15, 40, 181, 210, 270]
    const hexes = Array.from({ length: 22 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.14,
      r: 4 + Math.random() * 12,
      h: HUES[Math.floor(Math.random() * HUES.length)],
      phase: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.01,
      alpha: 0.06 + Math.random() * 0.10,
    }))

    const drawHex = (x: number, y: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 6
        ctx[i === 0 ? 'moveTo' : 'lineTo'](x + r * Math.cos(a), y + r * Math.sin(a))
      }
      ctx.closePath()
    }

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'

      for (const h of hexes) {
        h.x += h.vx; h.y += h.vy
        if (h.x < -40) h.x = W + 40
        if (h.x > W + 40) h.x = -40
        if (h.y < -40) h.y = H + 40
        if (h.y > H + 40) h.y = -40

        const pulse = h.alpha * (0.55 + 0.45 * Math.sin(t * h.speed + h.phase))
        drawHex(h.x, h.y, h.r)
        ctx.strokeStyle = `hsla(${h.h},90%,75%,${pulse})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
    }, c)
    return () => { removeFrame(entry); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas ref={ref} aria-hidden="true"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%',
               pointerEvents:'none', opacity:0.8 }} />
  )
}

/* ── Ticker tape ── */
function Ticker({ text, accent, speed, reverse = false }: {
  text: string; accent: string; speed: string; reverse?: boolean
}) {
  const full = `${text}  ${text}  ${text}  `
  return (
    <div style={{ overflow: 'hidden', padding: '.35rem 0' }}>
      <div
        className="manifesto-ticker"
        style={{
          color: 'var(--text-body)',
          animationDuration: speed,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <span style={{ color: accent }}>▸&nbsp;</span>{full}
        <span style={{ color: accent }}>▸&nbsp;</span>{full}
      </div>
    </div>
  )
}

/* ── Large statement word-by-word ── */
function BigStatement() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const words = [
    { w: 'Most',       accent: false },
    { w: 'AI',         accent: false },
    { w: 'projects',   accent: false },
    { w: 'fail',       accent: false },
    { w: 'between',    accent: false },
    { w: 'strategy,',  accent: false },
    { w: 'governance,', accent: false },
    { w: 'and',        accent: false },
    { w: 'execution.', accent: false },
    { w: 'We',         accent: false },
    { w: 'close',      accent: false },
    { w: 'those',      accent: false },
    { w: 'gaps.',      accent: true  },
  ]

  return (
    <div ref={ref}
      style={{ padding: '3.8rem var(--pad-x) 2.4rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.9rem, 4.2vw, 3.4rem)',
        fontWeight: 300, lineHeight: 1.28, letterSpacing: '-.02em',
        color: 'var(--text-primary)',
      }}>
        {words.map((w, i) => (
          <motion.span key={i}
            initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
            animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.7, delay: i * 0.068 + 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-block', marginRight: '0.28em' }}
          >
            {w.accent ? <span className="manifesto-accent">{w.w}</span> : w.w}
          </motion.span>
        ))}
      </p>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: '1px', transformOrigin: 'left', marginTop: '2rem',
          background: 'linear-gradient(90deg, transparent, rgba(151,254,255,0.22), rgba(255,208,64,0.14), transparent)',
        }}
      />
    </div>
  )
}

/* ── Animated counting micro-stats ── */
function AnimCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref as any, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - (1 - p) * (1 - p) * (1 - p)
      el.textContent = Math.round(ease * target) + suffix
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, suffix])

  return <span ref={ref}>{target}{suffix}</span>
}

function MicroStats() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const stats = [
    { val: 50, suffix: '+', label: 'Teams upskilled' },
    { val: 10, suffix: '+', label: 'Years shipping production software' },
    { val: 100, suffix: '%', label: 'Work and IP owned by you' },
  ]

  return (
    <motion.div ref={ref} className="manifesto-stats"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {stats.map((s, i) => (
        <motion.div key={s.label} className="manifesto-stat"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="manifesto-stat-val">
            <AnimCounter target={s.val} suffix={s.suffix} />
          </span>
          <span className="manifesto-stat-label">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── Skill-progress horizontal bars ── */
function CapabilityBars() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const capabilities = [
    { label: 'Strategic assessment', color: 'hsl(17, 85%, 62%)' },
    { label: 'Governance & compliance', color: 'hsl(181, 85%, 75%)' },
    { label: 'Capability building', color: 'hsl(37, 85%, 74%)' },
    { label: 'Customized delivery & implementation', color: 'hsl(198, 78%, 65%)' },
  ]

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: '0.8rem', padding: '2rem var(--pad-x)',
        maxWidth: 820, margin: '0 auto',
      }}
    >
      {capabilities.map((c, i) => (
        <motion.div key={c.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: '0.6rem 1.2rem',
            background: `${c.color}12`,
            border: `1px solid ${c.color}33`,
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: c.color,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {c.label}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function ManifestoBreak() {
  return (
    <div id="section-manifesto" className="manifesto-break" aria-hidden="true"
      style={{ position: 'relative', overflow: 'hidden' }}>

      {/* Hex particle background */}
      <HexField />

      {/* Oscilloscope at bottom */}
      <SignalCanvas />

      {/* Top divider */}
      <motion.div className="prism-divider"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      />

      <BigStatement />
      <MicroStats />
      <CapabilityBars />

      {/* Two ticker tapes */}
      <motion.div style={{ marginTop: '1.5rem', overflow: 'hidden' }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <Ticker
          text="Strategic Assessment  ·  Governance Frameworks  ·  EU AI Act Compliance  ·  Vendor Evaluation  ·  Build vs Buy  ·  Right-Fit Implementation  ·  Executable Roadmaps  ·"
          accent="#FF7E4A" speed="70s"
        />
        <Ticker
          text="Capability Building  ·  Production LLM Systems  ·  RAG Architecture  ·  Agentic Pipelines  ·  Full-Stack AI Products  ·  Knowledge Transfer  ·  Fixed-Scope Pilots  ·"
          accent="#97FEFF" speed="76s" reverse
        />
      </motion.div>

      {/* Bottom divider */}
      <motion.div className="prism-divider"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
