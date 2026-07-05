// Full Lexma logo, background-free, with near-black text recolored to cream
// for use on dark backgrounds. The camera lens (also dark) is protected.
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const SRC = 'public/brand/lexma-photography-logo.png'; // already transparent
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// find lens center: centroid of dark opaque pixels in the UPPER half (text is lower)
let sx = 0, sy = 0, n = 0;
for (let y = 0; y < Math.floor(height * 0.55); y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    if (data[i + 3] > 200) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < 70) { sx += x; sy += y; n++; }
    }
  }
}
const cx = sx / n, cy = sy / n;
const protectR = width * 0.09; // generous circle around the lens glass
console.log('lens at', Math.round(cx), Math.round(cy), 'protect r', Math.round(protectR));

// recolor dark neutral pixels (the black text) to cream, outside the lens
const CREAM = [245, 239, 230];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const a = data[i + 3];
    if (a === 0) continue;
    const dx = x - cx, dy = y - cy;
    if (dx * dx + dy * dy < protectR * protectR) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const neutralish = Math.abs(r - g) < 34 && Math.abs(g - b) < 34;
    if (lum < 110 && neutralish) {
      // blend toward cream by darkness (keeps antialiased edges smooth)
      const k = 1 - lum / 110;
      data[i] = Math.round(r + (CREAM[0] - r) * Math.max(0.75, k));
      data[i + 1] = Math.round(g + (CREAM[1] - g) * Math.max(0.75, k));
      data[i + 2] = Math.round(b + (CREAM[2] - b) * Math.max(0.75, k));
    }
  }
}

const png = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const trimmed = await sharp(png).trim({ threshold: 8 }).png().toBuffer();
await writeFile('public/brand/lexma-logo-dark.png', trimmed);
const m = await sharp(trimmed).metadata();
console.log(`lexma-logo-dark.png ${m.width}x${m.height}`);

// also produce a trimmed version of the original (for light backgrounds)
const orig = await sharp(SRC).trim({ threshold: 8 }).png().toBuffer();
await writeFile('public/brand/lexma-logo-full.png', orig);
const m2 = await sharp(orig).metadata();
console.log(`lexma-logo-full.png ${m2.width}x${m2.height}`);
