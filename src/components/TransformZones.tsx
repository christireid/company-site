import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PI2 } from '../utils/animation'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'
const rand = (lo: number, hi: number) => Math.random() * (hi - lo) + lo

/* ── Radar / polygon chart ───────────────────────────────────── */
function RadarChart({ values, color }: { values: number[]; color: string }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const N = values.length
  const SIZE = 72, CX = SIZE / 2, CY = SIZE / 2, RMAX = 28
  const angle = (i: number) => (i / N) * PI2 - Math.PI / 2
  const pt    = (i: number, r: number) => ({ x: CX + r * Math.cos(angle(i)), y: CY + r * Math.sin(angle(i)) })

  const polyFull = values.map((v, i) => pt(i, v * RMAX))
  const polyPath = polyFull.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <div ref={ref} className="radar-chart-wrap" aria-hidden="true">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {[0.33, 0.66, 1.0].map((f, ri) => {
          const d = values.map((_, i) => pt(i, RMAX * f)).map((p, i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'
          return <path key={ri} d={d} fill="none" stroke="rgba(151,254,255,0.07)" strokeWidth="0.8" />
        })}
        {values.map((_, i) => {
          const p = pt(i, RMAX)
          return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="rgba(151,254,255,0.09)" strokeWidth="0.6" />
        })}
        <motion.path d={polyPath} fill={`${color}1A`} stroke={color} strokeWidth="1.4" strokeLinejoin="round"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }} />
        {polyFull.map((p, i) => (
          <motion.circle key={i} cx={p.x} cy={p.y} r={2.2} fill={color} opacity={0.9}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }} />
        ))}
      </svg>
    </div>
  )
}


