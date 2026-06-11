import React from 'react'
import { Reveal, scrollToId } from './shared'

/* The named principal — an advisory practice sells judgment, and
   judgment needs a person a buyer can diligence. Facts here are the
   site's canonical claims assembled into a byline; refine via
   FINAL_REPORT [VERIFY] notes. */

export default function About() {
  return (
    <section id="section-about" className="section" aria-label="Who you'll work with">
      <div className="section-content">
        <div className="about-grid">
          <Reveal>
            <span className="kicker">Who you&rsquo;ll work with</span>
            <h2 className="section-title">
              Advice with
              <br />
              <em>a name on it.</em>
            </h2>
            <p className="about-body">
              Code &amp; Clarity is the practice of <strong>Christi Reid</strong> — an engineer,
              educator, and editor who spent 10+ years shipping production software, designing
              developer education, and editing technical writing before consulting on any of it.
            </p>
            <p className="about-body">
              That history is the method. The implementation strategies come from someone who
              has lived inside production systems. The training comes from someone who has
              taught working engineers. And the recommendations read clearly because, for years,
              clarity was the job.
            </p>
            <p className="about-body">
              Every engagement is principal-led. No leverage pyramid, no handoff to a junior
              team: the person in your diagnostic is the person who writes your recommendation —
              and the person accountable for it.
            </p>
            <a href="#section-contact" className="link-quiet" style={{ marginTop: '1.6rem', display: 'inline-flex' }} onClick={scrollToId('section-contact')}>
              Start with the diagnostic →
            </a>
          </Reveal>

          <Reveal delay={0.1} className="about-card-wrap">
            <figure className="about-card">
              <span className="about-monogram" aria-hidden="true">CR</span>
              <span className="about-rule" aria-hidden="true" />
              <figcaption>
                <span className="about-name">Christi Reid</span>
                <span className="about-role">Founder &amp; Principal</span>
                <span className="about-meta">New York · <a href="mailto:hello@codeclarity.ai">hello@codeclarity.ai</a></span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
