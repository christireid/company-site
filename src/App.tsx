import React, { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ProofStrip from './components/ProofStrip'
import ManifestoBreak from './components/ManifestoBreak'
import Services from './components/Services'
import ProductSignal from './components/ProductSignal'
import TransformZones from './components/TransformZones'

// Below-the-fold components stay lazy
const ContrastBreak = lazy(() => import('./components/ContrastBreak'))
const Process = lazy(() => import('./components/Process'))
const FAQ = lazy(() => import('./components/FAQ'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Nav />

      <main id="main">
        <Hero />
        <ProofStrip />
        <ManifestoBreak />
        <Services />
        <ProductSignal />
        <TransformZones />

        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <ContrastBreak />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <Process />
        </Suspense>
        <hr className="divider" />
        <Suspense fallback={<div style={{ minHeight: '50vh' }} />}>
          <FAQ />
        </Suspense>
        <hr className="divider divider--prism" />
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
