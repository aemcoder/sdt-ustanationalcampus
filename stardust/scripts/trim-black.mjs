// Trim trailing (near-)black rows from stitched captures: the live document reports a scrollHeight beyond its
// painted content on some pages, and stitch-shot fills the unreachable tail black. Usage: node trim-black.mjs <png…>
import fs from 'node:fs'; import { PNG } from 'pngjs';
for (const f of process.argv.slice(2)) {
  if (!fs.existsSync(f)) continue;
  const img = PNG.sync.read(fs.readFileSync(f)); const { width, height, data } = img;
  const dark = (y) => { let s = 0; for (let x = 0; x < width; x += 4) { const i = (y * width + x) * 4; s += data[i] + data[i + 1] + data[i + 2]; } return s / (width / 4) < 30; };
  let y = height - 1; while (y > 0 && dark(y)) y -= 1;
  const cut = height - 1 - y;
  if (cut >= 20) { const out = new PNG({ width, height: y + 1 }); data.copy(out.data, 0, 0, width * (y + 1) * 4); fs.writeFileSync(f, PNG.sync.write(out)); console.log(f, 'trimmed', cut); }
}
