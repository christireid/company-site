import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const dir = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--force-color-profile=srgb'] })
for (const c of ['a','b','c']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
  const p = await ctx.newPage()
  await p.goto('file://' + path.join(dir, 'comps', `comp-${c}.html`))
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(dir, '..', 'qa-shots', `comp-${c}.png`), fullPage: true })
  await ctx.close()
  console.log('rendered comp-' + c)
}
await browser.close()
