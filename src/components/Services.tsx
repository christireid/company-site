import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useAnimation'

/* Animated bar chart — deliverable weight visualisation */
function DeliverableChart({ items, accent }: { items: string[]; accent: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const widths = [92, 78, 85, 68, 80, 72, 88, 65]

  // Disable animation on mobile for performance
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 680)
    const handleResize = () => setIsMobile(window.innerWidth < 680)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={ref} className="svc-del-chart">
      {items.map((item, i) => (
        <div key={item} className="svc-del-row">
          <span className="svc-del-name">{item}</span>
          <div className="svc-del-bar-track">
            <motion.div
              className="svc-del-bar-fill"
              style={{ background: accent }}
              initial={isMobile ? { width: `${widths[i % widths.length]}%` } : { width: 0 }}
              animate={inView && !isMobile ? { width: `${widths[i % widths.length]}%` } : {}}
              transition={isMobile ? { duration: 0 } : { duration: 0.7, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const services = [
  {
    id: 'strategy', num: '01', icon: '◈',
    title: 'AI Strategy, Policy & Governance',
    headline: 'A decision, not a deck.',
    insight: "The single most expensive AI mistake isn't choosing the wrong model. It's starting before you've defined what success actually looks like — then hiring consultants to validate what you already decided.",
    body: "We provide honest technical assessments of where AI creates real, specific value for your organization — and where it doesn't. Comprehensive vendor evaluation against your requirements, regulatory readiness (EU AI Act, sector-specific compliance), build vs buy analysis with defensible recommendations, and governance frameworks that survive contact with reality. A roadmap precise enough to execute without us. One point of contact who can actually build what they recommend.",
    deliverables: ['AI readiness assessment','Vendor evaluation & selection','Build vs buy analysis','Governance & compliance framework','EU AI Act regulatory mapping','Risk assessment & guardrails','Strategic roadmap','Executive knowledge transfer'],
    cta: 'Get a straight answer →', accent: 'hsl(17, 85%, 62%)', // Warm orange from hero gradient
  },
  {
    id: 'training', num: '02', icon: '◎',
    title: 'Training & Capability Building',
    headline: 'Still using it six months later.',
    insight: "Most AI training produces confident-sounding teams who quietly return to their old workflows by the following week. The problem isn't the tools — it's training built around information transfer instead of actual behavioral change and skill formation.",
    body: "We design learning programmes around your team's real work, on your real problems, with real feedback loops. Technical depth you'd expect from engineers who ship. Pedagogical craft from four years building developer curricula that stuck. Your people leave the programme using these tools in their daily work — not just knowing about them. Institutional capability that persists beyond any individual.",
    deliverables: ['Custom curriculum design','Self-paced learning materials','Live workshops (half-day to multi-day)','LLM & AI tool training','Workflow design & optimization','Institutional knowledge capture','Assessment & competency frameworks','Mentoring & coaching programmes'],
    cta: 'Build real capability →', accent: 'hsl(181, 85%, 75%)', // Bright cyan from hero gradient
  },
  {
    id: 'development', num: '03', icon: '⬡',
    title: 'AI Implementation',
    headline: 'The right implementation for your needs.',
    insight: "The gap between a demo that impresses a board and a system users actually rely on is enormous. Most AI projects live in that gap forever. We implement production-ready solutions — whether that means rigorous vendor integration, selective custom development, or hybrid approaches.",
    body: "End-to-end AI implementation: we evaluate your requirements, select the right approach (vendor platform, custom build, or hybrid), architect the solution, integrate with your existing systems, and deploy to production. From model selection through to operational handover — the right solution for your environment, implemented correctly. Not on maximizing custom development hours.",
    deliverables: ['Implementation planning','Vendor solution integration','Selective custom development','LLM & RAG system architecture','Production deployment & operations','System integration & data pipelines','Client-facing interfaces','Complete knowledge transfer'],
    cta: 'Start implementing →', accent: 'hsl(37, 85%, 74%)', // Warm peach from hero gradient
  },
]

function ServiceCard({ svc, i }: { svc: typeof services[0]; i: number }) {
  return (
    <motion.div className="service-card reveal-on-scroll"
      style={{ '--svc-accent': svc.accent } as any}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>

      <div className="svc-card-top">
        <div className="svc-num-row">
          <span className="svc-icon">{svc.icon}</span>
          <span className="svc-num">{svc.num}</span>
        </div>
        <h3 className="svc-title">{svc.title}</h3>
        <p className="svc-headline">{svc.headline}</p>
      </div>

      <div className="svc-insight" style={{ borderLeftColor: svc.accent + '55' }}>
        <span className="svc-insight-mark" style={{ color: svc.accent }}>❝</span>
        <span>{svc.insight}</span>
      </div>

      <p className="svc-body-short">{svc.body}</p>

      <div className="svc-deliverables">
        <div className="svc-del-label">What you get</div>
        <DeliverableChart items={svc.deliverables} accent={svc.accent} />
      </div>

      <a href="#section-contact" className="svc-cta"
        onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
        {svc.cta}
      </a>

      <div className="svc-card-glow" aria-hidden="true"/>
      <div className="svc-shimmer" aria-hidden="true"/>
    </motion.div>
  )
}

export default function Services() {
  return (
    <section id="section-services" className="section section-services" aria-label="Services">
      <div className="section-content" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div className="section-header slide-up"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="section-eyebrow">Three practice areas</div>
          <h2 className="section-title">What we do.<br/><em className="text-prism">What you get.</em></h2>
          <p className="section-lead">Strategy without execution is a document. Training without strategy is wasted. Software without the capability to maintain it is a liability. Each service makes the others stronger.</p>
        </motion.div>
        <div className="services-grid">
          {services.map((svc, i) => <ServiceCard key={svc.id} svc={svc} i={i} />)}
        </div>
      </div>
    </section>
  )
}
