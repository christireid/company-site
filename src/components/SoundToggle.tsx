import React, { useState } from 'react'

export default function SoundToggle() {
  const [on, setOn] = useState(false)
  return (
    <button
      className={`sound-toggle ${on ? 'active' : ''}`}
      onClick={() => setOn(v => !v)}
      aria-label="Toggle ambient sound"
    >
      <span className="sound-icon">◉</span>
      <span className="sound-label">{on ? 'SOUND ON' : 'SOUND OFF'}</span>
    </button>
  )
}
