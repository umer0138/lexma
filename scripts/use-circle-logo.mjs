// Replace lexma-logo-badge.png with the client's full circular badge logo
// (two complete concentric gold rings, black circle, REAL ESTATE PHOTOGRAPHY).
// Flood-fill the outer near-black background to transparent (stops at the
// outer gold ring), keep everything inside intact, trim, save PNG.
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const SRC = 'C:/Users/Hassaan Ali/Downloads/WhatsApp Image 2026-07-13 at 12.21.19 AM.jpeg';

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const isDarkBg = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return (r + g + b) / 3 < 40 && Math.max(r, g, b) - Math.min(r, g, b) < 25;
};

const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let tail = 0;

for (let x = 0; x < width; x++) {
  for (const y of [0, height - 1]) {
    const p = y * width + x;
    if (isDarkBg(p * channels) && !visited[p]) { visited[p] = 1; queue[tail++] = p; }
  }
}
for (let y = 0; y < height; y++) {
  for (const x of [0, width - 1]) {
    const p = y * width + x;
    if (isDarkBg(p * channels) && !visited[p]) { visited[p] = 1; queue[tail++] = p; }
  }
}

let head = 0;
while (head < tail) {
  const p = queue[head++];
  const py = (p / width) | 0;
  const px = p - py * width;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const np = ny * width + nx;
      if (visited[np] || !isDarkBg(np * channels)) continue;
      visited[np] = 1;
      queue[tail++] = np;
    }
  }
}

for (let p = 0; p < width * height; p++) {
  if (visited[p]) data[p * channels + 3] = 0;
}

const png = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const trimmed = await sharp(png)
  .trim({ threshold: 10 })
  .resize({ width: 800, withoutEnlargement: true })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

await writeFile('public/brand/lexma-logo-badge.png', trimmed);

// verification composite on the site's dark background
const meta = await sharp(trimmed).metadata();
const comp = await sharp({
  create: { width: meta.width + 80, height: meta.height + 80, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } },
})
  .composite([{ input: trimmed, left: 40, top: 40 }])
  .png()
  .toBuffer();
await writeFile('scripts/_check-badge.png', comp);
console.log(`done: ${meta.width}x${meta.height}, ${Math.round(trimmed.length / 1024)} KB`);
