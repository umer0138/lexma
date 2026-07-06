// Key + crop walk-cycle frames from the avatar video stills
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';

const IN = 'C:/Users/HASSAA~1/AppData/Local/Temp/claude/B--Web-ide-petrinets/70dff546-dc3f-42d1-880a-9a9a0955c7f2/scratchpad/lexwalk2';
const OUT = 'public/avatar/walk';
await mkdir(OUT, { recursive: true });

// one stride ≈ 1s = 8 frames; take frames 24..31 (character mid-screen)
const FRAMES = [24, 25, 26, 27, 28, 29, 30, 31];

let n = 0;
const meta = [];
for (const f of FRAMES) {
  const src = `${IN}/w${String(f).padStart(2, '0')}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // key: neutral pixels (bg is flat gray incl. soft vignette)
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && Math.abs(r - b) < 14) {
      const lum = (r + g + b) / 3;
      if (lum > 120) data[i + 3] = 0;
    }
  }

  // largest component bbox (grid BFS radius 2)
  const mask = new Uint8Array(width * height);
  for (let p = 0, i = 3; p < mask.length; p++, i += channels) mask[p] = data[i] > 40 ? 1 : 0;
  const labels = new Int32Array(width * height);
  const q = new Int32Array(width * height);
  let best = null;
  let lab = 0;
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p] || labels[p]) continue;
    lab++;
    let head = 0, tail = 0;
    q[tail++] = p;
    labels[p] = lab;
    let minX = width, maxX = 0, minY = height, maxY = 0, area = 0;
    while (head < tail) {
      const cur = q[head++];
      const cy = (cur / width) | 0;
      const cx = cur - cy * width;
      area++;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;
      for (let dy = -2; dy <= 2; dy++) {
        const ny = cy + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const nx = cx + dx;
          if (nx < 0 || nx >= width) continue;
          const np = ny * width + nx;
          if (mask[np] && !labels[np]) {
            labels[np] = lab;
            q[tail++] = np;
          }
        }
      }
    }
    if (!best || area > best.area) best = { lab, minX, maxX, minY, maxY, area };
  }

  const rw = best.maxX - best.minX + 1;
  const rh = best.maxY - best.minY + 1;
  const slice = Buffer.alloc(rw * rh * 4);
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      const sp = (best.minY + y) * width + (best.minX + x);
      if (labels[sp] === best.lab) {
        const so = sp * channels;
        const do_ = (y * rw + x) * 4;
        slice[do_] = data[so];
        slice[do_ + 1] = data[so + 1];
        slice[do_ + 2] = data[so + 2];
        slice[do_ + 3] = data[so + 3];
      }
    }
  }
  n++;
  const buf = await sharp(slice, { raw: { width: rw, height: rh, channels: 4 } })
    .resize({ height: 480, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await writeFile(`${OUT}/walk-${String(n).padStart(2, '0')}.webp`, buf);
  meta.push({ n, srcFrame: f, w: rw, h: rh, area: best.area });
}
console.log(JSON.stringify(meta));
