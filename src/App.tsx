import React, { useEffect, useState, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import AmbientLayer from './components/AmbientLayer'
import Hero from './components/Hero'
import ManifestoBreak from './components/ManifestoBreak'
import Services from './components/Services'
import ProductSignal from './components/ProductSignal'
import TransformZones from './components/TransformZones'
import GlobalEffects from './components/GlobalEffects'
import TerminalBlock from './components/TerminalBlock'
import { motion } from 'framer-motion'

// Lazy load below-the-fold components
const ContrastBreak = lazy(() => import('./components/ContrastBreak'))
const Process = lazy(() => import('./components/Process'))
const FAQ = lazy(() => import('./components/FAQ'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

/* Thin animated prism line between sections */
function PrismDivider({ dot = '50%' }: { dot?: string }) {
  return <div className="prism-divider" style={{ '--divider-dot': dot } as React.CSSProperties} />
}

function StickyCtaBar() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed || !visible) return null

  return (
    <div className="sticky-cta-bar" role="complementary" aria-label="Book a call">
      <span className="sticky-label">Accepting new engagements</span>
      <a href="#section-contact" className="sticky-btn"
        onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
        Start the conversation →
      </a>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="sticky-dismiss">×</button>
    </div>
  )
}

export default function App() {

  return (
    <>
      <AmbientLayer />
      <GlobalEffects />
      <StickyCtaBar />

      <svg className="svg-filters" aria-hidden="true">
        <defs>
          <filter id="liquid-burn">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.022" numOctaves={4} seed={2} result="turb"/>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={18} xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
      </svg>

      <Nav />

      <main>
        {/* ── 1. Hero ── */}
        <Hero />

        {/* ── 2. Manifesto interstitial ── */}
        <PrismDivider dot="30%" />
        <ManifestoBreak />

        {/* ── 3. Services — four practice areas ── */}
        <PrismDivider dot="50%" />
        <Services />

        {/* ── 4. Product Signal — full AI dev + UX quality ── */}
        <PrismDivider dot="25%" />
        <ProductSignal />

        {/* ── 5. Transform Zones — deep dive per service ── */}
        <PrismDivider dot="55%" />
        <TransformZones />

        {/* ── 6. Contrast Break — their way vs our way ── */}
        <PrismDivider dot="35%" />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <ContrastBreak />
        </Suspense>

        {/* ── 8. Process — how it works ── */}
        <PrismDivider dot="20%" />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <Process />
        </Suspense>

        {/* ── 10. FAQ ── */}
        <PrismDivider dot="45%" />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <FAQ />
        </Suspense>

        {/* ── 11. Terminal — live demonstration ── */}
        <PrismDivider dot="60%" />
        <section
          id="section-terminal"
          style={{
            position: 'relative',
            background: 'var(--void)',
            padding: '7rem var(--pad-x) 6rem',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(151,254,255,0.04) 0%, transparent 65%)',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}
          >
            <span className="section-eyebrow">See it in action</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '-.025em',
              color: 'var(--text-primary)',
              marginTop: '.5rem',
            }}>
              A strategy session,<br />
              <em className="text-prism">in 30 seconds.</em>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(.9rem, 1.5vw, 1.05rem)',
              color: 'var(--text-body)',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '1.4rem auto 0',
              opacity: 0.8,
            }}>
              This is the kind of clarity you get from the first conversation —
              structured thinking, no filler, and a clear next step.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}
          >
            <TerminalBlock />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginTop: '3rem', position: 'relative', zIndex: 2 }}
          >
            <a href="#section-contact" className="hero-cta-primary" style={{ display: 'inline-flex' }}
              onClick={e => { e.preventDefault(); document.getElementById('section-contact')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <span className="btn-text">Book the real conversation →</span>
              <span className="btn-shimmer" />
            </a>
          </motion.div>
        </section>

        {/* ── 12. Contact ── */}
        <PrismDivider dot="45%" />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={<div style={{ minHeight: '20vh' }} />}>
        <Footer />
      </Suspense>
    </>
  )
}
