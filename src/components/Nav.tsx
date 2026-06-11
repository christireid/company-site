import React, { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Implementation', href: '#section-product' },
  { label: 'Services', href: '#section-services' },
  { label: 'Results', href: '#section-results' },
  { label: 'Process', href: '#section-process' },
  { label: 'FAQ', href: '#section-faq' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-logo" aria-label="Code & Clarity home">
          <span className="nav-logo-tick" aria-hidden="true" />
          <span className="nav-logo-text">
            Code <span className="amp">&amp;</span> Clarity
          </span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link" onClick={scrollTo(l.href)}>
              {l.label}
            </a>
          ))}
          <a href="#section-contact" className="nav-cta" onClick={scrollTo('#section-contact')}>
            Book a diagnostic
          </a>
        </div>

        <button
          className={`nav-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
