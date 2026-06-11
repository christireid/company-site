/* Renders OG card (public/og.png), 32px favicon (public/favicon-32.png),
   and re-renders the LinkedIn cover. */
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const dir = path.dirname(fileURLToPath(import.meta.url))
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
})

async function render(htmlFile, width, height, scale, out) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale })
  const page = await ctx.newPage()
  await page.goto('file://' + path.join(dir, htmlFile))
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(200)
  await page.screenshot({ path: path.join(dir, '..', out) })
  await ctx.close()
  console.log('wrote', out)
}

await render('og-image.html', 1200, 630, 1, 'public/og.png')
await render('linkedin-cover.html', 1128, 191, 2, 'assets/linkedin-cover.png')
await render('linkedin-cover.html', 1128, 191, 1, 'assets/linkedin-cover-1x.png')

// favicon: render the SVG at exactly 32x32
const ctx = await browser.newContext({ viewport: { width: 32, height: 32 } })
const page = await ctx.newPage()
await page.setContent(`<body style="margin:0"><img src="file://${path.join(dir, '..', 'public', 'favicon.svg')}" width="32" height="32" style="display:block"></body>`)
await page.waitForTimeout(300)
await page.screenshot({ path: path.join(dir, '..', 'public', 'favicon-32.png') })
await ctx.close()
console.log('wrote public/favicon-32.png')
await browser.close()
