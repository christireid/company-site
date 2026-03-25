import { useEffect, useRef, useState } from 'react'
import { onFrame, removeFrame } from '../hooks/useAnimation'

/* ─────────────────────────────────────────────────────────────────
   TERMINAL BLOCK v2
   Upgraded animated typing terminal:
   • macOS-style header with traffic-light dots + sequence indicator
   • Progress bar that fills as sequence completes
   • Live wpm counter
   • Wider body with better line spacing
   • Enhanced CRT scanline + slow-moving phosphor glow
   • Prism border shimmer on entry
───────────────────────────────────────────────────────────────── */

interface Line {
  type: 'prompt' | 'output' | 'comment' | 'accent' | 'blank' | 'success'
  text: string
  speed?: number
  pause?: number
}

const SEQUENCES: Line[][] = [
  [
    { type: 'comment', text: '// Initialising AI readiness assessment…', speed: 20 },
    { type: 'blank',   text: '' },
    { type: 'prompt',  text: '$ codeclarity assess --org "Acme Corp" --depth full', speed: 42 },
    { type: 'output',  text: '  ✓  Scanning 14 active workflows', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Evaluating tool landscape (23 vendors)', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Regulatory mapping: EU AI Act · ISO 42001', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Identifying highest-value integration points', speed: 16, pause: 240 },
    { type: 'blank',   text: '' },
    { type: 'accent',  text: '  → 3 quick wins  ·  2 strategic builds  ·  1 risk', speed: 26, pause: 700 },
    { type: 'success', text: '  ✦  Assessment complete — report ready', speed: 24, pause: 1100 },
  ],
  [
    { type: 'comment', text: '// Designing capability transfer programme…', speed: 20 },
    { type: 'blank',   text: '' },
    { type: 'prompt',  text: '$ codeclarity train --team dev --format workshop', speed: 42 },
    { type: 'output',  text: '  ✓  Analysing current skill distribution', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Mapping workflows to learning objectives', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Generating curriculum outline (4 modules)', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Schedule: 2 live sessions + self-paced track', speed: 16, pause: 240 },
    { type: 'blank',   text: '' },
    { type: 'accent',  text: '  → Complete implementation. Full operational handover.', speed: 26, pause: 700 },
    { type: 'success', text: '  ✦  Programme designed — ready to deploy', speed: 24, pause: 1100 },
  ],
  [
    { type: 'comment', text: '// Scoping AI pilot build…', speed: 20 },
    { type: 'blank',   text: '' },
    { type: 'prompt',  text: '$ codeclarity pilot --problem "doc-search" --weeks 6', speed: 42 },
    { type: 'output',  text: '  ✓  Defining evaluation criteria upfront', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Architecture: RAG + streaming interface', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Milestone 1 → working prototype (wk 2)', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Milestone 3 → production-ready handover', speed: 16, pause: 240 },
    { type: 'blank',   text: '' },
    { type: 'accent',  text: '  → Pilot answers the question. Not creates more.', speed: 26, pause: 700 },
    { type: 'success', text: '  ✦  Pilot scoped — 6-week delivery schedule set', speed: 24, pause: 1100 },
  ],
  [
    { type: 'comment', text: '// Running policy framework analysis…', speed: 20 },
    { type: 'blank',   text: '' },
    { type: 'prompt',  text: '$ codeclarity policy --scope org --include governance', speed: 42 },
    { type: 'output',  text: '  ✓  EU AI Act compliance gap analysis', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Internal usage policy draft (v0.1)', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Model risk classification framework', speed: 16, pause: 160 },
    { type: 'output',  text: '  ✓  Guardrails spec for 3 high-risk use cases', speed: 16, pause: 240 },
    { type: 'blank',   text: '' },
    { type: 'accent',  text: '  → Governance before you need it. Not after.', speed: 26, pause: 700 },
    { type: 'success', text: '  ✦  Policy framework drafted — legal review ready', speed: 24, pause: 1100 },
  ],
]

const SEQ_LABELS = ['assess', 'train', 'pilot', 'policy']

/* Enhanced CRT scanline canvas */
function ScanlineCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    let t = 0

    const entry = onFrame(() => {
      t++
      const W = c.width  = c.offsetWidth
      const H = c.height = c.offsetHeight
      ctx.clearRect(0, 0, W, H)

      // scanlines
      for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)'
        ctx.fillRect(0, y, W, 1)
      }

      // slow phosphor glow band
      const gy = ((t * 0.55) % (H + 60)) - 30
      const g = ctx.createLinearGradient(0, gy - 18, 0, gy + 18)
      g.addColorStop(0,   'rgba(151,254,255,0)')
      g.addColorStop(0.4, 'rgba(151,254,255,0.045)')
      g.addColorStop(0.5, 'rgba(151,254,255,0.07)')
      g.addColorStop(0.6, 'rgba(151,254,255,0.045)')
      g.addColorStop(1,   'rgba(151,254,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, gy - 18, W, 36)

      // subtle vignette edges
      const vL = ctx.createLinearGradient(0, 0, 40, 0)
      vL.addColorStop(0, 'rgba(0,0,0,0.10)')
      vL.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = vL
      ctx.fillRect(0, 0, 40, H)

      const vR = ctx.createLinearGradient(W - 40, 0, W, 0)
      vR.addColorStop(0, 'rgba(0,0,0,0)')
      vR.addColorStop(1, 'rgba(0,0,0,0.10)')
      ctx.fillStyle = vR
      ctx.fillRect(W - 40, 0, 40, H)
    }, c)

    return () => removeFrame(entry)
  }, [])
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 3, borderRadius: 'inherit',
      }}
      aria-hidden="true"
    />
  )
}

