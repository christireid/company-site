import React from 'react'
import { Reveal } from './shared'

export default function ManifestoBreak() {
  return (
    <section id="section-manifesto" className="section section--deep" aria-label="Why we exist">
      <div className="section-content">
        <Reveal>
          <span className="kicker">Why we exist</span>
        </Reveal>
        <Reveal delay={0.08}>
          <blockquote className="manifesto-quote" style={{ marginTop: '1.6rem' }}>
            We started Code &amp; Clarity because AI consulting was built backwards: strategy
            people who never deployed anything, advising engineering teams on deployment.
            We&rsquo;re <em>engineers who consult</em> — not consultants who learned about
            engineering. We name trade-offs out loud, we only recommend what we could build
            ourselves, and we&rsquo;d rather lose an engagement by being honest about fit than
            win one with a deck.
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
