import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const dir = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox', '--force-color-profile=srgb'] })
for (const [scale, name] of [[2, 'linkedin-banner-personal.png'], [1, 'linkedin-banner-personal-1x.png']]) {
  const ctx = await browser.newContext({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: scale })
  const page = await ctx.newPage()
  await page.goto('file://' + path.join(dir, 'linkedin-banner-personal.html'))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  await page.screenshot({ path: path.join(dir, '..', 'assets', name) })
  await ctx.close()
  console.log('wrote assets/' + name)
}
await browser.close()
