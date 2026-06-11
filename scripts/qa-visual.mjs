/* QA visual pass — drives the preview server with the preinstalled Chromium.
   Usage: node scripts/qa-visual.mjs */
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE = 'http://localhost:4173'
const OUT = 'qa-shots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const errors = []

async function shoot(name, { width, height, reducedMotion = 'no-preference', path = '/' }) {
  const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion })
  const page = await ctx.newPage()
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${name}] ${m.text()}`) })
  page.on('pageerror', e => errors.push(`[${name}] pageerror: ${e.message}`))
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  // force lazy sections to mount
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  const result = { name }

  if (name === 'home-desktop') {
    // keyboard pass: tab through first 12 focusables, record focus visibility
    const order = []
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab')
      order.push(await page.evaluate(() => {
        const el = document.activeElement
        return el ? `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}:${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 36)}` : 'none'
      }))
    }
    result.tabOrder = order
    // copy fidelity sample
    result.h1 = await page.locator('h1').first().textContent()
    result.title = await page.title()
  }
  await ctx.close()
  return result
}

const results = []
results.push(await shoot('home-desktop', { width: 1440, height: 900 }))
results.push(await shoot('home-tablet', { width: 834, height: 1100, reducedMotion: 'reduce' }))
results.push(await shoot('home-mobile', { width: 390, height: 844, reducedMotion: 'reduce' }))
results.push(await shoot('home-desktop-reduced-motion', { width: 1440, height: 900, reducedMotion: 'reduce' }))
results.push(await shoot('accessibility', { width: 1440, height: 900, path: '/accessibility' }))
results.push(await shoot('specimen', { width: 1440, height: 900, path: '/dev/specimen' }))

console.log(JSON.stringify({ results, consoleErrors: errors }, null, 2))
await browser.close()
