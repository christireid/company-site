import { chromium } from 'playwright-core'
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const B='http://localhost:4173'
const browser = await chromium.launch({ executablePath: EXE, args:['--no-sandbox','--force-color-profile=srgb'] })

// ---------- crisp stills (reduced motion = clean final state) ----------
async function stills() {
  const ctx = await browser.newContext({ viewport:{width:1360,height:900}, deviceScaleFactor:2, reducedMotion:'reduce' })
  const p = await ctx.newPage()
  await p.goto(B, { waitUntil:'networkidle' })
  await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}})
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(400)
  const shots = {
    'hero': '#section-hero', 'services':'#section-services', 'product':'#section-product',
    'transform':'#section-transform', 'contrast':'#section-contrast', 'about':'#section-about', 'contact':'#section-contact'
  }
  for (const [name,sel] of Object.entries(shots)) {
    const el = p.locator(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200)
    await el.screenshot({ path:`docs/assets/section-${name}.png` })
  }
  await ctx.close()
  // mobile hero
  const m = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, reducedMotion:'reduce' })
  const mp = await m.newPage(); await mp.goto(B,{waitUntil:'networkidle'}); await mp.waitForTimeout(400)
  await mp.screenshot({ path:'docs/assets/mobile-hero.png' })
  await m.close()
  console.log('stills done')
}

// ---------- gif frames ----------
async function loopFrames(sel, dir, W, H, secs, fps) {
  const ctx = await browser.newContext({ viewport:{width:W,height:H}, deviceScaleFactor:2, reducedMotion:'no-preference' })
  const p = await ctx.newPage(); await p.goto(B,{waitUntil:'networkidle'})
  await p.evaluate(async()=>{for(let y=0;y<=document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,25))}})
  const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600)
  const n = Math.round(secs*fps), iv = 1000/fps
  for (let i=0;i<n;i++){ await el.screenshot({ path:`/tmp/frames/${dir}/f${String(i).padStart(3,'0')}.png` }); await p.waitForTimeout(iv) }
  await ctx.close(); console.log(dir,'frames:',n)
}

async function scrollFrames(secs, fps) {
  const ctx = await browser.newContext({ viewport:{width:1200,height:750}, deviceScaleFactor:1, reducedMotion:'no-preference' })
  const p = await ctx.newPage(); await p.goto(B,{waitUntil:'networkidle'}); await p.waitForTimeout(500)
  const max = await p.evaluate(()=>document.body.scrollHeight-window.innerHeight)
  const n = Math.round(secs*fps)
  for (let i=0;i<n;i++){ const y=Math.round(max*(i/(n-1))); await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(1000/fps); await p.screenshot({ path:`/tmp/frames/scroll/f${String(i).padStart(3,'0')}.png` }) }
  await ctx.close(); console.log('scroll frames:',n)
}

await stills()
await loopFrames('.loop-svg-wrap', 'loop', 460, 520, 3.6, 16)
await loopFrames('.wws', 'wws', 680, 380, 3.6, 16)
await scrollFrames(7, 12)
await browser.close()
