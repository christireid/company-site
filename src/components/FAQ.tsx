import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useAnimation'

/* ── Mini animated waveform ── */
const WAVE_BARS = 8
const WAVE_HUES = [181, 200, 220, 240, 210, 195, 182, 205]
function WaveBar({ i, isOpen }: { i: number; isOpen: boolean }) {
  return (
    <motion.div
      className="faq-wave-bar"
      animate={isOpen
        ? { scaleY: [0.3, 1.0, 0.5, 0.8, 0.4, 1.0, 0.6, 0.3][i % 8], opacity: 1 }
        : { scaleY: 0.2, opacity: 0.3 }
      }
      transition={{ duration: 0.5, delay: i * 0.04, repeat: isOpen ? Infinity : 0, repeatType: 'reverse', ease: 'easeInOut' }}
      style={{ background: `hsl(${WAVE_HUES[i]}, 90%, 72%)` }}
    />
  )
}
function MiniWave({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="faq-mini-wave" aria-hidden="true">
      {Array.from({ length: WAVE_BARS }, (_, i) => <WaveBar key={i} i={i} isOpen={isOpen} />)}
    </div>
  )
}

const faqs = [
  {
    q: "Who is this for?",
    a: "Organisations with a real AI decision in front of them — not a vague board mandate to 'explore AI'. Leaders who've moved past the hype and want technically honest advice that ends in a working system, a clear decision, or a team with new capabilities. If you already know what you need, we'll scope it. If you don't, the first conversation will help you figure it out.",
  },
  {
    q: "What does a typical engagement look like?",
    a: "It starts with a scoping call — not a pitch deck. Strategy engagements run several weeks and end with a specific, executable roadmap (not a framework to fill in later). Training programmes are built around your team's actual tools and workflows. Implementation projects run to a fixed timeline with defined milestones. All three can run separately or as an integrated programme.",
  },
  {
    q: "Can you cover all three — strategy, training, and development?",
    a: "Yes, and the integration is often where the real leverage is. A strategy that's designed by people who'll also run the training and build the software tends to stay honest. The recommendations get tested against what's actually buildable. The training gets designed around what the team will really use. There's no version of the work that lives in a slide deck and never touches production.",
  },
  {
    q: "How is this different from a traditional AI consultancy?",
    a: "The gap is accountability. Traditional consultancies can recommend an LLM architecture without ever having shipped one, design training on RAG systems without having built them in production, and separate the people who write the strategy from the people who execute it. We operate as a single practice. The recommendation comes with the same people who can build it — which tends to make the recommendations more honest.",
  },
  {
    q: "What's the training approach?",
    a: "Programmes designed around your team's real work — not slides and sample datasets. We build curricula grounded in how engineers actually develop skills: through real problems, real feedback, and real output. Four years designing developer programmes taught us that information transfer doesn't produce capability. Application does.",
  },
  {
    q: "What's your approach to AI implementation?",
    a: "End-to-end implementation whether that means rigorous vendor integration, selective custom development, or hybrid approaches. We evaluate your requirements, select the right solution (vendor platform, custom build, or hybrid), architect it, integrate with your existing systems, and deploy to production. Complete systems your team can own — not just prototypes or vendor setups left half-integrated. The focus is on the right solution, implemented correctly. Not on maximizing custom development hours.",
  },
  {
    q: "What does working with you look like day to day?",
    a: "Scope and deliverables agreed in writing before anything starts. Progress visible every week — not a status update, but working output. At close: code that runs, documentation written for the people who'll maintain it, and a knowledge transfer session so the capability lives with your team. You should be able to operate and extend the work without us. If you can't, we haven't finished.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="section-faq" className="section section-faq" aria-label="FAQ" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="section-content" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section-eyebrow">Questions</div>
          <h2 className="section-title">
            The things people<br />
            <em className="text-prism">actually ask.</em>
          </h2>
        </motion.div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              className={`faq-item ${open === i ? 'open' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <MiniWave isOpen={open === i} />
                <span>{item.q}</span>
                <span className="faq-chevron" aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    className="faq-a"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