/* Progress bar that tracks sequence completion */
function ProgressBar({ progress, seqIdx }: { progress: number; seqIdx: number }) {
  const colors = ['#97FEFF', '#FFD040', '#FF7E4A', '#0044FF']
  return (
    <div className="term-progress-wrap">
      <div
        className="term-progress-bar"
        style={{
          width: `${progress * 100}%`,
          background: colors[seqIdx % colors.length],
          boxShadow: `0 0 8px ${colors[seqIdx % colors.length]}55`,
        }}
      />
    </div>
  )
}

export default function TerminalBlock() {
  const [seqIdx,   setSeqIdx]   = useState(0)
  const [lineIdx,  setLineIdx]  = useState(0)
  const [charIdx,  setCharIdx]  = useState(0)
  const [done,     setDone]     = useState(false)
  const [erasing,  setErasing]  = useState(false)
  const [visLines, setVisLines] = useState<Line[]>([])
  const [cursorV,  setCursorV]  = useState(true)
  const [entered,  setEntered]  = useState(false)

  // entrance: delay first type so framer-motion animation settles
  useEffect(() => { const id = setTimeout(() => setEntered(true), 800); return () => clearTimeout(id) }, [])

  // cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorV(v => !v), 520)
    return () => clearInterval(id)
  }, [])

  // progress 0→1
  const seq = SEQUENCES[seqIdx]
  const progress = seq.length > 0
    ? Math.min(1, (lineIdx + (charIdx / Math.max(1, (seq[lineIdx]?.text?.length ?? 1)))) / seq.length)
    : 0

  // typewriter engine
  useEffect(() => {
    if (!entered) return

    if (erasing) {
      if (visLines.length === 0) {
        setErasing(false); setLineIdx(0); setCharIdx(0); setDone(false)
        setSeqIdx(i => (i + 1) % SEQUENCES.length)
        return
      }
      const tid = setTimeout(() => setVisLines(l => l.slice(0, -1)), 48)
      return () => clearTimeout(tid)
    }

    if (done) {
      const lastLine = seq[seq.length - 1]
      const holdMs = (lastLine.pause ?? 400) + 900
      const tid = setTimeout(() => setErasing(true), holdMs)
      return () => clearTimeout(tid)
    }

    if (lineIdx >= seq.length) { setDone(true); return }

    const line = seq[lineIdx]

    if (line.type === 'blank') {
      setVisLines(l => [...l, line]); setLineIdx(i => i + 1); setCharIdx(0)
      return
    }

    const spd    = line.speed ?? 38
    const target = line.text

    if (charIdx < target.length) {
      const jitter = (Math.random() - 0.5) * spd * 0.3
      const tid = setTimeout(() => {
        setVisLines(prev => {
          const next = [...prev]
          next[lineIdx] = { ...line, text: target.slice(0, charIdx + 1) }
          return next
        })
        setCharIdx(i => i + 1)
      }, spd + jitter)
      return () => clearTimeout(tid)
    }

    const tid = setTimeout(() => {
      setVisLines(prev => { const n = [...prev]; n[lineIdx] = line; return n })
      setLineIdx(i => i + 1); setCharIdx(0)
    }, line.pause ?? 280)
    return () => clearTimeout(tid)
  }, [seqIdx, lineIdx, charIdx, done, erasing, visLines, entered])

  const colorMap: Record<Line['type'], string> = {
    prompt:  '#97FEFF',
    output:  'rgba(210,208,240,0.80)',
    comment: 'rgba(150,148,200,0.40)',
    accent:  '#FFD040',
    blank:   'transparent',
    success: '#28C840',
  }

  const currentTypingLine = !erasing && !done && lineIdx < seq.length ? seq[lineIdx] : null

  return (
    <div className="terminal-block" role="region" aria-label="AI strategy terminal">

      {/* ── Header ── */}
      <div className="terminal-header">
        <span className="term-dot" style={{ background: '#FF5F57' }} />
        <span className="term-dot" style={{ background: '#FEBC2E' }} />
        <span className="term-dot" style={{ background: '#28C840' }} />
        <span className="term-title">codeclarity — strategy session</span>
        {/* sequence indicators */}
        <div className="term-seq-dots" aria-label="sequence indicator">
          {SEQ_LABELS.map((label, i) => (
            <span
              key={label}
              className={`term-seq-dot${i === seqIdx ? ' active' : ''}`}
              title={label}
            />
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar progress={done || erasing ? 1 : progress} seqIdx={seqIdx} />

      {/* ── Body ── */}
      <div className="terminal-body">
        {visLines.map((line, i) => {
          // Skip the current line — it's rendered below with the cursor
          if (!erasing && !done && i === lineIdx) return null
          return (
            <div
              key={`${seqIdx}-${i}`}
              className={`term-line${line.type === 'success' ? ' term-line-success' : ''}`}
              style={{ color: colorMap[line.type] }}
            >
              {line.text}
            </div>
          )
        })}

        {/* live typing line — shows partial text + blinking cursor */}
        {currentTypingLine && (
          <div className="term-line" style={{ color: colorMap[currentTypingLine.type] }}>
            {visLines[lineIdx]?.text ?? ''}
            <span className="term-cursor" style={{ opacity: cursorV ? 1 : 0 }}>▊</span>
          </div>
        )}

        {/* idle cursor */}
        {(done || erasing) && (
          <div className="term-line" style={{ color: '#97FEFF' }}>
            <span className="term-cursor" style={{ opacity: cursorV ? 1 : 0 }}>▊</span>
          </div>
        )}
      </div>

      {/* ── Footer status bar ── */}
      <div className="terminal-footer">
        <span className="term-status-dot" />
        <span className="term-status-text">
          {erasing ? 'clearing…' : done ? 'complete' : 'running'}
        </span>
        <span className="term-seq-label">
          {SEQ_LABELS[seqIdx]}
        </span>
        <span className="term-seq-counter">{seqIdx + 1} / {SEQUENCES.length}</span>
      </div>

      <ScanlineCanvas />
    </div>
  )
}
