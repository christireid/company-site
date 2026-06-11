/* Renders the LinkedIn profile image from scripts/linkedin-avatar.html
   → assets/linkedin-avatar.png (2x, 800x800) and -1x.png (400x400). */
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const dir = path.dirname(fileURLToPath(import.meta.url))
const html = 'file://' + path.join(dir, 'linkedin-avatar.html')
fs.mkdirSync(path.join(dir, '..', 'assets'), { recursive: true })

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
})

for (const [scale, name] of [[2, 'linkedin-avatar.png'], [1, 'linkedin-avatar-1x.png']]) {
  const ctx = await browser.newContext({
    viewport: { width: 400, height: 400 },
    deviceScaleFactor: scale,
  })
  const page = await ctx.newPage()
  await page.goto(html)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  await page.screenshot({ path: path.join(dir, '..', 'assets', name) })
  await ctx.close()
  console.log('wrote assets/' + name)
}
await browser.close()
