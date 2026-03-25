import { useEffect } from 'react'

/* ─────────────────────────────────────────────────────────────────
   GlobalEffects v4 - Simplified
   Consolidated animation logic with proper throttling and cleanup
   1. Magnetic pull on buttons
   2. Scroll-triggered reveal
   3. Counter tick
   4. Stagger children
───────────────────────────────────────────────────────────────── */

export default function GlobalEffects() {
  useEffect(() => {
    // ── 1. MAGNETIC BUTTONS ──────────────────────────────────────
    function initMagnetic(btn: HTMLElement) {
      let raf = 0, bx = 0, by = 0
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const r = btn.getBoundingClientRect()
        bx = (e.clientX - (r.left + r.width  / 2)) * 0.28
        by = (e.clientY - (r.top  + r.height / 2)) * 0.28
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => { btn.style.transform = `translate(${bx}px,${by}px)` })
      })
      btn.addEventListener('mouseleave', () => { bx = 0; by = 0; btn.style.transform = '' })
    }
    document.querySelectorAll<HTMLElement>('.mag-btn, .hero-cta-primary').forEach(el => {
      if (!el.dataset.magInit) { el.dataset.magInit = '1'; initMagnetic(el) }
    })

    // ── 3. SCROLL REVEAL ─────────────────────────────────────────
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        ;(e.target as HTMLElement).classList.add('is-visible')
        io.unobserve(e.target)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })

    document.querySelectorAll(
      '.anim-fade-up, .slide-up, .reveal-on-scroll, .section-title-wrap, ' +
      '.prism-divider, .process-connector, .process-connector-line, ' +
      '.manifesto-word, .manifesto-rule, .contrast-item'
    ).forEach(el => io.observe(el))

    // ── 4. COUNTER TICK ──────────────────────────────────────────
    function animateCounter(el: HTMLElement) {
      const target = parseFloat(el.dataset.counter || '0')
      const suffix = el.dataset.suffix  || ''
      const dur    = parseInt(el.dataset.dur || '1800', 10)
      const start  = performance.now()
      const tick   = (now: number) => {
        const p     = Math.min(1, (now - start) / dur)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        const val   = target * eased
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        animateCounter(e.target as HTMLElement)
        cio.unobserve(e.target)
      })
    }, { threshold: 0.4 })
    document.querySelectorAll<HTMLElement>('[data-counter]').forEach(el => cio.observe(el))

    // ── 5. STAGGER CHILDREN ──────────────────────────────────────
    const sio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const parent = e.target as HTMLElement
        parent.querySelectorAll<HTMLElement>('[data-stagger-child]').forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * 80)
        })
        sio.unobserve(parent)
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('[data-stagger-parent]').forEach(el => sio.observe(el))

    // ── CLEANUP ──────────────────────────────────────────────────
    return () => {
      io.disconnect()
      cio.disconnect()
      sio.disconnect()
    }
  }, [])

  return null
}
