import sharp from 'sharp'
import pkg from 'gifenc'; const { GIFEncoder, quantize, applyPalette } = pkg
import fs from 'node:fs'

async function build(dir, fps, width, out) {
  const files = fs.readdirSync(`/tmp/frames/${dir}`).filter(f=>f.endsWith('.png')).sort()
  const gif = GIFEncoder()
  const delay = Math.round(1000/fps)
  let W=0,H=0
  for (const f of files) {
    const { data, info } = await sharp(`/tmp/frames/${dir}/${f}`)
      .resize({ width, fit:'inside' }).ensureAlpha().raw().toBuffer({ resolveWithObject:true })
    W=info.width; H=info.height
    const palette = quantize(data, 256, { format:'rgba4444' })
    const index = applyPalette(data, palette, 'rgba4444')
    gif.writeFrame(index, W, H, { palette, delay })
  }
  gif.finish()
  fs.writeFileSync(`docs/assets/${out}`, Buffer.from(gif.bytes()))
  const kb = (fs.statSync(`docs/assets/${out}`).size/1024).toFixed(0)
  console.log(`${out}  ${W}x${H}  ${files.length}f  ${kb}KB`)
}

await build('loop', 16, 380, 'loop-diagram.gif')
await build('wws', 16, 620, 'where-we-sit.gif')
await build('scroll', 12, 820, 'scroll-through.gif')
