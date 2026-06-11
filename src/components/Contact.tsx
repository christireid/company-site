import React, { useState } from 'react'
import { Reveal } from './shared'

const INTERESTS = [
  'AI Implementation Strategy',
  'AI Audits & Governance',
  'AI Training & Capability',
  "Not sure yet — that's what the diagnostic is for",
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', interest: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <section id="section-contact" className="section" aria-label="Contact">
      <div className="section-content">
        <div className="contact-grid">
          <Reveal>
            <span className="kicker">Get in touch</span>
            <h2 className="section-title">
              A conversation,
              <br />
              <em>not a sales process.</em>
            </h2>
            <p className="contact-intro">
              Tell us what you&rsquo;re trying to solve. We&rsquo;ll respond within one business
              day with a straight read — including &ldquo;you don&rsquo;t need us for this&rdquo;
              when that&rsquo;s the truth.
            </p>

            <div className="contact-chips">
              <span className="contact-chip">
                <span className="status-dot" aria-hidden="true" />
                Accepting new engagements — limited capacity
              </span>
              <span className="contact-chip">Response within one business day</span>
            </div>

            <div className="contact-stats">
              <div>
                <span className="contact-stat-val">1 business day</span>
                <span className="contact-stat-label">First response</span>
              </div>
              <div>
                <span className="contact-stat-val">In writing</span>
                <span className="contact-stat-label">Scope &amp; pricing before work begins</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {submitted ? (
              <div className="contact-success" role="status">
                <h3>Message received.</h3>
                <p>
                  We&rsquo;ll respond within one business day. Expect directness, not a sales
                  sequence — and if we&rsquo;re the wrong fit, we&rsquo;ll tell you who to call
                  instead.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <p className="form-kicker">The 45-minute diagnostic starts here.</p>
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
                  Organization
                  <input
                    className="form-input"
                    type="text"
                    value={form.org}
                    onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                    placeholder="Company or project (optional)"
                  />
                </label>

                <div className="form-label" role="group" aria-label="What are you exploring?">
                  What are you exploring?
                  <div className="interest-grid">
                    {INTERESTS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        className={`interest-btn ${form.interest === opt ? 'active' : ''}`}
                        aria-pressed={form.interest === opt}
                        onClick={() => setForm(f => ({ ...f, interest: opt }))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

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
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn--primary" disabled={loading} aria-disabled={loading}>
                  {loading ? 'Sending…' : 'Send message →'}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
