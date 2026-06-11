import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Nav />
      <main id="main" className="prose-page">
        <span className="kicker">Privacy</span>
        <h1>Privacy policy</h1>
        <p className="prose-meta">Last reviewed: June 2026</p>

        <p>
          This site is built the way we advise our clients to build: collect the minimum,
          state plainly what happens to it, and add nothing that watches people.
        </p>

        <h2>What we collect</h2>
        <p>
          Only what you type into the contact form: your name, email address, optionally an
          organization name, which practice you&rsquo;re exploring, and your message. We collect
          nothing else, and nothing automatically.
        </p>

        <h2>What happens to it</h2>
        <p>
          Your message is delivered to us by email through Resend, our email delivery
          processor. The site itself keeps no database and stores no copy of your message.
          The correspondence lives in our inbox, like any email, for as long as the
          conversation is useful.
        </p>

        <h2>What we don&rsquo;t do</h2>
        <ul>
          <li>No analytics, no tracking pixels, no advertising scripts.</li>
          <li>No cookies set by this site.</li>
          <li>No selling, renting, or sharing of your information with anyone.</li>
          <li>No marketing list — writing to us subscribes you to nothing.</li>
        </ul>

        <h2>Hosting</h2>
        <p>
          The site is served by Vercel, which, like any hosting provider, may process
          standard server logs (such as IP addresses) to deliver and secure the service.
        </p>

        <h2>Your choices</h2>
        <p>
          To have your correspondence deleted, or to ask anything about this policy,
          email <a href="mailto:hello@codeclarity.ai">hello@codeclarity.ai</a>. We respond
          within one business day.
        </p>
      </main>
      <Footer />
    </>
  )
}