/* ── Triangle interconnection diagram ───────────────────────── */
function LoopDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const S = 300
    canvas.width = canvas.height = S
    const CX = S / 2, CY = S / 2
    const R = 112

    // rgb() strings so we can compose rgba() with any alpha
    const NODES = [
      { icon:'◈', rgb:'240,122,76',  css:'hsl(17,85%,62%)',  angle: -90 }, // Strategy — top
      { icon:'◎', rgb:'137,244,245', css:'hsl(181,85%,75%)', angle:  30 }, // Training — bottom-right
      { icon:'⬡', rgb:'245,202,132', css:'hsl(37,85%,74%)',  angle: 150 }, // Implementation — bottom-left
    ]

    const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`

    const toXY = (deg: number) => ({
      x: CX + R * Math.cos(deg * Math.PI / 180),
      y: CY + R * Math.sin(deg * Math.PI / 180),
    })

    // Three clockwise edges: 0→1→2→0
    const edges = [0, 1, 2].map(i => ({
      from: i, to: (i + 1) % 3,
      orbs: Array.from({ length: 3 }, (_, k) => ({
        t:     ((k / 3) + i * 0.11) % 1,
        speed: 0.0022 + i * 0.0004,
        size:  k === 0 ? 4.5 : k === 1 ? 3 : 2,
      })),
    }))

    const pulsePhases = [0, 2.1, 4.2]
    let frame = 0

    const entry = onFrame(() => {
      frame++
      ctx.clearRect(0, 0, S, S)

      const pts = NODES.map(n => toXY(n.angle))

      // ── Triangle edges ─────────────────────────────────────
      edges.forEach(edge => {
        const a = pts[edge.from], b = pts[edge.to]
        const rA = NODES[edge.from].rgb, rB = NODES[edge.to].rgb

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, rgba(rA, 0.7))
        grad.addColorStop(1, rgba(rB, 0.7))

        // Glow pass
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad; ctx.lineWidth = 10; ctx.globalAlpha = 0.15; ctx.stroke()
        ctx.globalAlpha = 1

        // Main line
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad; ctx.lineWidth = 1.8; ctx.stroke()

        // Arrowhead at 82%
        const t = 0.82
        const ax = a.x + t*(b.x-a.x), ay = a.y + t*(b.y-a.y)
        const len = Math.hypot(b.x-a.x, b.y-a.y)
        const dx = (b.x-a.x)/len, dy = (b.y-a.y)/len
        const as = 7
        ctx.beginPath()
        ctx.moveTo(ax + dx*as, ay + dy*as)
        ctx.lineTo(ax - dy*as*0.45 - dx*as*0.55, ay + dx*as*0.45 - dy*as*0.55)
        ctx.lineTo(ax + dy*as*0.45 - dx*as*0.55, ay - dx*as*0.45 - dy*as*0.55)
        ctx.closePath()
        ctx.fillStyle = rgba(rB, 0.85)
        ctx.fill()
      })

      // ── Orbs ───────────────────────────────────────────────
      edges.forEach(edge => {
        const a = pts[edge.from], b = pts[edge.to]
        const rgb = NODES[edge.from].rgb
        for (const orb of edge.orbs) {
          orb.t = (orb.t + orb.speed) % 1
          const px = a.x + orb.t*(b.x-a.x)
          const py = a.y + orb.t*(b.y-a.y)
          const alpha = Math.min(1, Math.sin(orb.t * Math.PI) * 1.5)

          const gd = ctx.createRadialGradient(px, py, 0, px, py, orb.size * 4)
          gd.addColorStop(0,    rgba(rgb, 1))
          gd.addColorStop(0.35, rgba(rgb, 0.6))
          gd.addColorStop(1,    rgba(rgb, 0))
          ctx.globalAlpha = alpha * 0.8
          ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(px, py, orb.size*4, 0, PI2); ctx.fill()
          ctx.globalAlpha = alpha
          ctx.fillStyle = rgba(rgb, 1)
          ctx.beginPath(); ctx.arc(px, py, orb.size, 0, PI2); ctx.fill()
          ctx.globalAlpha = 1
        }
      })

      // ── Node circles ───────────────────────────────────────
      NODES.forEach((node, ni) => {
        const p = pts[ni]
        const pulse = 0.55 + 0.45 * Math.sin(frame * 0.025 + pulsePhases[ni])
        const rgb = node.rgb

        // Halo
        const haloR = 32 + 4*pulse
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR)
        halo.addColorStop(0, rgba(rgb, 0.28)); halo.addColorStop(1, rgba(rgb, 0))
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(p.x, p.y, haloR, 0, PI2); ctx.fill()

        // Ring
        const ringR = 20 + 3*pulse
        ctx.beginPath(); ctx.arc(p.x, p.y, ringR, 0, PI2)
        ctx.strokeStyle = rgba(rgb, 0.55 + 0.4*pulse)
        ctx.lineWidth = 2.2; ctx.stroke()

        ctx.fillStyle = 'rgba(4,4,12,0.96)'
        ctx.beginPath(); ctx.arc(p.x, p.y, ringR-1.5, 0, PI2); ctx.fill()

        ctx.fillStyle = rgba(rgb, 1)
        ctx.font = 'bold 15px monospace'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(node.icon, p.x, p.y)
      })

      // ── Center "connected" badge ────────────────────────────
      const cp = 0.5 + 0.5 * Math.sin(frame * 0.02)
      const cr = 30 + 1.5*cp

      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, cr*2)
      bg.addColorStop(0, `rgba(20,140,220,${0.28+0.1*cp})`); bg.addColorStop(1, 'rgba(20,140,220,0)')
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(CX, CY, cr*2, 0, PI2); ctx.fill()

      ctx.beginPath(); ctx.arc(CX, CY, cr, 0, PI2)
      ctx.strokeStyle = `rgba(20,160,240,${0.75+0.2*cp})`; ctx.lineWidth = 2; ctx.stroke()

      ctx.fillStyle = 'rgba(4,8,22,0.97)'
      ctx.beginPath(); ctx.arc(CX, CY, cr-1.5, 0, PI2); ctx.fill()

      ctx.fillStyle = `rgba(60,180,255,${0.88+0.1*cp})`
      ctx.font = '7px monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('connected', CX, CY)
    }, canvas)

    return () => removeFrame(entry)
  }, [])

  const nodeLabels = [
    { label:'Strategy',       css:'hsl(17,85%,62%)',  lx: 50, ly: 2  },
    { label:'Training',       css:'hsl(181,85%,75%)', lx: 88, ly: 77 },
    { label:'Implementation', css:'hsl(37,85%,74%)',  lx: 12, ly: 77 },
  ]

  return (
    <div className="loop-diagram-wrap" style={{ position:'relative' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} aria-hidden="true" />
      {nodeLabels.map(n => (
        <span key={n.label} className="loop-node-label"
          style={{ left:`${n.lx}%`, top:`${n.ly}%`, color: n.css,
            transform: n.ly < 20 ? 'translate(-50%,-160%)' : 'translate(-50%,70%)' }}>
          {n.label}
        </span>
      ))}
    </div>
  )
}

/* ── Zone card mini skill tags (no percentages) ─────────────────────────── */
function SkillMeters({ skills, color }: { skills: { label: string }[]; color: string }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'1rem' }}>
      {skills.map(s => (
        <span key={s.label} style={{
          fontFamily:'var(--font-mono)', fontSize:'0.68rem',
          color: color,
          background: `${color}12`,
          border: `1px solid ${color}33`,
          padding: '0.35rem 0.75rem',
          borderRadius: '4px',
          letterSpacing:'0.04em'
        }}>
          {s.label}
        </span>
      ))}
    </div>
  )
}

/* ── Triangle Cascade Background Animation ──────────────────── */
function TriangleCascade() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width = canvas.offsetWidth || window.innerWidth
      H = canvas.height = canvas.offsetHeight || 800
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Create floating triangles - using hero gradient colors
    const triangles = Array.from({ length: 14 }, () => ({
      x: rand(0, 1),
      y: rand(-0.2, 1.2),
      size: rand(24, 72),
      rotation: rand(0, PI2),
      rotSpeed: rand(-0.003, 0.003),
      vx: rand(-0.0004, 0.0004),
      vy: rand(0.0002, 0.0008), // Gentle downward drift
      opacity: rand(0.12, 0.28),
      hue: [17, 37, 181, 198][Math.floor(rand(0, 4))], // Hero gradient colors only
    }))

    const entry = onFrame(() => {
      ctx.clearRect(0, 0, W, H)

      triangles.forEach(tri => {
        // Update position
        tri.x += tri.vx
        tri.y += tri.vy
        tri.rotation += tri.rotSpeed

        // Wrap around
        if (tri.y > 1.3) tri.y = -0.3
        if (tri.x < -0.2) tri.x = 1.2
        if (tri.x > 1.2) tri.x = -0.2

        const px = tri.x * W
        const py = tri.y * H

        ctx.save()
        ctx.translate(px, py)
        ctx.rotate(tri.rotation)

        // Draw triangle with gradient fill and glow
        const gradient = ctx.createLinearGradient(-tri.size/2, -tri.size/2, tri.size/2, tri.size/2)
        gradient.addColorStop(0, `hsla(${tri.hue}, 88%, 68%, ${tri.opacity * 0.85})`)
        gradient.addColorStop(1, `hsla(${tri.hue}, 88%, 78%, ${tri.opacity * 0.55})`)

        // Add subtle shadow/glow
        ctx.shadowColor = `hsla(${tri.hue}, 88%, 75%, ${tri.opacity * 0.4})`
        ctx.shadowBlur = 12

        ctx.beginPath()
        ctx.moveTo(0, -tri.size * 0.577) // Top vertex
        ctx.lineTo(-tri.size * 0.5, tri.size * 0.289) // Bottom left
        ctx.lineTo(tri.size * 0.5, tri.size * 0.289) // Bottom right
        ctx.closePath()

        ctx.fillStyle = gradient
        ctx.fill()

        // Stroke with glow
        ctx.strokeStyle = `hsla(${tri.hue}, 88%, 72%, ${tri.opacity * 0.95})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.shadowBlur = 0

        ctx.restore()
      })
    }, canvas)

    return () => {
      removeFrame(entry)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="triangle-cascade-canvas" aria-hidden="true" />
}

