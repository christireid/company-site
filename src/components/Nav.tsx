import React, { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Services', href: '#section-services' },
    { label: 'AI Implementation', href: '#section-product' },
    { label: 'Process', href: '#section-process' },
  ]

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-logo" aria-label="Code & Clarity home">
          <span className="nav-logo-mark">✦</span>
          <span className="nav-logo-text">Code <span className="nav-logo-amp">&amp;</span> Clarity</span>
        </a>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <a key={l.label} href={l.href}
              className="nav-link"
              onClick={e => { e.preventDefault(); scrollTo(l.href) }}
            >{l.label}</a>
          ))}
          <a href="#section-contact"
            className="nav-cta"
            onClick={e => { e.preventDefault(); scrollTo('#section-contact') }}
          >
            Let's talk
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
