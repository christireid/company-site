import React, { useEffect, useRef } from 'react'

/* One restrained entrance, used everywhere: IntersectionObserver adds
   .is-visible; the transition lives in CSS, where prefers-reduced-motion
   collapses it to the final static state. No animation library needed. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
}: {
  children: React.ReactNode
  delay?: number
  as?: 'div' | 'section' | 'header' | 'figure'
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const T = Tag as React.ElementType
  return (
    <T
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}s` } : style}
    >
      {children}
    </T>
  )
}

export function SectionHeader({
  kicker,
  title,
  em,
  lead,
}: {
  kicker: string
  title: string
  em?: string
  lead?: string
}) {
  return (
    <Reveal as="header" className="section-header">
      <span className="kicker">{kicker}</span>
      <h2 className="section-title">
        {title}
        {em && (
          <>
            <br />
            <em>{em}</em>
          </>
        )}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </Reveal>
  )
}

export function scrollToId(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}
