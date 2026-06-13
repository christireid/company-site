import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })

// MOTION ON: capture the where-we-sit diagram at two moments
const ctx = await browser.newContext({ viewport: { width: 1000, height: 900 }, reducedMotion: 'no-preference' })
const p = await ctx.newPage()
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await p.evaluate(async () => { for (let y=0;y<=document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30))} })
await p.locator('.wws').scrollIntoViewIfNeeded(); await p.waitForTimeout(600)
await p.locator('.wws').screenshot({ path: 'qa-shots/motion-wws-a.png' })
await p.waitForTimeout(1500)
await p.locator('.wws').screenshot({ path: 'qa-shots/motion-wws-b.png' })
await p.locator('.loop-svg-wrap').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(700)
await p.locator('.loop-svg-wrap').first().screenshot({ path: 'qa-shots/motion-loop.png' })
// console errors?
const errs = []
p.on('console', m => m.type()==='error' && errs.push(m.text()))
await p.waitForTimeout(300)
await ctx.close()

// MOTION OFF: prove collapse to static
const ctx2 = await browser.newContext({ viewport: { width: 1000, height: 900 }, reducedMotion: 'reduce' })
const p2 = await ctx2.newPage()
await p2.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await p2.evaluate(async () => { for (let y=0;y<=document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30))} })
await p2.locator('.wws').scrollIntoViewIfNeeded(); await p2.waitForTimeout(500)
await p2.locator('.wws').screenshot({ path: 'qa-shots/motion-wws-reduced.png' })
// is any flow dot visible under reduced motion? (should be 0 painted)
const flowVisible = await p2.evaluate(() => {
  const paths = [...document.querySelectorAll('.loop-flow')]
  return paths.map(p => getComputedStyle(p).stroke).filter(s => s !== 'none' && !s.includes('none')).length
})
console.log('flow paths painted under reduced-motion:', flowVisible, '(want 0)')
await ctx2.close()
console.log('console errors:', errs.length ? errs : 'none')
await browser.close()
