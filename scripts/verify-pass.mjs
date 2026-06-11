import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
// mobile nav with bar CTA at two widths
for (const w of [320, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 } })
  const p = await ctx.newPage()
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await p.screenshot({ path: `qa-shots/nav-${w}.png`, clip: { x: 0, y: 0, width: w, height: 70 } })
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  console.log(`${w}px nav overflow: ${overflow}px`)
  await ctx.close()
}
// privacy page
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
await p.goto('http://localhost:4173/privacy', { waitUntil: 'networkidle' })
await p.screenshot({ path: 'qa-shots/privacy.png' })
console.log('privacy title:', await p.locator('h1').textContent())
await browser.close()
