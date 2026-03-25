import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="nav-logo-mark">✦</span>
          <span className="nav-logo-text">Code <span className="nav-logo-amp">&amp;</span> Clarity</span>
        </div>
        <p className="footer-tagline">
          AI Strategy · Training · Implementation — fixed scope, clear exit, full capability transfer.
        </p>
        <nav className="footer-links" aria-label="Footer navigation">
          {[
            { label: 'What we do', href: '#section-transform' },
            { label: 'Services', href: '#section-services' },
            { label: 'How We Work', href: '#section-process' },
            { label: 'Contact', href: '#section-contact' },
          ].map(l => (
            <a key={l.label} href={l.href} className="footer-link"
              onClick={e => { e.preventDefault(); document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' }) }}>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="footer-copy">
          © {new Date().getFullYear()} Code &amp; Clarity. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
