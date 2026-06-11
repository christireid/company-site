import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })

for (const width of [320, 360, 390, 430]) {
  const ctx = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } })
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth
    const bad = []
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && (r.right > docW + 1 || r.left < -1)) {
        bad.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} w=${Math.round(r.width)} right=${Math.round(r.right)}`)
      }
    }
    return { scrollW: document.documentElement.scrollWidth, docW, bad: [...new Set(bad)].slice(0, 8) }
  })
  console.log(`-- ${width}px: scrollWidth=${overflow.scrollW} clientWidth=${overflow.docW} ${overflow.scrollW > overflow.docW ? 'OVERFLOW!' : 'ok'}`)
  if (overflow.bad.length) console.log('   offenders:', overflow.bad.join(' | '))

  if (width === 390) {
    // tap target audit
    const small = await page.evaluate(() => {
      const out = []
      for (const el of document.querySelectorAll('a, button, summary, [role="button"]')) {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && (r.height < 24 || r.width < 24)) {
          out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0] || el.className.baseVal?.split(' ')[0] || ''} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.textContent || '').trim().slice(0, 24)}"`)
        }
      }
      return [...new Set(out)]
    })
    console.log('   tap targets <24px:', small.length ? small.join(' | ') : 'none')
    // rendered SVG text sizes
    const svgText = await page.evaluate(() => {
      const out = []
      for (const t of document.querySelectorAll('svg text')) {
        const r = t.getBoundingClientRect()
        out.push(`${t.getAttribute('class')}: ${(r.height).toFixed(1)}px tall`)
      }
      return [...new Set(out)].slice(0, 12)
    })
    console.log('   svg text rendered:', svgText.join(' | '))
    // close-ups
    await page.locator('.wws').scrollIntoViewIfNeeded(); await page.waitForTimeout(200)
    await page.locator('.wws').screenshot({ path: 'qa-shots/mob-wws.png' })
    await page.locator('.arch-stack').scrollIntoViewIfNeeded(); await page.waitForTimeout(200)
    await page.locator('.arch-stack').screenshot({ path: 'qa-shots/mob-arch.png' })
    await page.locator('.loop-svg-wrap').scrollIntoViewIfNeeded(); await page.waitForTimeout(200)
    await page.locator('.loop-svg-wrap').screenshot({ path: 'qa-shots/mob-loop.png' })
    await page.locator('#section-about').scrollIntoViewIfNeeded(); await page.waitForTimeout(200)
    await page.locator('#section-about').screenshot({ path: 'qa-shots/mob-about.png' })
  }
  await ctx.close()
}
await browser.close()
