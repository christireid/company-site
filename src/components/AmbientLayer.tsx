import React, { useEffect, useRef } from 'react'
import { lerp, PI2, PRISM_HUES } from '../utils/animation'
import { onFrame, removeFrame } from '../hooks/useAnimation'

/* ═══════════════════════════════════════════════════════════
   AMBIENT LAYER v2 — Crystal prism light field + afterglow bokeh
   Full-screen generative canvas behind everything.
   • 5 breathing prismatic orbs (slow, subtle, cinematic)
   • 8 afterglow bokeh blobs that drift and pulse
   • screen blend mode — purely additive, never obscures content
═══════════════════════════════════════════════════════════ */
export default function AmbientLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // ── Crystal light sources (prismatic orbs) — Reduced to 2 for academic minimalism ──
    const sources = [
      { xf: 0.20, yf: 0.75, r: 0.42, hue: 181, hue2: 210, a: 0.10, speed: 0.0009, phase: 4.0 },  // Cool cyan/indigo (reduced opacity)
      { xf: 0.50, yf: 0.40, r: 0.35, hue: 215, hue2: 240, a: 0.09, speed: 0.0011, phase: 5.2 },  // Cool blue (reduced opacity)
    ]

    let t = 0

    function drawPrismOrb(cx: number, cy: number, R: number, h1: number, h2: number, alpha: number) {
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      g1.addColorStop(0.00, `hsla(${h1}, 100%, 70%, ${alpha * 0.9})`)
      g1.addColorStop(0.30, `hsla(${(h1 + h2) / 2}, 100%, 65%, ${alpha * 0.5})`)
      g1.addColorStop(0.60, `hsla(${h2}, 90%, 60%, ${alpha * 0.25})`)
      g1.addColorStop(1.00, `hsla(${h2}, 80%, 50%, 0)`)
      ctx.fillStyle = g1
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, PI2); ctx.fill()

      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35)
      g2.addColorStop(0.0, `hsla(0, 0%, 100%, ${alpha * 1.4})`)
      g2.addColorStop(0.4, `hsla(${h1}, 100%, 85%, ${alpha * 0.7})`)
      g2.addColorStop(1.0, `hsla(${h1}, 80%, 60%, 0)`)
      ctx.fillStyle = g2
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.35, 0, PI2); ctx.fill()
    }


    const entry = onFrame(() => {
      t++
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'screen'

      // Draw prismatic orbs (reduced to 3 for boutique restraint)
      for (const s of sources) {
        const breathe  = 0.80 + 0.20 * Math.sin(t * s.speed + s.phase)
        const drift_x  = Math.sin(t * s.speed * 0.7 + s.phase) * 0.06
        const drift_y  = Math.cos(t * s.speed * 0.5 + s.phase + 1) * 0.04
        const cx = (s.xf + drift_x) * W
        const cy = (s.yf + drift_y) * H
        const R  = s.r * Math.min(W, H) * breathe
        const h1 = s.hue  + Math.sin(t * s.speed * 2 + s.phase) * 12
        const h2 = s.hue2 + Math.cos(t * s.speed * 1.5 + s.phase) * 10
        drawPrismOrb(cx, cy, R, h1, h2, s.a * breathe)
      }
    }, canvas)

    return () => {
      removeFrame(entry)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        mixBlendMode: 'screen', opacity: 0.82,
      }}
      aria-hidden="true"
    />
  )
}
