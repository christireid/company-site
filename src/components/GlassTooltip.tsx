import React, { useEffect, useRef, useState } from 'react'

const sections = [
  { id: 'section-hero',      label: 'Overview' },
  { id: 'section-transform', label: 'Approach' },
  { id: 'section-services',  label: 'Services' },
  { id: 'section-process',   label: 'Process' },
  { id: 'section-about',     label: 'About' },
  { id: 'section-faq',       label: 'Questions' },
  { id: 'section-contact',   label: 'Contact' },
]

export default function GlassTooltip() {
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRef = useRef('')

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const id = e.target.id
        if (id === lastRef.current) return
        const sec = sections.find(s => s.id === id)
        if (!sec) return
        lastRef.current = id
        setLabel(sec.label)
        setVisible(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setVisible(false), 1900)
      })
    }, { threshold: 0.3 })

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <div className={`glass-tooltip ${visible ? 'visible' : ''}`}>
      {label}
    </div>
  )
}
