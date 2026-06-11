import React, { useEffect, useState } from 'react'

/* Order matches the page's scroll order so the scrollspy highlight
   travels left to right. */
const LINKS = [
  { label: 'Services', href: '#section-services' },
  { label: 'Approach', href: '#section-product' },
  { label: 'Process', href: '#section-process' },
  { label: 'FAQ', href: '#section-faq' },
  { label: 'About', href: '#section-about' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scrollspy: mark the nav link of the section currently in the
  // reading band, so a 13-section page always shows where you are.
  useEffect(() => {
    const sections = LINKS
      .map(l => document.querySelector(l.href))
      .filter((el): el is Element => el !== null)
    if (!sections.length) return
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId('#' + entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
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
            <a
              key={l.label}
              href={l.href}
              className={`nav-link ${activeId === l.href ? 'active' : ''}`}
              aria-current={activeId === l.href ? 'true' : undefined}
              onClick={scrollTo(l.href)}
            >
              {l.label}
            </a>
          ))}
          <a href="#section-contact" className="nav-cta" onClick={scrollTo('#section-contact')}>
            Book a diagnostic
          </a>
        </div>

        {/* Compact CTA that stays visible on phones, where the full nav
            collapses behind the burger — the page's only persistent CTA. */}
        <a href="#section-contact" className="nav-cta nav-cta--bar" onClick={scrollTo('#section-contact')}>
          Book a diagnostic
        </a>

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