const zones = [
  {
    id:'strategy', icon:'◈', color:'hsl(17, 85%, 62%)', // Warm orange from hero gradient
    radar: [0.95, 0.6, 0.55, 0.75, 0.85],
    skills: [
      { label: 'Clarity' },
      { label: 'Governance' },
      { label: 'Roadmapping' },
    ],
    title:'The honest answer before the investment.',
    insight:"Most AI projects fail before a single line of code is written — not from bad technology, but from nobody being willing to say 'this won't work here' before the budget was committed.",
    body:'Evaluated rigorously, documented precisely, priced to a fixed scope. No framework that needs a second consultant to interpret. No roadmap written to ensure you call us back next quarter.',
    tags:['Tool selection','Policy frameworks','AI governance','Regulatory mapping','Roadmapping'],
    deliverables:['AI readiness assessment','Tool & vendor evaluation','Build vs buy analysis','Governance framework','Regulatory mapping (EU AI Act)','Responsible AI guardrails','Multi-year roadmap','Exec-level briefing & knowledge transfer'],
    cta:'Get a straight answer →',
    signal: 3,
  },
  {
    id:'training', icon:'◎', color:'hsl(181, 85%, 75%)', // Bright cyan from hero gradient
    radar: [0.7, 0.98, 0.65, 0.9, 0.7],
    skills: [
      { label: 'Curriculum' },
      { label: 'Facilitation' },
      { label: 'Retention' },
    ],
    title:'Skills that survive the first week back.',
    insight:"The gap between 'we sent everyone on an AI course' and 'our team actually uses AI well' is enormous. It's not a tools problem. It's a training design problem.",
    body:'Programmes built around your team\'s actual workflows, not a vendor\'s sample dataset. Designed by engineers who taught developers for four years. Your people leave using these tools — not just knowing the theory.',
    tags:['Curriculum design','Workshop facilitation','Documentation','Mentoring','Assessment design'],
    deliverables:['Custom curriculum design','Self-paced learning materials','Live workshops (half-day to multi-day)','LLM & AI tool training','Workflow design & optimization','Technical documentation','Assessment & assignment creation','Mentoring & coaching programmes'],
    cta:'Build lasting capability →',
    signal: 4,
  },
  {
    id:'implementation', icon:'⬡', color:'hsl(37, 85%, 74%)', // Warm peach from hero gradient
    radar: [0.65, 0.7, 0.98, 0.88, 0.92],
    skills: [
      { label: 'Architecture' },
      { label: 'Integration' },
      { label: 'Delivery' },
    ],
    title:'The right implementation for your needs.',
    insight:'The gap between a demo that impresses a board and a system users actually rely on is enormous. Most AI projects live in that gap forever. We implement production-ready solutions — whether that means rigorous vendor integration, selective custom development, or hybrid approaches.',
    body:'End-to-end AI implementation: we evaluate your requirements, select the right approach (vendor platform, custom build, or hybrid), architect the solution, integrate with your existing systems, and deploy to production. From model selection through to operational handover — built for your infrastructure and operational reality.',
    tags:['Implementation planning','Vendor integration','Selective custom dev','LLM & RAG systems','Production deployment'],
    deliverables:['Implementation planning','Vendor solution integration','Selective custom development','LLM & RAG system architecture','Production deployment & operations','System integration & data pipelines','Client-facing interfaces','Complete knowledge transfer'],
    cta:'Start implementing →',
    signal: 4,
  },
]

