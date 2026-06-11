import React from 'react'

const LINKS = [
  { label: 'Implementation', href: '#section-product' },
  { label: 'Services', href: '#section-services' },
  { label: 'Results', href: '#section-results' },
  { label: 'Process', href: '#section-process' },
  { label: 'Contact', href: '#section-contact' },
]

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer-inner">
        <div>
          <p className="footer-line">
            Code <span className="amp">&amp;</span> Clarity — engineers who consult. New York.
          </p>
          <span className="footer-subline">
            AI implementation, strategy, audits, governance, and training.
          </span>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={e => {
                e.preventDefault()
                document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {l.label}
            </a>
          ))}
          <a href="/accessibility">Accessibility</a>
        </nav>
      </div>
    </footer>
  )
}
