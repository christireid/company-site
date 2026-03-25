import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useAnimation'

/* ── Arc meter: draws a partial SVG circle showing step progress ── */
function ArcMeter({ fraction, color, size = 44 }: { fraction: number; color: string; size?: number }) {
  const r    = (size - 6) / 2
  const cx   = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = circ * fraction
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className="arc-meter-svg" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(151,254,255,0.07)" strokeWidth="3"/>
      <motion.circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="3" strokeLinecap="round"
        strokeDasharray={`${circ}`}
        style={{ rotate: '-90deg', transformOrigin: `${cx}px ${cy}px` }}
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: circ - dash }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="9" fill={color} style={{ fontFamily: 'monospace', fontWeight: 600 }}>
        {Math.round(fraction * 100)}%
      </text>
    </svg>
  )
}

/* ── Animated pipeline SVG — the only diagram we need here ── */
function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const steps = [
    { num:'01', phase:'Discovery',  color:'#FF7E4A', icon:'◐' },
    { num:'02', phase:'Alignment',  color:'#FFD040', icon:'◑' },
    { num:'03', phase:'Delivery',   color:'#97FEFF', icon:'◕' },
    { num:'04', phase:'Transfer',   color:'#0044FF', icon:'●' },
  ]

  const W = 520, H = 80
  const nodeY = H / 2
  const xs = [52, 180, 340, 468]

  return (
    <div ref={ref} className="pipeline-diagram-wrap" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="pipeline-diagram-svg">
        <defs>
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF7E4A" stopOpacity="0.7"/>
            <stop offset="33%"  stopColor="#FFD040" stopOpacity="0.7"/>
            <stop offset="66%"  stopColor="#97FEFF" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#0044FF" stopOpacity="0.7"/>
          </linearGradient>
          <filter id="pg"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>

        <motion.line x1={xs[0]} y1={nodeY} x2={xs[xs.length-1]} y2={nodeY}
          stroke="rgba(151,254,255,0.08)" strokeWidth="2"
          initial={{pathLength:0}} animate={inView?{pathLength:1}:{}}
          transition={{duration:0.8}}/>
        <motion.line x1={xs[0]} y1={nodeY} x2={xs[xs.length-1]} y2={nodeY}
          stroke="url(#pipeGrad)" strokeWidth="2" filter="url(#pg)"
          initial={{pathLength:0,opacity:0}} animate={inView?{pathLength:1,opacity:1}:{}}
          transition={{duration:1.1,delay:0.3,ease:[0.16,1,0.3,1]}}/>

        <motion.circle r="4" fill="#97FEFF" filter="url(#pg)"
          initial={{opacity:0}} animate={inView?{opacity:[0,1,1,0]}:{}}
          transition={{duration:2,delay:1.5,repeat:Infinity,repeatDelay:1}}>
          <animateMotion path={`M ${xs[0]} ${nodeY} L ${xs[xs.length-1]} ${nodeY}`}
            dur="2s" begin="1.5s" repeatCount="indefinite"/>
        </motion.circle>

        {steps.map((s, i) => (
          <motion.g key={s.num}
            initial={{opacity:0}} animate={inView?{opacity:1}:{}}
            transition={{duration:0.55,delay:0.5+i*0.15,ease:[0.34,1.56,0.64,1]}}>
            <circle cx={xs[i]} cy={nodeY} r="18" fill="rgba(4,4,12,0.92)"
              stroke={s.color} strokeWidth="1.5" strokeOpacity="0.7"/>
            <circle cx={xs[i]} cy={nodeY} r="22" fill="none"
              stroke={s.color} strokeWidth="0.5" strokeOpacity="0.2"/>
            <text x={xs[i]} y={nodeY+1} textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fill={s.color} style={{fontFamily:'monospace'}}>{s.icon}</text>
          </motion.g>
        ))}

        {steps.map((s, i) => (
          <motion.text key={`lbl${i}`} x={xs[i]} y={nodeY+34}
            textAnchor="middle" fontSize="7.5" fill={s.color}
            letterSpacing="0.8" style={{fontFamily:'monospace',textTransform:'uppercase'}}
            initial={{opacity:0,y:38}} animate={inView?{opacity:1,y:nodeY+34}:{}}
            transition={{duration:0.5,delay:0.7+i*0.15}}>
            {s.phase}
          </motion.text>
        ))}

        {steps.map((s, i) => (
          <motion.text key={`num${i}`} x={xs[i]} y={nodeY-28}
            textAnchor="middle" fontSize="7" fill="rgba(150,148,200,0.4)"
            letterSpacing="0.5" style={{fontFamily:'monospace'}}
            initial={{opacity:0}} animate={inView?{opacity:1}:{}}
            transition={{duration:0.4,delay:0.8+i*0.15}}>
            {s.num}
          </motion.text>
        ))}
      </svg>
    </div>
  )
}

