import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PI2 } from '../utils/animation'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'

/* ═══════════════════════════════════════════════════════════════════
   PRISM VISUALS — Holographic specimen + data-annotation graphics
   Aesthetic: photorealistic subject + rainbow prismatic scan bands
               + measurement callout lines + schematic grid overlay
               + chromatic aberration + particle dissolution edges
═══════════════════════════════════════════════════════════════════ */

/* Helper: draw a measurement callout line with label */
function drawCallout(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  label: string, value: string, color: string, alpha: number
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 0.6
  ctx.setLineDash([3, 4])
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  // tick at end
  ctx.setLineDash([])
  ctx.beginPath(); ctx.moveTo(x2 - 4, y2); ctx.lineTo(x2 + 4, y2); ctx.stroke()
  ctx.font = '8px monospace'
  ctx.fillStyle = color
  ctx.textAlign = x2 > x1 ? 'left' : 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, x2 + (x2 > x1 ? 6 : -6), y2 - 6)
  ctx.fillStyle = color + '99'
  ctx.fillText(value, x2 + (x2 > x1 ? 6 : -6), y2 + 6)
  ctx.restore()
}

/* ── HERO section: removed per user request ── */

/* ═══════════════════════════════════════════════════════════════════
   TRANSFORM ZONES: Holographic Crystalline Orb Specimen
   — central chrome sphere with rainbow prismatic equatorial band
   — orbiting data callout lines radiating outward
   — particle cloud dissolution at edges
   — rotating schematic ring with tick marks
═══════════════════════════════════════════════════════════════════ */
export function HolographicOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const inView    = useInView(wrapRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const S = 320
    canvas.width = canvas.height = S
    const CX = S / 2, CY = S / 2, R = 96

    // Particles — dissolution cloud around the orb
    const N_PART = 180
    const parts = Array.from({ length: N_PART }, () => {
      const angle = Math.random() * PI2
      const dist  = R * (0.92 + Math.random() * 0.55)
      return {
        x: CX + dist * Math.cos(angle),
        y: CY + dist * Math.sin(angle) * 0.75,
        r: 0.4 + Math.random() * 1.2,
        a: 0.05 + Math.random() * 0.25,
        h: Math.random() * 360,
        phase: Math.random() * PI2,
        speed: 0.008 + Math.random() * 0.012,
      }
    })

    // Callout data
    const callouts = [
      { a: -0.85, dist: R + 28, label: 'STRATEGY',    val: '94.7%',  color: '#FF7E4A' },
      { a:  0.30, dist: R + 32, label: 'TRAINING',    val: '98.2%',  color: '#97FEFF' },
      { a:  1.90, dist: R + 26, label: 'DEVELOPMENT', val: '96.5%',  color: '#FFD040' },
      { a: -1.90, dist: R + 30, label: 'ALIGNMENT',   val: '91.3%',  color: '#FF7E4A' },
      { a:  2.80, dist: R + 28, label: 'TRANSFER',    val: '100%',   color: '#FFFFFF'  },
    ]

    // Schematic ring tick marks
    const TICKS = 64

    let frame = 0

    const entry = onFrame(() => {
      frame++
      const rot = frame * 0.006
      ctx.clearRect(0, 0, S, S)
      ctx.globalCompositeOperation = 'source-over'

      // ── Outer schematic ring ────────────────────────────────
      ctx.save()
      ctx.translate(CX, CY)
      ctx.rotate(rot * 0.4)
      for (let i = 0; i < TICKS; i++) {
        const a = (i / TICKS) * PI2
        const len = i % 8 === 0 ? 12 : i % 4 === 0 ? 7 : 3
        const rInner = R + 40
        ctx.strokeStyle = `rgba(151,254,255,${i % 8 === 0 ? 0.35 : 0.12})`
        ctx.lineWidth = i % 8 === 0 ? 0.8 : 0.4
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * rInner,       Math.sin(a) * rInner)
        ctx.lineTo(Math.cos(a) * (rInner + len), Math.sin(a) * (rInner + len))
        ctx.stroke()
      }
      ctx.restore()

      // ── Second rotating ring (counter) ──────────────────────
      ctx.save()
      ctx.translate(CX, CY)
      ctx.rotate(-rot * 0.25)
      ctx.beginPath(); ctx.arc(0, 0, R + 55, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.07)'
      ctx.lineWidth = 0.5; ctx.setLineDash([4, 8]); ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()

      // ── Particle dissolution cloud ───────────────────────────
      parts.forEach(p => {
        const pulse = 0.5 + 0.5 * Math.sin(frame * p.speed + p.phase)
        ctx.globalAlpha = p.a * pulse
        ctx.fillStyle = `hsl(${p.h},90%,85%)`
        ctx.shadowColor = `hsl(${p.h},90%,85%)`
        ctx.shadowBlur = p.r * 4
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, PI2); ctx.fill()
        ctx.shadowBlur = 0
      })
      ctx.globalAlpha = 1

      // ── Chrome sphere base ───────────────────────────────────
      // Dark base
      const baseGrad = ctx.createRadialGradient(CX - R * 0.25, CY - R * 0.28, R * 0.05, CX, CY, R)
      baseGrad.addColorStop(0,   'rgba(200,200,220,0.18)')
      baseGrad.addColorStop(0.3, 'rgba(80, 80,100,0.45)')
      baseGrad.addColorStop(0.7, 'rgba(20, 20, 30,0.80)')
      baseGrad.addColorStop(1,   'rgba( 4,  4, 12,0.95)')
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2)
      ctx.fillStyle = baseGrad; ctx.fill()

      // ── Rainbow prismatic scan bands across the orb ──────────
      const SPECTRUM = [
        [0,   '#FF0040'],
        [0.14,'#FF4400'],
        [0.28,'#FF9900'],
        [0.42,'#FFEE00'],
        [0.56,'#00FF88'],
        [0.70,'#00CCFF'],
        [0.84,'#4466FF'],
        [1.0, '#CC44FF'],
      ]

      // Clip to sphere
      ctx.save()
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2); ctx.clip()

      // Animated band offset
      const scanOffset = ((frame * 0.3) % (R * 2)) - R
      const bandH = 18

      SPECTRUM.forEach(([frac, col], si) => {
        const bandY = CY - R + (Number(frac)) * R * 2 + scanOffset
        const lum = 0.12 + 0.1 * Math.sin(frame * 0.02 + si * 0.4)

        const g = ctx.createLinearGradient(CX - R, bandY, CX + R, bandY)
        g.addColorStop(0,   'rgba(0,0,0,0)')
        g.addColorStop(0.15,'rgba(0,0,0,0)')
        g.addColorStop(0.3, (col as string) + Math.round(lum * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.5, (col as string) + Math.round((lum + 0.08) * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.7, (col as string) + Math.round(lum * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.85,'rgba(0,0,0,0)')
        g.addColorStop(1,   'rgba(0,0,0,0)')

        ctx.fillStyle = g
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(CX - R, bandY - bandH / 2, R * 2, bandH)
      })
      ctx.globalCompositeOperation = 'source-over'

      // Chromatic aberration fringe at equator
      const eqY = CY + Math.sin(frame * 0.01) * 8
      for (let i = 0; i < 3; i++) {
        const g2 = ctx.createLinearGradient(CX - R, eqY - 2, CX + R, eqY + 2)
        const cols2 = ['rgba(255,0,80,', 'rgba(0,200,255,', 'rgba(200,255,0,']
        g2.addColorStop(0, cols2[i] + '0)')
        g2.addColorStop(0.4, cols2[i] + '0.25)')
        g2.addColorStop(0.6, cols2[i] + '0.25)')
        g2.addColorStop(1, cols2[i] + '0)')
        ctx.fillStyle = g2
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(CX - R, eqY - 3 + i, R * 2, 2)
      }
      ctx.globalCompositeOperation = 'source-over'

      // Specular highlight
      const specG = ctx.createRadialGradient(CX - R * 0.3, CY - R * 0.35, 0, CX - R * 0.15, CY - R * 0.2, R * 0.45)
      specG.addColorStop(0, 'rgba(255,255,255,0.30)')
      specG.addColorStop(0.4,'rgba(200,240,255,0.08)')
      specG.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = specG; ctx.fillRect(CX - R, CY - R, R * 2, R * 2)

      ctx.restore() // un-clip

      // ── Sphere border ─────────────────────────────────────────
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.25)'; ctx.lineWidth = 0.8; ctx.stroke()

      // ── Grid overlay lines on sphere face ────────────────────
      ctx.save()
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2); ctx.clip()
      ctx.strokeStyle = 'rgba(151,254,255,0.06)'; ctx.lineWidth = 0.4
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath()
        ctx.moveTo(CX + (i / 5) * R, CY - R)
        ctx.lineTo(CX + (i / 5) * R, CY + R)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(CX - R, CY + (i / 5) * R)
        ctx.lineTo(CX + R, CY + (i / 5) * R)
        ctx.stroke()
      }
      ctx.restore()

      // ── Centre label ──────────────────────────────────────────
      const cp = 0.6 + 0.4 * Math.sin(frame * 0.016)
      ctx.fillStyle = `rgba(151,254,255,${cp * 0.7})`
      ctx.font = '600 9px monospace'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('CODE & CLARITY', CX, CY - 5)
      ctx.fillStyle = `rgba(255,255,255,${cp * 0.35})`
      ctx.font = '7px monospace'
      ctx.fillText('AI SPECIMEN  v1.0', CX, CY + 8)

      // ── Callout lines ─────────────────────────────────────────
      const callAlpha = 0.5 + 0.3 * Math.sin(frame * 0.01)
      callouts.forEach((c, ci) => {
        const a = c.a + rot * 0.15
        const x1 = CX + (R + 2)   * Math.cos(a)
        const y1 = CY + (R + 2)   * Math.sin(a) * 0.85
        const x2 = CX + c.dist    * Math.cos(a) * 1.45
        const y2 = CY + c.dist    * Math.sin(a) * 1.1
        drawCallout(ctx, x1, y1, x2, y2, c.label, c.val, c.color, callAlpha * (0.7 + 0.3 * Math.sin(frame * 0.008 + ci)))
      })
    }, canvas)

    return () => removeFrame(entry)
  }, [inView])

  return (
    <div ref={wrapRef} className="prism-orb-wrap">
      <canvas ref={canvasRef} className="prism-orb-canvas" aria-hidden="true" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PROCESS: Prismatic Instrument / Machine
   — technical device silhouette with rainbow spectrum slice
   — gear-ring animations + measurement annotations
   — schematic exploded-view lines
═══════════════════════════════════════════════════════════════════ */
export function PrismaticInstrument() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const inView    = useInView(wrapRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 340, H = 260
    canvas.width = W; canvas.height = H
    const CX = W / 2, CY = H / 2

    // Gear rings
    const gears = [
      { r: 80, teeth: 24, speed: 0.008,  color: 'rgba(151,254,255,0.15)' },
      { r: 55, teeth: 16, speed: -0.013, color: 'rgba(255,126,74,0.15)'  },
      { r: 32, teeth: 10, speed: 0.022,  color: 'rgba(255,208,64,0.15)'  },
    ]

    // Schematic annotations
    const annotations = [
      { angle: -1.2,  r: 62, label: 'PHASE-01', val: 'Discovery',    color: '#FF7E4A' },
      { angle: -0.1,  r: 62, label: 'PHASE-02', val: 'Alignment',    color: '#FFD040' },
      { angle:  1.1,  r: 62, label: 'PHASE-03', val: 'Delivery',     color: '#97FEFF' },
      { angle:  2.3,  r: 62, label: 'PHASE-04', val: 'Transfer',     color: '#0088FF' },
    ]

    let frame = 0

    const drawGear = (cx: number, cy: number, r: number, teeth: number, rotation: number, color: string) => {
      const toothH = r * 0.12
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rotation)
      ctx.strokeStyle = color; ctx.lineWidth = 0.8
      ctx.beginPath()
      for (let i = 0; i < teeth; i++) {
        const a1 = (i / teeth) * PI2
        const a2 = ((i + 0.4) / teeth) * PI2
        const a3 = ((i + 0.6) / teeth) * PI2
        const a4 = ((i + 1) / teeth) * PI2
        if (i === 0) ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r)
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r)
        ctx.lineTo(Math.cos(a2) * (r + toothH), Math.sin(a2) * (r + toothH))
        ctx.lineTo(Math.cos(a3) * (r + toothH), Math.sin(a3) * (r + toothH))
        ctx.lineTo(Math.cos(a3) * r, Math.sin(a3) * r)
        ctx.lineTo(Math.cos(a4) * r, Math.sin(a4) * r)
      }
      ctx.closePath(); ctx.stroke()
      ctx.restore()
    }

    const entry = onFrame(() => {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Background grid
      ctx.strokeStyle = 'rgba(151,254,255,0.04)'; ctx.lineWidth = 0.4
      for (let x = 0; x < W; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Cross-hairs
      ctx.strokeStyle = 'rgba(151,254,255,0.08)'; ctx.lineWidth = 0.5
      ctx.setLineDash([4, 8])
      ctx.beginPath(); ctx.moveTo(CX, 0); ctx.lineTo(CX, H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, CY); ctx.lineTo(W, CY); ctx.stroke()
      ctx.setLineDash([])

      // Outer measurement circle
      ctx.beginPath(); ctx.arc(CX, CY, 105, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.07)'; ctx.lineWidth = 0.6; ctx.stroke()

      // Gear rings
      gears.forEach((g, i) => drawGear(CX, CY, g.r, g.teeth, frame * g.speed, g.color))

      // ── Rainbow prismatic core ────────────────────────────────
      // Clip to inner circle
      ctx.save()
      ctx.beginPath(); ctx.arc(CX, CY, 29, 0, PI2); ctx.clip()

      const scanY = ((frame * 0.5) % 60) - 30
      const SPEC = ['#FF0040','#FF6600','#FFD000','#00FF88','#00BBFF','#6644FF','#CC00FF']
      SPEC.forEach((col, si) => {
        const y = CY - 29 + (si / SPEC.length) * 58 + scanY
        const g = ctx.createLinearGradient(CX - 29, y, CX + 29, y)
        g.addColorStop(0, col + '00')
        g.addColorStop(0.3, col + 'AA')
        g.addColorStop(0.7, col + 'AA')
        g.addColorStop(1, col + '00')
        ctx.fillStyle = g
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(CX - 29, y, 58, 58 / SPEC.length)
      })
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()

      // Core circle
      ctx.beginPath(); ctx.arc(CX, CY, 29, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.3)'; ctx.lineWidth = 1; ctx.stroke()
      const pulse = 0.6 + 0.4 * Math.sin(frame * 0.02)
      ctx.fillStyle = `rgba(151,254,255,${pulse * 0.6})`
      ctx.font = '600 7px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('4-PHASE', CX, CY - 5)
      ctx.fillText('PROCESS', CX, CY + 6)

      // Annotation callouts
      annotations.forEach((ann, ai) => {
        const x1 = CX + ann.r * 0.45 * Math.cos(ann.angle)
        const y1 = CY + ann.r * 0.45 * Math.sin(ann.angle)
        const x2 = CX + (ann.r + 38) * Math.cos(ann.angle)
        const y2 = CY + (ann.r + 38) * Math.sin(ann.angle)
        const alpha = 0.55 + 0.3 * Math.sin(frame * 0.012 + ai)
        drawCallout(ctx, x1, y1, x2, y2, ann.label, ann.val, ann.color, alpha)
      })

      // Spectrum bar at bottom (like the machine reference image)
      const barY = H - 18, barW = 200
      const specBar = ctx.createLinearGradient(CX - barW / 2, barY, CX + barW / 2, barY)
      const stops2 = ['#FF0040','#FF6600','#FFD000','#00FF88','#00BBFF','#6644FF','#CC00FF']
      stops2.forEach((c, i) => specBar.addColorStop(i / (stops2.length - 1), c))
      ctx.fillStyle = specBar
      ctx.fillRect(CX - barW / 2, barY, barW, 4)
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 0.5
      ctx.strokeRect(CX - barW / 2, barY, barW, 4)
    }, canvas)

    return () => removeFrame(entry)
  }, [inView])

  return (
    <div ref={wrapRef} className="prismatic-instrument-wrap">
      <canvas ref={canvasRef} className="prismatic-instrument-canvas" aria-hidden="true" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CONTRAST BREAK: Crystal Specimen Scanner
   — quartz/crystal form with rainbow prismatic light slice
   — particle scatter field at top
   — schematic measurement overlay on left and right
═══════════════════════════════════════════════════════════════════ */
export function CrystalScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const inView    = useInView(wrapRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 480, H = 200
    canvas.width = W; canvas.height = H

    // Crystal points (polygon vertices for crystal shape)
    const crystalPts = [
      [W * 0.5, H * 0.05],
      [W * 0.62, H * 0.25],
      [W * 0.58, H * 0.55],
      [W * 0.52, H * 0.88],
      [W * 0.48, H * 0.92],
      [W * 0.42, H * 0.88],
      [W * 0.36, H * 0.55],
      [W * 0.38, H * 0.25],
    ] as [number, number][]

    // Particle scatter at top
    const particles = Array.from({ length: 120 }, () => ({
      x: W * (0.25 + Math.random() * 0.5),
      y: H * (Math.random() * 0.55),
      r: 0.3 + Math.random() * 1.0,
      a: 0.04 + Math.random() * 0.18,
      h: 150 + Math.random() * 180,
      vy: -(0.03 + Math.random() * 0.06),
      phase: Math.random() * PI2,
    }))

    // Measurement values on sides
    const leftMeasures  = ['12.35mm', '8.42mm', '15.06mm', '9.77mm', '6.23mm']
    const rightMeasures = ['Crystal axis: 94°', 'Refr. index: 1.544', 'Dispersion: high', 'Clarity: A+', 'Prismatic: full']

    let frame = 0

    const entry = onFrame(() => {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 0.4
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Particle scatter (dissolution effect at top)
      particles.forEach(p => {
        p.y += p.vy
        if (p.y < -5) p.y = H * 0.55
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.015 + p.phase)
        ctx.globalAlpha = p.a * pulse
        ctx.fillStyle = `hsl(${p.h},88%,88%)`
        ctx.shadowColor = `hsl(${p.h},88%,88%)`
        ctx.shadowBlur = p.r * 3
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, PI2); ctx.fill()
        ctx.shadowBlur = 0
      })
      ctx.globalAlpha = 1

      // Crystal body
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(...crystalPts[0])
      crystalPts.slice(1).forEach(pt => ctx.lineTo(...pt))
      ctx.closePath()

      // Crystal fill — dark translucent
      const crystalFill = ctx.createLinearGradient(W * 0.38, 0, W * 0.62, H)
      crystalFill.addColorStop(0,   'rgba(200,220,240,0.10)')
      crystalFill.addColorStop(0.3, 'rgba(80, 100,130,0.25)')
      crystalFill.addColorStop(0.7, 'rgba(30,  40, 60,0.40)')
      crystalFill.addColorStop(1,   'rgba(10,  10, 20,0.55)')
      ctx.fillStyle = crystalFill; ctx.fill()
      ctx.strokeStyle = 'rgba(200,230,255,0.30)'; ctx.lineWidth = 0.8; ctx.stroke()
      ctx.restore()

      // ── Rainbow prismatic band cutting through crystal ────────
      const scanProgress = (frame * 0.35) % (H + 40) - 20
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(...crystalPts[0])
      crystalPts.slice(1).forEach(pt => ctx.lineTo(...pt))
      ctx.closePath(); ctx.clip()

      const SPEC2 = [
        '#FF0040','#FF3300','#FF9900','#FFEE00','#33FF44','#00CCFF','#4455FF','#BB00FF'
      ]
      SPEC2.forEach((col, si) => {
        const y = scanProgress + si * (H / SPEC2.length) * 0.28
        const bandW = H * 0.032
        const g = ctx.createLinearGradient(W * 0.3, y, W * 0.7, y)
        g.addColorStop(0,   col + '00')
        g.addColorStop(0.2, col + '55')
        g.addColorStop(0.5, col + 'CC')
        g.addColorStop(0.8, col + '55')
        g.addColorStop(1,   col + '00')
        ctx.fillStyle = g
        ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(W * 0.3, y, W * 0.4, bandW)
      })
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()

      // Left measurement lines
      leftMeasures.forEach((val, i) => {
        const y = H * (0.2 + i * 0.16)
        const alpha = 0.4 + 0.2 * Math.sin(frame * 0.01 + i * 0.4)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = '#97FEFF88'; ctx.lineWidth = 0.5; ctx.setLineDash([2, 4])
        ctx.beginPath(); ctx.moveTo(W * 0.36, y); ctx.lineTo(W * 0.12, y); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(151,254,255,0.55)'; ctx.font = '7px monospace'
        ctx.textAlign = 'right'; ctx.textBaseline = 'middle'
        ctx.fillText(val, W * 0.11, y)
        ctx.globalAlpha = 1
      })

      // Right annotation labels
      rightMeasures.forEach((val, i) => {
        const y = H * (0.15 + i * 0.17)
        const alpha = 0.4 + 0.2 * Math.sin(frame * 0.012 + i * 0.5)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = '#FF7E4A55'; ctx.lineWidth = 0.5; ctx.setLineDash([2, 4])
        ctx.beginPath(); ctx.moveTo(W * 0.63, y); ctx.lineTo(W * 0.88, y); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(255,126,74,0.6)'; ctx.font = '7px monospace'
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
        ctx.fillText(val, W * 0.89, y)
        ctx.globalAlpha = 1
      })
    }, canvas)

    return () => removeFrame(entry)
  }, [inView])

  return (
    <div ref={wrapRef} className="crystal-scanner-wrap">
      <div className="crystal-scanner-label">SPECIMEN ANALYSIS — PRISMATIC SCAN ACTIVE</div>
      <canvas ref={canvasRef} className="crystal-scanner-canvas" aria-hidden="true" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   FAQ: Point-cloud Figure
   — human/data figure made of glowing dots with rainbow spectrum
   — annotation lines radiating from body parts
   — capability labels
═══════════════════════════════════════════════════════════════════ */
export function PointCloudFigure() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const inView    = useInView(wrapRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 400, H = 220
    canvas.width = W; canvas.height = H
    const CX = W / 2, CY = H / 2

    // Generate point cloud in an ellipse (figure shape)
    const N = 350
    const pts = Array.from({ length: N }, (_, i) => {
      const angle = Math.random() * PI2
      const rx = 70 * Math.sqrt(Math.random())
      const ry = 95 * Math.sqrt(Math.random())
      // Bias toward figure silhouette
      const bx = rx * Math.cos(angle)
      const by = ry * Math.sin(angle)
      // Hue based on vertical position (rainbow top-to-bottom)
      const yFrac = (by + ry) / (ry * 2)
      return {
        x: CX + bx + (Math.random() - 0.5) * 18,
        y: CY + by * 0.9 + (Math.random() - 0.5) * 10,
        r: 0.5 + Math.random() * 1.5,
        a: 0.15 + Math.random() * 0.45,
        h: yFrac * 280 + 30,
        phase: Math.random() * PI2,
        speed: 0.006 + Math.random() * 0.009,
      }
    })

    // Orbital arc annotations (like the runner figure)
    const arcs = [
      { r: 85, start: -0.5, end: 0.9, color: '#FF7E4A', label: 'STRATEGY ARC' },
      { r: 95, start: 1.2,  end: 2.4, color: '#97FEFF', label: 'CAPABILITY LOOP' },
      { r: 75, start: 2.8,  end: 4.0, color: '#FFD040', label: 'DELIVERY ORBIT' },
    ]

    const annotations = [
      { x: CX + 90, y: CY - 60, label: 'KNOW-HOW',    val: '10+ yrs', color: '#FF7E4A' },
      { x: CX - 90, y: CY - 20, label: 'SHIPPED',     val: '50+ teams',color: '#97FEFF' },
      { x: CX + 85, y: CY + 40, label: 'TRANSFER',    val: '100%',    color: '#FFD040' },
      { x: CX - 80, y: CY + 55, label: 'RESPONSE',    val: '< 24h',   color: '#FFFFFF'  },
    ]

    let frame = 0

    const entry = onFrame(() => {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Orbital arcs
      arcs.forEach((arc, ai) => {
        ctx.save(); ctx.translate(CX, CY)
        ctx.beginPath(); ctx.arc(0, 0, arc.r, arc.start, arc.end)
        const pulse = 0.3 + 0.25 * Math.sin(frame * 0.015 + ai)
        ctx.strokeStyle = arc.color + Math.round(pulse * 255).toString(16).padStart(2,'0')
        ctx.lineWidth = 1.5; ctx.stroke()
        ctx.restore()

        // Arc label
        const midAngle = (arc.start + arc.end) / 2
        const lx = CX + (arc.r + 12) * Math.cos(midAngle)
        const ly = CY + (arc.r + 12) * Math.sin(midAngle)
        ctx.fillStyle = arc.color + '66'
        ctx.font = '6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(arc.label, lx, ly)
      })

      // Point cloud
      pts.forEach(p => {
        const pulse = 0.5 + 0.5 * Math.sin(frame * p.speed + p.phase)
        ctx.globalAlpha = p.a * pulse
        const hue = p.h + frame * 0.05
        ctx.fillStyle = `hsl(${hue % 360},90%,85%)`
        ctx.shadowColor = `hsl(${hue % 360},90%,85%)`
        ctx.shadowBlur = p.r * 3
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, PI2); ctx.fill()
        ctx.shadowBlur = 0
      })
      ctx.globalAlpha = 1

      // Rainbow scan band through figure
      const scanY = CY - 90 + ((frame * 0.4) % 190)
      ctx.save()
      ctx.beginPath(); ctx.ellipse(CX, CY, 72, 97, 0, 0, PI2); ctx.clip()
      const SPEC = ['#FF0040','#FF6600','#FFCC00','#00FF88','#00AAFF','#6644FF']
      SPEC.forEach((col, si) => {
        const y = scanY + si * 5
        const g = ctx.createLinearGradient(CX - 80, y, CX + 80, y)
        g.addColorStop(0, col + '00'); g.addColorStop(0.4, col + '55'); g.addColorStop(0.6, col + '55'); g.addColorStop(1, col + '00')
        ctx.fillStyle = g; ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(CX - 80, y, 160, 5)
      })
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()

      // Annotation callouts
      annotations.forEach((ann, ai) => {
        const alpha = 0.5 + 0.3 * Math.sin(frame * 0.01 + ai)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = ann.color + '77'; ctx.lineWidth = 0.5; ctx.setLineDash([2, 4])
        // Line from edge of figure to label
        const dx = ann.x - CX, dy = ann.y - CY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const x1 = CX + (dx / dist) * 70, y1 = CY + (dy / dist) * 90
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(ann.x, ann.y); ctx.stroke()
        ctx.setLineDash([])
        ctx.font = '700 7px monospace'; ctx.fillStyle = ann.color; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
        ctx.fillText(ann.label, ann.x, ann.y - 2)
        ctx.font = '7px monospace'; ctx.fillStyle = ann.color + '99'; ctx.textBaseline = 'top'
        ctx.fillText(ann.val, ann.x, ann.y + 2)
        ctx.globalAlpha = 1
      })
    }, canvas)

    return () => removeFrame(entry)
  }, [inView])

  return (
    <div ref={wrapRef} className="pointcloud-figure-wrap">
      <canvas ref={canvasRef} className="pointcloud-figure-canvas" aria-hidden="true" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACT: Prismatic Sphere with Data Readout
   — iguana/specimen style: metallic sphere + rainbow iridescence
   — data table overlay on right side
   — measurement callout lines on left
═══════════════════════════════════════════════════════════════════ */
export function DataSpecimenSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const inView    = useInView(wrapRef, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = 520, H = 180
    canvas.width = W; canvas.height = H
    const CX = W * 0.38, CY = H / 2, R = 72

    // Data readout table (right side, like iguana image)
    const dataRows = [
      { key: 'Response',   val: '< 24h',  col: '#97FEFF' },
      { key: 'Teams',      val: '50+',    col: '#FF7E4A' },
      { key: 'Experience', val: '10+ yr', col: '#FFD040' },
      { key: 'Tailored',   val: '100%',   col: '#FFFFFF'  },
      { key: 'Scope',      val: 'Agreed', col: '#97FEFF' },
      { key: 'Handover',   val: 'Always', col: '#FFD040' },
    ]

    // Left callout measurements
    const leftCalls = [
      { y: CY - 38, label: 'INTAKE',   val: '< 1 day' },
      { y: CY - 12, label: 'SCOPE',    val: 'Week 1' },
      { y: CY + 12, label: 'DELIVERY', val: '4–8 wks' },
      { y: CY + 38, label: 'HANDOVER', val: 'Built-in' },
    ]

    // Particle corona
    const corona = Array.from({ length: 80 }, () => {
      const a = Math.random() * PI2
      return {
        angle: a, r: R * (0.95 + Math.random() * 0.35),
        size: 0.4 + Math.random() * 1.1, alpha: 0.05 + Math.random() * 0.2,
        h: Math.random() * 360, speed: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * PI2,
      }
    })

    let frame = 0

    const entry = onFrame(() => {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Background grid (left portion)
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 0.4
      for (let x = 0; x < W * 0.6; x += 22) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 22) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W * 0.6, y); ctx.stroke()
      }

      // Corona particles
      corona.forEach(p => {
        p.angle += p.speed
        const px = CX + p.r * Math.cos(p.angle)
        const py = CY + p.r * Math.sin(p.angle) * 0.7
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.012 + p.phase)
        ctx.globalAlpha = p.alpha * pulse
        ctx.fillStyle = `hsl(${p.h},90%,85%)`
        ctx.shadowColor = `hsl(${p.h},90%,85%)`; ctx.shadowBlur = p.size * 4
        ctx.beginPath(); ctx.arc(px, py, p.size, 0, PI2); ctx.fill()
        ctx.shadowBlur = 0
      })
      ctx.globalAlpha = 1

      // Sphere dark base
      const base = ctx.createRadialGradient(CX - R * 0.25, CY - R * 0.28, R * 0.05, CX, CY, R)
      base.addColorStop(0,   'rgba(180,190,210,0.20)')
      base.addColorStop(0.35,'rgba(60, 65, 90,0.50)')
      base.addColorStop(0.75,'rgba(15, 15, 22,0.85)')
      base.addColorStop(1,   'rgba( 4,  4, 12,0.96)')
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2)
      ctx.fillStyle = base; ctx.fill()

      // Rainbow bands
      ctx.save()
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2); ctx.clip()
      const scanOff = ((frame * 0.4) % (R * 2)) - R
      const SPEC3 = ['#FF0040','#FF5500','#FFCC00','#00FF88','#00AAFF','#5533FF','#CC00FF']
      SPEC3.forEach((col, si) => {
        const y = CY - R + (si / SPEC3.length) * R * 2 + scanOff
        const lum = 0.10 + 0.08 * Math.sin(frame * 0.02 + si * 0.5)
        const g = ctx.createLinearGradient(CX - R, y, CX + R, y)
        g.addColorStop(0, col + '00'); g.addColorStop(0.3, col + Math.round(lum * 255).toString(16).padStart(2,'0'))
        g.addColorStop(0.7, col + Math.round(lum * 255).toString(16).padStart(2,'0')); g.addColorStop(1, col + '00')
        ctx.fillStyle = g; ctx.globalCompositeOperation = 'screen'
        ctx.fillRect(CX - R, y - 4, R * 2, R * 2 / SPEC3.length + 2)
      })
      ctx.globalCompositeOperation = 'source-over'
      // Specular
      const spec = ctx.createRadialGradient(CX - R * 0.3, CY - R * 0.35, 0, CX - R * 0.15, CY - R * 0.2, R * 0.42)
      spec.addColorStop(0, 'rgba(255,255,255,0.25)'); spec.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = spec; ctx.fillRect(CX - R, CY - R, R * 2, R * 2)
      ctx.restore()

      // Grid overlay on sphere
      ctx.save()
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2); ctx.clip()
      ctx.strokeStyle = 'rgba(151,254,255,0.05)'; ctx.lineWidth = 0.4
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath(); ctx.moveTo(CX + (i / 4) * R, CY - R); ctx.lineTo(CX + (i / 4) * R, CY + R); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(CX - R, CY + (i / 4) * R); ctx.lineTo(CX + R, CY + (i / 4) * R); ctx.stroke()
      }
      ctx.restore()

      // Sphere border
      ctx.beginPath(); ctx.arc(CX, CY, R, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.22)'; ctx.lineWidth = 0.8; ctx.stroke()

      // Outer ring
      ctx.beginPath(); ctx.arc(CX, CY, R + 14, 0, PI2)
      ctx.strokeStyle = 'rgba(151,254,255,0.05)'; ctx.lineWidth = 0.5; ctx.setLineDash([3,6]); ctx.stroke()
      ctx.setLineDash([])

      // Left callout lines
      leftCalls.forEach((lc, i) => {
        const x1 = CX - R - 2, x2 = CX - R - 40
        const alpha = 0.45 + 0.25 * Math.sin(frame * 0.011 + i)
        ctx.globalAlpha = alpha
        ctx.strokeStyle = '#97FEFF66'; ctx.lineWidth = 0.5; ctx.setLineDash([2, 4])
        ctx.beginPath(); ctx.moveTo(x1, lc.y); ctx.lineTo(x2, lc.y); ctx.stroke()
        ctx.setLineDash([])
        ctx.font = '600 7px monospace'; ctx.fillStyle = 'rgba(151,254,255,0.6)'
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'
        ctx.fillText(lc.label, x2 - 3, lc.y)
        ctx.fillStyle = 'rgba(151,254,255,0.35)'; ctx.font = '6.5px monospace'; ctx.textBaseline = 'top'
        ctx.fillText(lc.val, x2 - 3, lc.y + 1)
        ctx.globalAlpha = 1
      })

      // Right data table (like iguana image)
      const tableX = W * 0.62, tableY = H * 0.12
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5
      ctx.strokeRect(tableX, tableY, W * 0.35, H * 0.76)

      // Table header
      ctx.fillStyle = 'rgba(151,254,255,0.25)'; ctx.font = '600 7px monospace'
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'
      ctx.fillText('ENGAGEMENT SPEC', tableX + 6, tableY + 5)
      ctx.strokeStyle = 'rgba(151,254,255,0.12)'; ctx.lineWidth = 0.4
      ctx.beginPath(); ctx.moveTo(tableX, tableY + 17); ctx.lineTo(tableX + W * 0.35, tableY + 17); ctx.stroke()

      dataRows.forEach((row, ri) => {
        const ry = tableY + 22 + ri * 19
        const alpha = 0.5 + 0.3 * Math.sin(frame * 0.014 + ri * 0.5)
        ctx.globalAlpha = alpha
        ctx.fillStyle = 'rgba(200,200,220,0.35)'; ctx.font = '6.5px monospace'
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
        ctx.fillText(row.key, tableX + 6, ry)
        ctx.fillStyle = row.col; ctx.font = '700 7px monospace'
        ctx.textAlign = 'right'
        ctx.fillText(row.val, tableX + W * 0.35 - 6, ry)
        // Row separator
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.3
        if (ri < dataRows.length - 1) {
          ctx.beginPath(); ctx.moveTo(tableX, ry + 9); ctx.lineTo(tableX + W * 0.35, ry + 9); ctx.stroke()
        }
        ctx.globalAlpha = 1
      })

      // Spectrum bar across bottom of sphere area
      const specY = H - 10
      const specGrad = ctx.createLinearGradient(CX - R, specY, CX + R, specY)
      ;['#FF0040','#FF6600','#FFD000','#00FF88','#00AAFF','#6644FF','#CC00FF'].forEach((c, i, arr) => {
        specGrad.addColorStop(i / (arr.length - 1), c)
      })
      ctx.fillStyle = specGrad; ctx.fillRect(CX - R, specY, R * 2, 3)
    }, canvas)

    return () => removeFrame(entry)
  }, [inView])

  return (
    <div ref={wrapRef} className="data-specimen-wrap">
      <canvas ref={canvasRef} className="data-specimen-canvas" aria-hidden="true" />
    </div>
  )
}
