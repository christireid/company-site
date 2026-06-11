import React from 'react'

/* /dev/specimen — internal type & token QA page. Not linked from the site. */

const SWATCHES = [
  ['--paper', '#faf9f5'],
  ['--paper-deep', '#f3f1ea'],
  ['--ink', '#141413'],
  ['--ink-body', '#33312d'],
  ['--ink-muted', '#605c53'],
  ['--terracotta', '#c2552c'],
  ['--terracotta-ink', '#a8451f'],
  ['--gold', '#8a6415'],
  ['--gold-soft', '#e8c87f'],
  ['--slate', '#46666a'],
]

export default function Specimen() {
  return (
    <main className="prose-page" style={{ maxWidth: '56rem' }}>
      <span className="kicker">Dev — Type specimen</span>
      <h1>The Quiet Publication</h1>
      <p className="prose-meta">Token & type QA · DESIGN_DECISIONS.md</p>

      <div className="specimen-block">
        <span className="kicker">Display — Cormorant Garamond</span>
        <h1 style={{ fontSize: 'var(--size-hero)', marginTop: '1rem' }}>
          Most AI pilots die between the strategy <em style={{ color: 'var(--terracotta-ink)' }}>and the build.</em>
        </h1>
        <h2 style={{ fontSize: 'var(--size-section)', marginTop: '1.5rem' }}>Section title at clamp scale</h2>
        <h3 style={{ fontSize: 'var(--size-card)', marginTop: '1.5rem', fontStyle: 'italic', fontWeight: 500 }}>
          Card headline, italic 500
        </h3>
      </div>

      <div className="specimen-block">
        <span className="kicker">Body — Outfit</span>
        <p style={{ marginTop: '1rem' }}>
          Body text at 1.0625rem/1.7 on warm ivory. The measure is constrained to 68 characters
          so long-form reading stays comfortable. Emphasis is set in{' '}
          <strong>weight 500</strong>, links in <a href="#top">terracotta ink</a>.
        </p>
        <p className="section-lead">Lead paragraph at the lead scale, used under section titles.</p>
      </div>

      <div className="specimen-block">
        <span className="kicker">Mono — DM Mono</span>
        <p className="index-strip" style={{ marginTop: '1rem' }}>
          Kickers <span className="dot">·</span> Labels <span className="dot">·</span> Metadata{' '}
          <span className="dot">·</span> Folios <span className="dot">·</span> 0123456789
        </p>
      </div>

      <div className="specimen-block">
        <span className="kicker">Color tokens</span>
        <div className="specimen-swatches">
          {SWATCHES.map(([name, hex]) => (
            <div className="specimen-swatch" key={name}>
              <div className="sw" style={{ background: `var(${name})` }} />
              <div className="sw-label">{name}<br />{hex}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="specimen-block">
        <span className="kicker">Controls</span>
        <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', marginTop: '1.2rem', flexWrap: 'wrap' }}>
          <button className="btn btn--primary">Primary button →</button>
          <button className="btn btn--outline">Outline button</button>
          <a href="#top" className="link-quiet">Quiet link ›</a>
        </div>
      </div>

      <div className="specimen-block">
        <span className="kicker">The prism, rationed</span>
        <hr className="divider divider--prism" style={{ margin: '1.2rem 0' }} />
      </div>
    </main>
  )
}
