// Extract circular badge logo: flood-fill removes outer black bg,
// gold ring acts as natural barrier so the badge interior stays intact.
import sharp from 'sharp';
import { writeFile, rename } from 'fs/promises';

const SRC = 'C:/Users/Hassaan Ali/Downloads/WhatsApp Image 2026-07-12 at 6.36.51 AM.jpeg';

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const idx = (x, y) => (y * width + x) * channels;

// Gold/warm pixel = the ring boundary (stop flood-fill here)
const isGold = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return r > 100 && r > b + 35 && (r - Math.min(r, g, b)) > 45;
};

// Dark pixel = candidate background (flood-fill consumes these)
const isDark = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum < 55 && !isGold(i);
};

// BFS from all 4 borders — removes outer black bg, stops at gold ring
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height * 2);
let head = 0, tail = 0;

const seed = (x, y) => {
  const p = y * width + x;
  if (!visited[p] && isDark(idx(x, y))) { visited[p] = 1; queue[tail++] = x; queue[tail++] = y; }
};

for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

while (head < tail) {
  const x = queue[head++], y = queue[head++];
  for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    const np = ny * width + nx;
    if (visited[np]) continue;
    if (!isDark(idx(nx, ny))) continue; // hit gold ring → stop
    visited[np] = 1;
    queue[tail++] = nx;
    queue[tail++] = ny;
  }
}

// Make all flood-filled (outer bg) pixels transparent
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (visited[y * width + x]) data[idx(x, y) + 3] = 0;
  }
}

// Trim and export as compressed PNG
const raw = await sharp(data, { raw: { width, height, channels } })
  .trim({ threshold: 5 })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

// Verification composite on black canvas
const { width: tw, height: th } = await sharp(raw).metadata();
const check = await sharp({ create: { width: tw + 80, height: th + 80, channels: 4, background: { r:10,g:10,b:10,alpha:1 } } })
  .composite([{ input: raw, left: 40, top: 40 }])
  .png()
  .toBuffer();
await writeFile('scripts/_check-circle.png', check);

// Write to brand folder
await writeFile('public/brand/lexma-logo-dark.png.tmp', raw);
await rename('public/brand/lexma-logo-dark.png.tmp', 'public/brand/lexma-logo-dark.png');
// Also update full and photography variants
await writeFile('public/brand/lexma-logo-full.png.tmp', raw);
await rename('public/brand/lexma-logo-full.png.tmp', 'public/brand/lexma-logo-full.png');
await writeFile('public/brand/lexma-photography-logo.png.tmp', raw);
await rename('public/brand/lexma-photography-logo.png.tmp', 'public/brand/lexma-photography-logo.png');

console.log(`done: ${tw}x${th}, ${Math.round(raw.length/1024)}KB`);
