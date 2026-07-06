// Auto-segment the 12-pose avatar sheet via connected components
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';

const SRC = 'B:/MAIRA-website/Gemini_Generated_Image_fr8m9qfr8m9qfr8m.png';
const OUT = 'public/avatar';
await mkdir(OUT, { recursive: true });

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// key out baked checkerboard: neutral grays 150..232
for (let i = 0; i < data.length; i += channels) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (Math.abs(r - g) < 12 && Math.abs(g - b) < 12 && Math.abs(r - b) < 12) {
    const lum = (r + g + b) / 3;
    if (lum > 150 && lum < 232) data[i + 3] = 0;
  }
}

// connected components on alpha mask (4.3M px — use Int32 labels + BFS)
const mask = new Uint8Array(width * height);
for (let p = 0, i = 3; p < mask.length; p++, i += channels) mask[p] = data[i] > 40 ? 1 : 0;

const labels = new Int32Array(width * height);
let nextLabel = 0;
const comps = [];
const qx = new Int32Array(width * height);

for (let p = 0; p < mask.length; p++) {
  if (!mask[p] || labels[p]) continue;
  nextLabel++;
  let head = 0, tail = 0;
  qx[tail++] = p;
  labels[p] = nextLabel;
  let minX = width, maxX = 0, minY = height, maxY = 0, area = 0;
  while (head < tail) {
    const cur = qx[head++];
    const cy = (cur / width) | 0;
    const cx = cur - cy * width;
    area++;
    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;
    // 8-neighborhood with radius 2 to bridge tiny anti-alias gaps
    for (let dy = -2; dy <= 2; dy++) {
      const ny = cy + dy;
      if (ny < 0 || ny >= height) continue;
      for (let dx = -2; dx <= 2; dx++) {
        const nx = cx + dx;
        if (nx < 0 || nx >= width) continue;
        const np = ny * width + nx;
        if (mask[np] && !labels[np]) {
          labels[np] = nextLabel;
          qx[tail++] = np;
        }
      }
    }
  }
  comps.push({ label: nextLabel, minX, maxX, minY, maxY, area });
}

// characters: big & tall components
const big = comps.filter((c) => c.area > 15000 && c.maxY - c.minY > 250);
// generic row clustering: group by vertical center, tolerance = 40% of tallest char
const tallest = Math.max(...big.map((c) => c.maxY - c.minY));
const tol = tallest * 0.4;
big.sort((a, b) => (a.minY + a.maxY) / 2 - (b.minY + b.maxY) / 2);
const rows = [];
for (const c of big) {
  const cy = (c.minY + c.maxY) / 2;
  const row = rows.find((r) => Math.abs(r.cy - cy) < tol);
  if (row) {
    row.items.push(c);
    row.cy = row.items.reduce((s, i) => s + (i.minY + i.maxY) / 2, 0) / row.items.length;
  } else {
    rows.push({ cy, items: [c] });
  }
}
rows.sort((a, b) => a.cy - b.cy);
const chars = rows.flatMap((r) => r.items.sort((a, b) => a.minX - b.minX));

console.log('components total:', comps.length, 'characters:', chars.length);

let n = 0;
const meta = [];
for (const c of chars) {
  n++;
  const rw = c.maxX - c.minX + 1;
  const rh = c.maxY - c.minY + 1;
  const slice = Buffer.alloc(rw * rh * 4);
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      const sp = (c.minY + y) * width + (c.minX + x);
      const so = sp * channels;
      const do_ = (y * rw + x) * 4;
      // only pixels belonging to THIS component (drops overlapping neighbors)
      if (labels[sp] === c.label) {
        slice[do_] = data[so];
        slice[do_ + 1] = data[so + 1];
        slice[do_ + 2] = data[so + 2];
        slice[do_ + 3] = data[so + 3];
      }
    }
  }
  const png = await sharp(slice, { raw: { width: rw, height: rh, channels: 4 } })
    .png()
    .toBuffer();
  const name = `${OUT}/pose-${String(n).padStart(2, '0')}.png`;
  await writeFile(name, png);
  meta.push({ pose: n, w: rw, h: rh, y: c.minY, x: c.minX });
}
console.log(JSON.stringify(meta));
