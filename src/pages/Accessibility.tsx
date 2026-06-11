import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Accessibility() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Nav />
      <main id="main" className="prose-page">
        <span className="kicker">Accessibility</span>
        <h1>Accessibility statement</h1>
        <p className="prose-meta">Last reviewed: June 2026</p>

        <p>
          Code &amp; Clarity is committed to a website that everyone can read and use,
          regardless of ability or assistive technology. Accessibility is part of how we
          judge our own work, and we hold this site to the same standard we recommend to
          the universities and public-sector organizations we advise.
        </p>

        <h2>Conformance target</h2>
        <p>
          This site is designed and tested to conform to the{' '}
          <a href="https://www.w3.org/TR/WCAG21/">Web Content Accessibility Guidelines (WCAG) 2.1</a>,
          Level AA.
        </p>

        <h2>Measures we take</h2>
        <ul>
          <li>All text meets or exceeds WCAG contrast minimums (4.5:1 for body text, 3:1 for large text) against the page background.</li>
          <li>The full site is operable by keyboard alone, with visible focus indicators and a skip-to-content link.</li>
          <li>Semantic HTML landmarks and labels are provided for screen readers; expandable content uses native, accessible controls.</li>
          <li>All animation respects the <code>prefers-reduced-motion</code> setting and collapses to static content when it is enabled.</li>
          <li>No content flashes, autoplays with sound, or requires precise pointer gestures.</li>
          <li>The site uses the browser&rsquo;s native cursor and standard text resizing; layouts remain usable at 200% zoom.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          The contact form depends on JavaScript. If you cannot use it, email us directly and
          we will respond within one business day.
        </p>

        <h2>Feedback</h2>
        <p>
          If you encounter any barrier using this site, please tell us at{' '}
          <a href="mailto:hello@codeclarity.ai">hello@codeclarity.ai</a>. We aim to respond
          within one business day and to fix verified issues promptly.
        </p>
      </main>
      <Footer />
    </>
  )
}
