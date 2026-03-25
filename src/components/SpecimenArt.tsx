import React, { useEffect, useRef } from 'react'
import { PI2 } from '../utils/animation'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'

const rand = (a: number, b: number) => Math.random() * (b - a) + a

/* ════════════════════════════════════════════════════════════════
   1. PRISMATIC CRYSTAL — iceberg/mountain with rainbow scan lines
   Inspired by: crystalline form + horizontal spectral dispersion bands
   ════════════════════════════════════════════════════════════════ */
export function PrismaticCrystal({ width = 520, height = 340 }: { width?: number; height?: number }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: false, margin: '-80px' })

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    let t = 0

    // Crystal outline — diamond / mountain silhouette polygon
    const CX = width / 2, CY = height / 2
    const crystalPts = [
      { x: CX,         y: 20           }, // apex
      { x: CX + 180,   y: CY - 40      }, // right upper
      { x: CX + 220,   y: CY + 60      }, // right mid
      { x: CX + 140,   y: height - 30  }, // right base
      { x: CX,         y: height - 10  }, // base center
      { x: CX - 140,   y: height - 30  }, // left base
      { x: CX - 220,   y: CY + 60      }, // left mid
      { x: CX - 180,   y: CY - 40      }, // left upper
    ]

    // Annotation lines: thin lines extending from edges outward
    const annotations = [
      { from: crystalPts[1], dx: 90, dy: -20, label: 'STRATEGY LAYER' },
      { from: crystalPts[6], dx: -90, dy: 20, label: 'TRAINING CORE' },
      { from: crystalPts[3], dx: 80, dy: 30,  label: 'OUTPUT VECTOR' },
    ]

    // Floating data text columns (left & right, small monospace numbers)
    const leftCols = Array.from({ length: 14 }, (_, i) => ({
      y: 30 + i * 22,
      txt: `${(Math.random() * 99.9).toFixed(1).padStart(5, '0')}  ${['◈','◎','⬡','◐','◑','▸','✦'][i % 7]}`,
    }))
    const rightCols = Array.from({ length: 14 }, (_, i) => ({
      y: 30 + i * 22,
      txt: `${['AI', 'ML', 'LLM', 'RAG', 'VEC', 'ATN', 'EMB'][i % 7]}  ${(Math.random() * 0.999).toFixed(3)}`,
    }))

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      // ── Crystal body glow ──
      const bg = ctx.createRadialGradient(CX, CY, 40, CX, CY, 200)
      bg.addColorStop(0,   'rgba(180,120,255,0.07)')
      bg.addColorStop(0.5, 'rgba(80,200,255,0.04)')
      bg.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      // ── Crystal outline clip path ──
      ctx.save()
      ctx.beginPath()
      crystalPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      ctx.closePath()
      ctx.clip()

      // ── Horizontal spectral scan lines — the signature rainbow band ──
      const scanProgress = (Math.sin(t * 0.008) * 0.5 + 0.5)
      const scanY = 20 + scanProgress * (height - 40)
      const bandH = 70

      // Full crystal fill — dark base
      ctx.fillStyle = 'rgba(10,8,22,0.82)'
      ctx.fillRect(0, 0, width, height)

      // Rainbow band
      for (let dy = -bandH / 2; dy < bandH / 2; dy++) {
        const t2 = (dy + bandH / 2) / bandH
        const hue = 280 + t2 * 240  // purple → red → orange → yellow → green → cyan → blue
        const alpha = (1 - Math.abs(dy) / (bandH / 2)) * 0.55
        ctx.strokeStyle = `hsla(${hue}, 100%, 72%, ${alpha})`
        ctx.lineWidth = 1.1
        ctx.beginPath()
        ctx.moveTo(0, scanY + dy)
        ctx.lineTo(width, scanY + dy)
        ctx.stroke()
      }

      // Secondary fainter bands
      const scan2Y = (scanY + height * 0.4) % height
      for (let dy = -25; dy < 25; dy++) {
        const hue = 180 + (dy + 25) / 50 * 120
        const alpha = (1 - Math.abs(dy) / 25) * 0.18
        ctx.strokeStyle = `hsla(${hue}, 100%, 80%, ${alpha})`
        ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(0, scan2Y + dy); ctx.lineTo(width, scan2Y + dy); ctx.stroke()
      }

      // ── Fine horizontal grid inside crystal (dark region) ──
      for (let y = 20; y < height; y += 18) {
        ctx.strokeStyle = 'rgba(151,254,255,0.04)'
        ctx.lineWidth = 0.5
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
      }

      // ── Sparkle particles in lower dark portion ──
      const sparkCount = 60
      ctx.globalCompositeOperation = 'screen'
      for (let i = 0; i < sparkCount; i++) {
        const sx = rand(CX - 180, CX + 180)
        const sy = CY + 30 + rand(0, height * 0.4 - 30)
        const pulse = Math.sin(t * 0.04 + i * 0.7) * 0.5 + 0.5
        const r = 0.5 + pulse * 1.5
        ctx.fillStyle = `rgba(220,230,255,${0.1 + pulse * 0.4})`
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, PI2); ctx.fill()
      }

      ctx.restore()
      ctx.globalCompositeOperation = 'source-over'

      // ── Crystal outline strokes ──
      ctx.beginPath()
      crystalPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      ctx.closePath()
      const outlineGrad = ctx.createLinearGradient(0, 0, 0, height)
      outlineGrad.addColorStop(0,   'rgba(220,180,255,0.6)')
      outlineGrad.addColorStop(0.4, 'rgba(151,254,255,0.5)')
      outlineGrad.addColorStop(0.6, 'rgba(255,200,80,0.35)')
      outlineGrad.addColorStop(1,   'rgba(180,120,255,0.2)')
      ctx.strokeStyle = outlineGrad
      ctx.lineWidth = 1.2
      ctx.stroke()

      // Internal facet lines
      ctx.strokeStyle = 'rgba(151,254,255,0.08)'
      ctx.lineWidth = 0.6
      // apex to mid-points
      ;[2, 5].forEach(pi => {
        ctx.beginPath(); ctx.moveTo(CX, 20); ctx.lineTo(crystalPts[pi].x, crystalPts[pi].y); ctx.stroke()
      })
      // horizontal center
      ctx.beginPath(); ctx.moveTo(crystalPts[6].x, CY); ctx.lineTo(crystalPts[2].x, CY); ctx.stroke()

      // ── Annotation lines ──
      annotations.forEach((a, ai) => {
        const fade = 0.5 + 0.3 * Math.sin(t * 0.012 + ai * 1.4)
        ctx.strokeStyle = `rgba(151,254,255,${fade * 0.5})`
        ctx.lineWidth = 0.7
        const ex = a.from.x + a.dx, ey = a.from.y + a.dy
        ctx.beginPath(); ctx.moveTo(a.from.x, a.from.y); ctx.lineTo(ex, ey); ctx.stroke()
        // tick at end
        ctx.beginPath(); ctx.moveTo(ex - 4, ey); ctx.lineTo(ex + 4, ey); ctx.stroke()
        ctx.fillStyle = `rgba(151,254,255,${fade * 0.55})`
        ctx.font = '7px monospace'
        ctx.textAlign = a.dx > 0 ? 'left' : 'right'
        ctx.fillText(a.label, ex + (a.dx > 0 ? 6 : -6), ey + 1)
      })

      // ── Left data column ──
      ctx.font = '7px monospace'
      ctx.textAlign = 'left'
      leftCols.forEach((c, i) => {
        const a = 0.18 + 0.12 * Math.sin(t * 0.006 + i * 0.3)
        ctx.fillStyle = `rgba(151,254,255,${a})`
        ctx.fillText(c.txt, 8, c.y)
      })

      // ── Right data column ──
      ctx.textAlign = 'right'
      rightCols.forEach((c, i) => {
        const a = 0.18 + 0.12 * Math.sin(t * 0.007 + i * 0.4 + 1.5)
        ctx.fillStyle = `rgba(255,200,120,${a})`
        ctx.fillText(c.txt, width - 8, c.y)
      })

      // ── Crosshair overlay at scan peak ──
      const chAlpha = 0.12 + 0.08 * Math.sin(t * 0.02)
      ctx.strokeStyle = `rgba(151,254,255,${chAlpha})`
      ctx.lineWidth = 0.5
      ctx.setLineDash([4, 8])
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(width, scanY); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, height); ctx.stroke()
      ctx.setLineDash([])

      // ── Corner registration marks ──
      const marks = [[12,12],[width-12,12],[12,height-12],[width-12,height-12]]
      ctx.strokeStyle = 'rgba(151,254,255,0.18)'
      ctx.lineWidth = 0.7
      marks.forEach(([mx, my]) => {
        const s = 8
        ctx.beginPath(); ctx.moveTo(mx - s, my); ctx.lineTo(mx, my); ctx.lineTo(mx, my - s); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(mx + (mx > width/2 ? s : -s), my); ctx.lineTo(mx, my); ctx.lineTo(mx, my + s); ctx.stroke()
      })

    }, canvas)

    return () => removeFrame(entry)
  }, [width, height])

  return (
    <div ref={wrapRef} className="specimen-wrap specimen-crystal">
      <canvas ref={ref} className="specimen-canvas" aria-hidden="true"
        style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   2. BOTANICAL SPECIMEN — iridescent flower/organic form + technical overlays
   Inspired by: holographic petals, neon stem, annotation lines, data columns
   ════════════════════════════════════════════════════════════════ */
export function BotanicalSpecimen({ width = 460, height = 380 }: { width?: number; height?: number }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: false, margin: '-60px' })

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    let t = 0
    const CX = width / 2, CY = height * 0.52

    // Petal definitions — 6 petals at different angles with iridescent fills
    const petals = [
      { angle: -90,  len: 110, w: 65,  hue1: 280, hue2: 200 },
      { angle: -30,  len: 95,  w: 58,  hue1: 320, hue2: 160 },
      { angle:  30,  len: 105, w: 62,  hue1: 200, hue2: 280 },
      { angle:  90,  len: 90,  w: 55,  hue1: 160, hue2: 240 },
      { angle: 150,  len: 100, w: 60,  hue1: 240, hue2: 320 },
      { angle: 210,  len: 95,  w: 57,  hue1: 180, hue2: 300 },
    ]

    // Stem segments
    const stemY = CY + 50
    const stemBot = height - 20

    // Annotation data
    const annots = [
      { x: CX + 120, y: CY - 60, label: 'INFERENCE LAYER', sub: '→ LLM routing' },
      { x: CX - 120, y: CY + 20, label: 'TRAINING CORPUS', sub: '→ 10k+ examples' },
      { x: CX + 100, y: CY + 80, label: 'OUTPUT NODE',     sub: '→ production' },
    ]

    const drawPetal = (angle: number, len: number, w: number, hue1: number, hue2: number, phase: number) => {
      const rad = (angle + t * 0.05) * Math.PI / 180  // very slow rotation
      const ex = CX + len * Math.cos(rad), ey = CY + len * Math.sin(rad)
      const midx = CX + (len * 0.5) * Math.cos(rad) + w * 0.3 * Math.cos(rad + Math.PI / 2)
      const midy = CY + (len * 0.5) * Math.sin(rad) + w * 0.3 * Math.sin(rad + Math.PI / 2)

      ctx.save()
      ctx.globalAlpha = 0.72 + 0.12 * Math.sin(t * 0.018 + phase)

      // Petal gradient — iridescent shift
      const hShift = 20 * Math.sin(t * 0.012 + phase)
      const grad = ctx.createLinearGradient(CX, CY, ex, ey)
      grad.addColorStop(0,   `hsla(${hue1 + hShift},80%,72%,0.0)`)
      grad.addColorStop(0.3, `hsla(${hue1 + hShift},90%,78%,0.35)`)
      grad.addColorStop(0.6, `hsla(${(hue1+hue2)/2 + hShift},100%,82%,0.5)`)
      grad.addColorStop(1.0, `hsla(${hue2 + hShift},80%,68%,0.2)`)

      // Bezier petal shape
      const ctrl1x = CX + w * 0.8 * Math.cos(rad + 0.4), ctrl1y = CY + w * 0.8 * Math.sin(rad + 0.4)
      const ctrl2x = ex + w * 0.4 * Math.cos(rad + 0.4), ctrl2y = ey + w * 0.4 * Math.sin(rad + 0.4)
      const ctrl3x = ex + w * 0.4 * Math.cos(rad - 0.4), ctrl3y = ey + w * 0.4 * Math.sin(rad - 0.4)
      const ctrl4x = CX + w * 0.8 * Math.cos(rad - 0.4), ctrl4y = CY + w * 0.8 * Math.sin(rad - 0.4)

      ctx.beginPath()
      ctx.moveTo(CX, CY)
      ctx.bezierCurveTo(ctrl1x, ctrl1y, ctrl2x, ctrl2y, ex, ey)
      ctx.bezierCurveTo(ctrl3x, ctrl3y, ctrl4x, ctrl4y, CX, CY)
      ctx.fillStyle = grad
      ctx.fill()

      // Petal edge glow
      ctx.strokeStyle = `hsla(${hue1 + hShift},90%,82%,0.25)`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Veins inside petal
      ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 0.015 + phase)
      ctx.strokeStyle = `hsla(${hue2},90%,88%,0.6)`
      ctx.lineWidth = 0.5
      for (let v = 0; v < 3; v++) {
        const vx = CX + (len * 0.7) * Math.cos(rad + (v - 1) * 0.15)
        const vy = CY + (len * 0.7) * Math.sin(rad + (v - 1) * 0.15)
        ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(vx, vy); ctx.stroke()
      }
      ctx.restore()
    }

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      // Background glow
      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 180)
      bg.addColorStop(0,   'rgba(160,80,220,0.06)')
      bg.addColorStop(0.6, 'rgba(40,160,220,0.03)')
      bg.addColorStop(1,   'rgba(0,0,0,0)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)

      // ── Petals (drawn with screen blend for iridescence) ──
      ctx.globalCompositeOperation = 'screen'
      petals.forEach((p, i) => drawPetal(p.angle, p.len, p.w, p.hue1, p.hue2, i * 1.1))

      ctx.globalCompositeOperation = 'source-over'

      // ── Stem — neon glowing line ──
      const stemGrad = ctx.createLinearGradient(CX, stemY, CX, stemBot)
      stemGrad.addColorStop(0,   'rgba(255,160,80,0.7)')
      stemGrad.addColorStop(0.4, 'rgba(180,80,255,0.6)')
      stemGrad.addColorStop(0.8, 'rgba(80,200,255,0.5)')
      stemGrad.addColorStop(1,   'rgba(80,200,255,0.1)')
      // glow
      ctx.shadowColor = 'rgba(180,120,255,0.6)'
      ctx.shadowBlur = 12
      ctx.strokeStyle = stemGrad; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(CX, stemY); ctx.lineTo(CX, stemBot); ctx.stroke()
      ctx.shadowBlur = 0

      // Secondary parallel stems
      for (let s = -1; s <= 1; s += 2) {
        const ox = s * 3
        const sg2 = ctx.createLinearGradient(CX + ox, stemY, CX + ox, stemBot)
        sg2.addColorStop(0, 'rgba(151,254,255,0.25)')
        sg2.addColorStop(1, 'rgba(151,254,255,0.0)')
        ctx.strokeStyle = sg2; ctx.lineWidth = 0.7
        ctx.beginPath(); ctx.moveTo(CX + ox, stemY + 30); ctx.lineTo(CX + ox, stemBot - 20); ctx.stroke()
      }

      // Stem tick marks (measurement markers)
      for (let sy = stemY + 20; sy < stemBot - 10; sy += 24) {
        const tw = sy % 72 === 0 ? 8 : 4
        const ta = sy % 72 === 0 ? 0.35 : 0.15
        ctx.strokeStyle = `rgba(151,254,255,${ta})`
        ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(CX - tw, sy); ctx.lineTo(CX + tw, sy); ctx.stroke()
        if (sy % 72 === 0) {
          ctx.fillStyle = 'rgba(151,254,255,0.3)'
          ctx.font = '6px monospace'
          ctx.textAlign = 'left'
          ctx.fillText(`${Math.round((sy - stemY) / 2)}μ`, CX + 10, sy + 2)
        }
      }

      // Budding nodes on stem
      const buds = [{ y: stemY + 50, side: 1 }, { y: stemY + 110, side: -1 }, { y: stemY + 170, side: 1 }]
      buds.forEach(b => {
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.025 + b.y)
        const bx = CX + b.side * (12 + pulse * 4)
        ctx.strokeStyle = `rgba(255,200,80,${0.4 * pulse})`
        ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(CX, b.y); ctx.lineTo(bx, b.y - 14); ctx.stroke()
        ctx.fillStyle = `rgba(255,200,80,${0.5 * pulse})`
        ctx.beginPath(); ctx.arc(bx, b.y - 18, 3.5, 0, PI2); ctx.fill()
      })

      // ── Centre core ──
      const cPulse = 0.5 + 0.5 * Math.sin(t * 0.022)
      const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 22)
      cg.addColorStop(0,   `rgba(255,255,255,${0.7 + cPulse * 0.2})`)
      cg.addColorStop(0.4, `rgba(200,120,255,${0.5 + cPulse * 0.2})`)
      cg.addColorStop(1,   'rgba(80,200,255,0)')
      ctx.shadowColor = 'rgba(220,160,255,0.8)'; ctx.shadowBlur = 18
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(CX, CY, 22, 0, PI2); ctx.fill()
      ctx.shadowBlur = 0

      // ── Annotation lines with labels ──
      annots.forEach((a, ai) => {
        const fade = 0.6 + 0.3 * Math.sin(t * 0.014 + ai * 1.8)
        ctx.strokeStyle = `rgba(151,254,255,${fade * 0.5})`
        ctx.lineWidth = 0.7
        const dir = a.x > CX ? 1 : -1
        // horizontal tick line
        ctx.beginPath()
        ctx.moveTo(a.x - dir * 20, a.y)
        ctx.lineTo(a.x + dir * 35, a.y)
        ctx.stroke()
        // vertical drop
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(a.x, a.y + 12)
        ctx.stroke()
        ctx.fillStyle = `rgba(151,254,255,${fade * 0.65})`
        ctx.font = '7px monospace'
        ctx.textAlign = a.x > CX ? 'left' : 'right'
        ctx.fillText(a.label, a.x + dir * 5, a.y - 6)
        ctx.fillStyle = `rgba(151,254,255,${fade * 0.35})`
        ctx.font = '6.5px monospace'
        ctx.fillText(a.sub, a.x + dir * 5, a.y - 16)
      })

      // ── Left/right floating data streams ──
      ctx.font = '6.5px monospace'
      for (let row = 0; row < 16; row++) {
        const y = 18 + row * 22
        const ta = 0.12 + 0.08 * Math.sin(t * 0.006 + row * 0.4)
        ctx.textAlign = 'left'
        ctx.fillStyle = `rgba(200,160,255,${ta})`
        ctx.fillText(`${row.toString().padStart(2,'0')}: ${(rand(0,1)).toFixed(4)} [${['SYN','REF','MAP','EXE','INF','OPT','LOG'][row%7]}]`, 6, y)
        ctx.textAlign = 'right'
        ctx.fillStyle = `rgba(100,220,255,${ta * 0.9})`
        ctx.fillText(`${['STRAT','TRAIN','DEV','ALIGN','EXEC','TRANS','OUT'][row%7]} ▸ ${(row/15*100).toFixed(1)}%`, width - 6, y)
      }

      // ── Corner registration marks ──
      ctx.strokeStyle = 'rgba(151,254,255,0.2)'
      ctx.lineWidth = 0.8
      const cmarks = [[10,10],[width-10,10],[10,height-10],[width-10,height-10]]
      cmarks.forEach(([mx, my]) => {
        const s = 9
        const ox = mx < width / 2 ? 1 : -1
        const oy = my < height / 2 ? 1 : -1
        ctx.beginPath()
        ctx.moveTo(mx, my + oy * s)
        ctx.lineTo(mx, my)
        ctx.lineTo(mx + ox * s, my)
        ctx.stroke()
      })

    }, canvas)

    return () => removeFrame(entry)
  }, [width, height])

  return (
    <div ref={wrapRef} className="specimen-wrap specimen-botanical">
      <canvas ref={ref} className="specimen-canvas" aria-hidden="true"
        style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   3. SIGNAL TOPOLOGY — network nodes with iridescent data streams
   Unique form: orbital rings + node clusters + flowing data ribbons
   ════════════════════════════════════════════════════════════════ */
export function SignalTopology({ width = 480, height = 300 }: { width?: number; height?: number }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: false, margin: '-60px' })

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    let t = 0
    const CX = width / 2, CY = height / 2

    // Node constellation
    const nodes = [
      { id: 0, xf: 0.50, yf: 0.50, r: 18, color: '#FFFFFF',  label: 'Core',       hue: 200 },
      { id: 1, xf: 0.22, yf: 0.22, r: 12, color: '#FF7E4A',  label: 'Strategy',   hue: 20  },
      { id: 2, xf: 0.78, yf: 0.22, r: 12, color: '#97FEFF',  label: 'Training',   hue: 185 },
      { id: 3, xf: 0.78, yf: 0.78, r: 12, color: '#FFD040',  label: 'Dev',        hue: 48  },
      { id: 4, xf: 0.22, yf: 0.78, r: 12, color: '#CC88FF',  label: 'Align',      hue: 285 },
      { id: 5, xf: 0.50, yf: 0.12, r:  8, color: '#FF88BB',  label: 'LLM',        hue: 340 },
      { id: 6, xf: 0.88, yf: 0.50, r:  8, color: '#88FFCC',  label: 'RAG',        hue: 160 },
      { id: 7, xf: 0.50, yf: 0.88, r:  8, color: '#88BBFF',  label: 'Output',     hue: 220 },
      { id: 8, xf: 0.12, yf: 0.50, r:  8, color: '#FFBB88',  label: 'Policy',     hue: 30  },
    ]

    const edges = [
      [0,1],[0,2],[0,3],[0,4],
      [0,5],[0,6],[0,7],[0,8],
      [1,5],[1,8],[2,5],[2,6],
      [3,6],[3,7],[4,7],[4,8],
    ]

    // Packets on edges
    const packets = edges.map((e, i) => ({
      t: Math.random(), speed: 0.004 + Math.random() * 0.005, ei: i,
    }))

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, width, height)

      // Background subtle radial
      const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, 200)
      bg.addColorStop(0, 'rgba(80,40,140,0.05)')
      bg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)

      // ── Orbital rings ──
      ctx.globalCompositeOperation = 'screen'
      ;[70, 130, 185].forEach((r, ri) => {
        const phase = t * 0.003 * (ri + 1)
        for (let a = 0; a < PI2; a += 0.02) {
          const hue = ((a / PI2) * 360 + phase * 80) % 360
          const alpha = 0.03 + 0.015 * Math.sin(a * 3 + phase)
          ctx.strokeStyle = `hsla(${hue},90%,70%,${alpha})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.arc(CX, CY, r, a, a + 0.025)
          ctx.stroke()
        }
      })

      ctx.globalCompositeOperation = 'source-over'

      // ── Edges with gradient ──
      edges.forEach(([ai, bi]) => {
        const na = nodes[ai], nb = nodes[bi]
        const ax = na.xf * width, ay = na.yf * height
        const bx = nb.xf * width, by = nb.yf * height
        const grad = ctx.createLinearGradient(ax, ay, bx, by)
        grad.addColorStop(0, na.color + '33')
        grad.addColorStop(1, nb.color + '33')
        ctx.strokeStyle = grad; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke()
      })

      // ── Flowing packets ──
      ctx.globalCompositeOperation = 'screen'
      packets.forEach(pk => {
        pk.t = (pk.t + pk.speed) % 1
        const [ai, bi] = edges[pk.ei]
        const na = nodes[ai], nb = nodes[bi]
        const ax = na.xf * width, ay = na.yf * height
        const bx = nb.xf * width, by = nb.yf * height
        const px = ax + (bx - ax) * pk.t
        const py = ay + (by - ay) * pk.t
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 8)
        pg.addColorStop(0, na.color + 'EE')
        pg.addColorStop(1, na.color + '00')
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 8, 0, PI2); ctx.fill()
      })
      ctx.globalCompositeOperation = 'source-over'

      // ── Nodes ──
      nodes.forEach(n => {
        const nx = n.xf * width, ny = n.yf * height
        const pulse = 0.55 + 0.45 * Math.sin(t * 0.02 + n.id * 0.9)

        // outer glow halo
        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r + 14)
        halo.addColorStop(0, n.color + '20')
        halo.addColorStop(1, n.color + '00')
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(nx, ny, n.r + 14, 0, PI2); ctx.fill()

        // iridescent ring
        const ringGrad = ctx.createLinearGradient(nx - n.r, ny - n.r, nx + n.r, ny + n.r)
        const hShift = 40 * Math.sin(t * 0.01 + n.id)
        ringGrad.addColorStop(0, `hsla(${n.hue + hShift},100%,78%,${0.5 + 0.3*pulse})`)
        ringGrad.addColorStop(0.5, `hsla(${n.hue + 120 + hShift},90%,72%,${0.4 + 0.3*pulse})`)
        ringGrad.addColorStop(1, `hsla(${n.hue + 240 + hShift},80%,68%,${0.3 + 0.3*pulse})`)
        ctx.strokeStyle = ringGrad; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(nx, ny, n.r, 0, PI2)
        ctx.fillStyle = `rgba(4,4,12,${0.88 + 0.06*pulse})`;  ctx.fill(); ctx.stroke()

        // label
        ctx.fillStyle = n.color + 'CC'
        ctx.font = `${n.r > 14 ? 8 : 7}px monospace`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(n.label, nx, ny)
      })

      // ── Floating data annotations ──
      const dataRows = [
        'SIGNAL INTEGRITY   99.7%',
        'LATENCY AVG        12ms ',
        'THROUGHPUT         4.2k/s',
        'ERROR RATE         0.03%',
        'UPTIME             99.99%',
      ]
      ctx.font = '6.5px monospace'
      dataRows.forEach((row, i) => {
        const fade = 0.18 + 0.1 * Math.sin(t * 0.008 + i * 0.7)
        ctx.fillStyle = `rgba(151,254,255,${fade})`
        ctx.textAlign = 'left'
        ctx.fillText(row, 8, height - 80 + i * 14)
      })

      // ── Corner marks ──
      ctx.strokeStyle = 'rgba(151,254,255,0.15)'
      ctx.lineWidth = 0.7
      ;[[8,8],[width-8,8],[8,height-8],[width-8,height-8]].forEach(([mx,my]) => {
        const s = 8, ox = mx < width/2 ? 1 : -1, oy = my < height/2 ? 1 : -1
        ctx.beginPath(); ctx.moveTo(mx,my+oy*s); ctx.lineTo(mx,my); ctx.lineTo(mx+ox*s,my); ctx.stroke()
      })

    }, canvas)

    return () => removeFrame(entry)
  }, [width, height])

  return (
    <div ref={wrapRef} className="specimen-wrap specimen-topology">
      <canvas ref={ref} className="specimen-canvas" aria-hidden="true"
        style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   4. WAVE PRISM — horizontal spectral waveform with data overlays
   Unique form: standing wave + frequency spectrum + annotation bars
   ════════════════════════════════════════════════════════════════ */
export function WavePrism({ width = 480, height = 200 }: { width?: number; height?: number }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inView = useInView(wrapRef, { once: false, margin: '-40px' })

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    let t = 0
    const CY = height / 2

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      // Background
      const bg = ctx.createLinearGradient(0, 0, width, 0)
      bg.addColorStop(0,   'rgba(40,0,80,0.06)')
      bg.addColorStop(0.5, 'rgba(0,60,100,0.08)')
      bg.addColorStop(1,   'rgba(40,0,80,0.06)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)

      // ── Multi-layer waveforms ──
      const waves = [
        { freq: 2.2, amp: 32, phase: 0,    hue: 280, speed: 0.025 },
        { freq: 3.8, amp: 20, phase: 1.2,  hue: 200, speed: 0.035 },
        { freq: 5.5, amp: 14, phase: 2.4,  hue: 160, speed: 0.020 },
        { freq: 1.5, amp: 42, phase: 0.8,  hue: 320, speed: 0.018 },
        { freq: 7.0, amp:  8, phase: 3.1,  hue: 40,  speed: 0.045 },
      ]

      ctx.globalCompositeOperation = 'screen'
      waves.forEach(w => {
        const grad = ctx.createLinearGradient(0, CY - w.amp, 0, CY + w.amp)
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.012 + w.phase)
        grad.addColorStop(0,   `hsla(${w.hue + 30},100%,80%,0)`)
        grad.addColorStop(0.35, `hsla(${w.hue},100%,75%,${0.22 + pulse * 0.18})`)
        grad.addColorStop(0.5,  `hsla(${w.hue - 20},100%,85%,${0.35 + pulse * 0.25})`)
        grad.addColorStop(0.65, `hsla(${w.hue},100%,75%,${0.22 + pulse * 0.18})`)
        grad.addColorStop(1,   `hsla(${w.hue + 30},100%,80%,0)`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.2 + pulse * 0.8
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const y = CY + w.amp * Math.sin((x / width) * w.freq * PI2 + t * w.speed + w.phase)
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })
      ctx.globalCompositeOperation = 'source-over'

      // ── Vertical frequency bars (spectrum analyzer style) ──
      const barCount = 40
      for (let bi = 0; bi < barCount; bi++) {
        const bx = (bi / barCount) * width
        const freq = 1 + bi * 0.3
        const barH = (12 + 30 * Math.abs(Math.sin(freq + t * 0.04))) *
                     (0.5 + 0.5 * Math.sin(t * 0.02 + bi * 0.4))
        const hue = (bi / barCount) * 280 + 200
        ctx.fillStyle = `hsla(${hue},90%,70%,0.12)`
        ctx.fillRect(bx, CY - barH, width / barCount - 1, barH * 2)
        // top cap
        ctx.fillStyle = `hsla(${hue},100%,80%,0.28)`
        ctx.fillRect(bx, CY - barH - 2, width / barCount - 1, 2)
        ctx.fillRect(bx, CY + barH,     width / barCount - 1, 2)
      }

      // ── Horizontal annotation lines ──
      const hlines = [
        { y: CY - 55, label: 'PEAK ACTIVATION', color: 'rgba(255,180,80,0.45)' },
        { y: CY,      label: 'BASELINE',         color: 'rgba(151,254,255,0.25)' },
        { y: CY + 55, label: 'NOISE FLOOR',      color: 'rgba(180,80,255,0.35)' },
      ]
      hlines.forEach(hl => {
        ctx.strokeStyle = hl.color; ctx.lineWidth = 0.6; ctx.setLineDash([4, 8])
        ctx.beginPath(); ctx.moveTo(0, hl.y); ctx.lineTo(width, hl.y); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = hl.color; ctx.font = '6.5px monospace'; ctx.textAlign = 'right'
        ctx.fillText(hl.label, width - 6, hl.y - 4)
      })

      // Vertical center line with tick marks
      ctx.strokeStyle = 'rgba(151,254,255,0.08)'; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke()
      for (let x = 0; x < width; x += width / 8) {
        ctx.strokeStyle = 'rgba(151,254,255,0.08)'
        ctx.beginPath(); ctx.moveTo(x, CY - 4); ctx.lineTo(x, CY + 4); ctx.stroke()
      }

    }, canvas)

    return () => removeFrame(entry)
  }, [width, height])

  return (
    <div ref={wrapRef} className="specimen-wrap specimen-wave">
      <canvas ref={ref} className="specimen-canvas" aria-hidden="true"
        style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   5. HELIX STRAND — DNA-like double helix with iridescent color
   Unique form: data helix with node attachments + lateral annotations
   ════════════════════════════════════════════════════════════════ */
export function HelixStrand({ width = 320, height = 420 }: { width?: number; height?: number }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    let t = 0
    const CX = width / 2

    const STEPS = 40
    const FREQ = 2.5   // helix turns
    const XAMP = 60    // horizontal amplitude

    const nodeLabels = ['STR','TRN','DEV','ALN','LLM','RAG','OUT','POL','GOV','DOC']

    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'

      // Background glow
      const bg = ctx.createLinearGradient(CX, 0, CX, height)
      bg.addColorStop(0, 'rgba(80,0,160,0.04)')
      bg.addColorStop(0.5, 'rgba(0,80,160,0.06)')
      bg.addColorStop(1, 'rgba(80,0,160,0.04)')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height)

      // Compute helix points
      const pts1: {x:number,y:number,z:number}[] = []
      const pts2: {x:number,y:number,z:number}[] = []
      for (let i = 0; i <= STEPS; i++) {
        const yf = i / STEPS
        const angle = yf * FREQ * PI2 + t * 0.018
        const y = 20 + yf * (height - 40)
        const z1 = Math.sin(angle)
        const z2 = Math.sin(angle + Math.PI)
        pts1.push({ x: CX + XAMP * Math.cos(angle), y, z: z1 })
        pts2.push({ x: CX + XAMP * Math.cos(angle + Math.PI), y, z: z2 })
      }

      // ── Cross-rungs ──
      ctx.globalCompositeOperation = 'screen'
      for (let i = 0; i <= STEPS; i += 2) {
        const p1 = pts1[i], p2 = pts2[i]
        const depth = (p1.z + 1) / 2  // 0-1
        const hue = 200 + depth * 160
        ctx.strokeStyle = `hsla(${hue},90%,72%,${0.12 + depth * 0.18})`
        ctx.lineWidth = 0.8 + depth * 0.6
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke()
        // node dots on rung ends
        ;[p1, p2].forEach((p, pi) => {
          const ng = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5)
          ng.addColorStop(0, `hsla(${hue},100%,88%,${0.6 + depth * 0.3})`)
          ng.addColorStop(1, `hsla(${hue},100%,80%,0)`)
          ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, PI2); ctx.fill()
        })
        // Label every 4th rung
        if (i % 8 === 0) {
          const li = Math.floor(i / 8) % nodeLabels.length
          const labelX = p1.z > 0 ? p1.x + 14 : p2.x + 14
          ctx.fillStyle = `hsla(${hue},80%,75%,${0.3 + depth * 0.3})`
          ctx.font = '6.5px monospace'; ctx.textAlign = 'left'
          ctx.fillText(nodeLabels[li], labelX, pts1[i].y + 2)
        }
      }
      ctx.globalCompositeOperation = 'source-over'

      // ── Helix strands ──
      const drawStrand = (pts: {x:number,y:number,z:number}[], hue1: number, hue2: number) => {
        for (let i = 0; i < pts.length - 1; i++) {
          const p = pts[i], q = pts[i + 1]
          const depth = (p.z + 1) / 2
          const hue = hue1 + (hue2 - hue1) * depth
          ctx.strokeStyle = `hsla(${hue},90%,70%,${0.35 + depth * 0.45})`
          ctx.lineWidth = 1.5 + depth * 1.5
          ctx.shadowColor = `hsla(${hue},90%,70%,0.3)`
          ctx.shadowBlur = depth * 6
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
          ctx.shadowBlur = 0
        }
      }
      drawStrand(pts1, 280, 200)
      drawStrand(pts2, 160, 320)

      // ── Left measurement ticks ──
      for (let y = 30; y < height - 20; y += 40) {
        const a = 0.15 + 0.1 * Math.sin(t * 0.008 + y * 0.05)
        ctx.strokeStyle = `rgba(151,254,255,${a})`
        ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(CX - XAMP - 16, y); ctx.lineTo(CX - XAMP - 8, y); ctx.stroke()
        ctx.fillStyle = `rgba(151,254,255,${a * 0.7})`
        ctx.font = '6px monospace'; ctx.textAlign = 'right'
        ctx.fillText(`${Math.round(y)}`, CX - XAMP - 18, y + 2)
      }

      // ── Floating data right column ──
      const dataRows = ['↑ CAPABILITY', '→ DEPLOYMENT', '◈ STRATEGY', '◎ TRAINING', '⬡ DEVELOP']
      dataRows.forEach((row, i) => {
        const a = 0.20 + 0.12 * Math.sin(t * 0.009 + i * 1.1)
        ctx.fillStyle = `rgba(151,254,255,${a})`
        ctx.font = '7px monospace'; ctx.textAlign = 'right'
        ctx.fillText(row, width - 6, 50 + i * 60)
      })

    }, canvas)

    return () => removeFrame(entry)
  }, [width, height])

  return (
    <div ref={wrapRef} className="specimen-wrap specimen-helix">
      <canvas ref={ref} className="specimen-canvas" aria-hidden="true"
        style={{ width: '100%', height: 'auto' }} />
    </div>
  )
}