const steps = [
  {
    num:'01', phase:'Discovery', icon:'◐', color:'#FF7E4A', arc: 0.25,
    title:'A straight answer first',
    body:'Tell us what you\'re actually trying to solve — whether it\'s strategic assessment, governance design, capability building, or implementation. We\'ll tell you honestly whether we can help, what we expect the engagement to produce, and what success looks like before anything is agreed.',
  },
  {
    num:'02', phase:'Alignment', icon:'◑', color:'#FFD040', arc: 0.50,
    title:'Scope agreed in writing',
    body:'Deliverables, timeline, acceptance criteria, and governance requirements locked before a single billable hour begins. Scope changes require a new agreement. No ambiguity, no surprises.',
  },
  {
    num:'03', phase:'Delivery', icon:'◕', color:'#97FEFF', arc: 0.75,
    title:'Progress you can see weekly',
    body:'Working outputs every week — not a status update. You see what\'s been built, what\'s been decided, and what\'s next. Strategic recommendations, governance frameworks, training materials, or working code. Redirect anytime.',
  },
  {
    num:'04', phase:'Transfer', icon:'●', color:'#0044FF', arc: 1.0,
    title:'Complete handover built in from day one',
    body:'The engagement closes when the work is production-ready and fully handed over. Strategy documents are written to be executable. Governance frameworks are written for the people who\'ll enforce them. Code is written to be read and extended. Complete documentation, runbooks, and knowledge transfer from day one — not an afterthought.',
  },
]

export default function Process() {
  return (
    <section id="section-process" className="section section-process" aria-label="Process">
      <div className="section-content" style={{position:'relative',zIndex:2}}>
        <motion.div className="section-header"
          initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.3}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}>
          <div className="section-eyebrow">How we work</div>
          <h2 className="section-title">No surprises.<br/><em className="text-prism">No open endings.</em></h2>
        </motion.div>

        {/* Pipeline diagram */}
        <motion.div
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.3}}
          transition={{duration:0.9,delay:0.1,ease:[0.16,1,0.3,1]}}>
          <PipelineDiagram />
        </motion.div>

        {/* Step cards */}
        <div className="process-grid" style={{marginTop:'2.5rem'}}>
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <motion.div className="process-step reveal-item"
                initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}}
                viewport={{once:true,amount:0.2}}
                transition={{delay:i*0.09,duration:0.85,ease:[0.16,1,0.3,1]}}>
                <div className="step-header">
                  <div className="step-num-wrap">
                    <span className="process-step-icon" style={{color:step.color}}>{step.icon}</span>
                    <span className="step-num">{step.num}</span>
                  </div>
                  <ArcMeter fraction={step.arc} color={step.color} />
                  <span className="step-phase" style={{color:step.color+'cc'}}>{step.phase}</span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  className="process-arrow"
                  aria-hidden="true"
                  initial={{opacity:0,scale:0.5}} whileInView={{opacity:1,scale:1}}
                  viewport={{once:true,amount:0.5}}
                  transition={{delay:i*0.09+0.3,duration:0.5,ease:[0.34,1.56,0.64,1]}}
                >
                  <span style={{color: step.color}}>→</span>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div className="process-cta-block"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
          viewport={{once:true,amount:0.5}}
          transition={{duration:0.9,ease:[0.16,1,0.3,1]}}>
          <p className="process-cta-text">Every engagement starts with a direct conversation. Whether you need strategic assessment, governance frameworks, capability building, or full implementation — or you're still figuring out which — both are useful starting points.</p>
          <a href="#section-contact" className="hero-cta-primary"
            onClick={e=>{e.preventDefault();document.getElementById('section-contact')?.scrollIntoView({behavior:'smooth'})}}>
            <span className="btn-text">Let's talk →</span>
            <span className="btn-shimmer"/>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