export default function TransformZones() {
  return (
    <section id="section-transform" className="section section-transform" aria-label="What we do">
      <TriangleCascade />
      <div className="section-content" style={{position:'relative',zIndex:2}}>
        <motion.div className="section-header"
          initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.3}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}>
          <div className="section-eyebrow">Three disciplines</div>
          <h2 className="section-title">Three disciplines.<br/><em className="text-prism">One integrated practice.</em></h2>
        </motion.div>

        {/* Loop diagram + explainer */}
        <div className="loop-diagram-row">
          <LoopDiagram />
          <motion.div className="loop-explainer"
            initial={{opacity:0,x:28}} whileInView={{opacity:1,x:0}}
            viewport={{once:true,amount:0.3}}
            transition={{duration:0.9,delay:0.3,ease:[0.16,1,0.3,1]}}>
            <p className="loop-explainer-lead">When the same people define the strategy, run the training, and build the software, nothing falls through the cracks between disciplines. The strategy informs the training. The training shapes what gets built. The build reveals what the strategy missed.</p>
            <div className="loop-conn-list">
              {[
                {from:'Strategy',    to:'Training',    note:'turns direction into skill'},
                {from:'Training',    to:'Implementation', note:'turns skill into product'},
                {from:'Implementation', to:'Strategy',    note:'turns product back into insight'},
              ].map(c => (
                <div key={c.from} className="loop-conn-row">
                  <span className="lc-from">{c.from}</span>
                  <span className="lc-arrow">→</span>
                  <span className="lc-to">{c.to}</span>
                  <span className="lc-note">{c.note}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Zone cards */}
        <div className="zones-grid" style={{marginTop:'3rem'}}>
          {zones.map((zone, i) => (
            <motion.div key={zone.id} className={`zone-card zone-${zone.id}`}
              style={{'--svc-accent': zone.color} as React.CSSProperties}
              initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,amount:0.12}}
              transition={{delay:i*0.12,duration:1.0,ease:[0.16,1,0.3,1]}}>

              {/* Card header: icon + label + radar (no progress ring) */}
              <div className="zone-card-top"
                style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap' }}>
                <span className="zone-card-icon" style={{color:zone.color}}>{zone.icon}</span>
                <span className="zone-label">{zone.id.charAt(0).toUpperCase()+zone.id.slice(1)}</span>
                <div style={{ flex:1 }}/>
                <RadarChart values={zone.radar} color={zone.color} />
              </div>

              <h3 className="zone-title">{zone.title}</h3>
              <div className="zone-insight" style={{borderLeftColor:zone.color+'55'}}>
                <span className="zone-insight-mark" style={{color:zone.color}}>▸</span>
                <span>{zone.insight}</span>
              </div>
              <p className="zone-body-short">{zone.body}</p>

              {/* Skill meters */}
              <SkillMeters skills={zone.skills} color={zone.color} />

              <div className="zone-tags" style={{marginTop:'1rem'}}>
                {zone.tags.map(tag => <span className="zone-tag" key={tag}>{tag}</span>)}
              </div>

              <a href="#section-contact" className="svc-cta"
                style={{borderColor: zone.color+'33', color: zone.color+'BB'}}
                onClick={e=>{e.preventDefault();document.getElementById('section-contact')?.scrollIntoView({behavior:'smooth'})}}>
                {zone.cta}
              </a>
              <div className="zone-glow" aria-hidden="true"/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
