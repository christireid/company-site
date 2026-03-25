import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { onFrame, removeFrame, useInView } from '../hooks/useAnimation'


/* ── Availability card: pulsing status + key stats laid out clearly ── */
function AvailabilityCard() {
  return (
    <div className="availability-card">
      <div className="avail-row">
        <span className="avail-pulse" aria-hidden="true" />
        <span className="avail-status">Accepting new engagements</span>
      </div>
      <div className="avail-stats">
        {[
          { val: '< 24h', label: 'First response' },
          { val: 'Fixed', label: 'Scoped pricing' },
        ].map(s => (
          <div key={s.label} className="avail-stat">
            <span className="avail-stat-val">{s.val}</span>
            <span className="avail-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', interest: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const interests = [
    'AI Strategy & Policy',
    'Training & Capability Transfer',
    'AI Implementation / Pilot Build',
    'Not sure yet — let\'s talk',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Something went wrong. Please try again.')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="section-contact" className="section section-contact" aria-label="Contact" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="section-content" style={{ position: 'relative', zIndex: 2 }}>
        <div className="contact-layout">
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="section-eyebrow">Get in touch</div>
            <h2 className="section-title">
              A conversation,<br />
              <em className="text-prism">not a sales process.</em>
            </h2>
            <p className="contact-lede">
              Tell us what you're trying to solve. We'll tell you honestly
              whether we're the right fit — and if we're not, we'll point
              you toward who is. No deck. No proposal until you want one.
            </p>
            <p className="contact-lede" style={{ opacity: 0.72 }}>
              Not sure what you need yet? That's the best possible
              starting point. Most good engagements begin with
              'we know something needs to change, we're not sure what'.
              We respond within one business day.
            </p>

            <div className="contact-signals">
              <div className="contact-signal">
                <span className="signal-dot green" />
                <span>Accepting new engagements — limited capacity</span>
              </div>
              <div className="contact-signal">
                <span>Response within one business day</span>
              </div>
            </div>

            {/* Availability card */}
            <AvailabilityCard />
          </motion.div>

          <motion.div
            className="contact-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✦</div>
                <h3>Message received.</h3>
                <p>We'll respond within one business day. Looking forward to the conversation — expect directness, not a sales pitch.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <label className="form-label">
                    Name
                    <input
                      className="form-input"
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      placeholder="Your name"
                    />
                  </label>
                  <label className="form-label">
                    Email
                    <input
                      className="form-input"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      placeholder="you@organization.com"
                    />
                  </label>
                </div>

                <label className="form-label">
                  Organisation
                  <input
                    className="form-input"
                    type="text"
                    value={form.org}
                    onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                    placeholder="Company or project (optional)"
                  />
                </label>

                <label className="form-label">
                  What are you exploring?
                  <div className="interest-grid">
                    {interests.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        className={`interest-btn ${form.interest === opt ? 'active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, interest: opt }))}
                      >{opt}</button>
                    ))}
                  </div>
                </label>

                <label className="form-label">
                  Tell us more
                  <textarea
                    className="form-input form-textarea"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="What are you trying to solve?"
                    rows={5}
                  />
                </label>

                {error && (
                  <p style={{ color: 'hsl(0,70%,65%)', fontSize: '0.9rem', margin: '0 0 0.75rem' }} role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="hero-cta-primary form-submit" disabled={loading} aria-disabled={loading}>
                  <span className="btn-text">{loading ? 'Sending…' : 'Send message →'}</span>
                  <span className="btn-shimmer" />
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
