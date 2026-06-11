import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = await ctx.newPage()
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await page.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } })
await page.waitForTimeout(600)
const ids = ['section-hero','section-manifesto','section-services','section-product','section-results','section-transform','section-contrast','section-process','section-faq','section-contact']
for (const id of ids) {
  const el = page.locator('#' + id)
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(150)
  await el.screenshot({ path: `qa-shots/sec-${id}.png` })
}
await browser.close()
console.log('done')
