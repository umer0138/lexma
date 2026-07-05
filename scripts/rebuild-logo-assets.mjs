// Rebuild ALL Lexma logo assets with robust flood-fill background removal
// (handles the vignette/gradient background), then dark-bg text recolor.
// Filenames stay the same — no layout/animation changes needed.
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const SRC_JPG = 'B:/MAIRA-website/WhatsApp Image 2026-06-10 at 3.07.04 PM (1).jpeg';

const { data, info } = await sharp(SRC_JPG)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

/* ---- flood fill from borders: remove the light background incl. gradient --- */
const visited = new Uint8Array(width * height);
const queue = new Int32Array(width * height);
let tail = 0;

const isLightBg = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = (r + g + b) / 3;
  // warm light background: bright, low saturation
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return lum > 170 && max - min < 45;
};

// seed: all border pixels that look like background
for (let x = 0; x < width; x++) {
  for (const y of [0, height - 1]) {
    const p = y * width + x;
    if (isLightBg(p * channels) && !visited[p]) { visited[p] = 1; queue[tail++] = p; }
  }
}
for (let y = 0; y < height; y++) {
  for (const x of [0, width - 1]) {
    const p = y * width + x;
    if (isLightBg(p * channels) && !visited[p]) { visited[p] = 1; queue[tail++] = p; }
  }
}

let head = 0;
while (head < tail) {
  const p = queue[head++];
  const py = (p / width) | 0;
  const px = p - py * width;
  const pi = p * channels;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = px + dx, ny = py + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const np = ny * width + nx;
      if (visited[np]) continue;
      const ni = np * channels;
      // expand if neighbor is close in color to current bg pixel (gradient-tolerant)
      const dr = data[ni] - data[pi], dg = data[ni + 1] - data[pi + 1], db = data[ni + 2] - data[pi + 2];
      const stepDist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (stepDist < 16 && isLightBgLoose(ni)) {
        visited[np] = 1;
        queue[tail++] = np;
      }
    }
  }
}

function isLightBgLoose(i) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const lum = (r + g + b) / 3;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return lum > 140 && max - min < 55;
}

// apply: bg pixels -> alpha 0, with soft edge (neighbors of keep-pixels get partial)
for (let p = 0; p < width * height; p++) {
  if (visited[p]) data[p * channels + 3] = 0;
}

/* ---- transparent original-color logo ---- */
const basePng = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
const baseTrim = await sharp(basePng).trim({ threshold: 8 }).png().toBuffer();
await writeFile('public/brand/lexma-photography-logo.png', baseTrim);
await writeFile('public/brand/lexma-logo-full.png', baseTrim);

/* ---- dark-bg variant: recolor dark text to cream (protect the lens) ---- */
const t = await sharp(baseTrim).raw().toBuffer({ resolveWithObject: true });
const td = t.data, tw = t.info.width, th = t.info.height, tc = t.info.channels;

// lens centroid = dark opaque pixels in upper 55%
let sx = 0, sy = 0, n = 0;
for (let y = 0; y < Math.floor(th * 0.55); y++) {
  for (let x = 0; x < tw; x++) {
    const i = (y * tw + x) * tc;
    if (td[i + 3] > 200) {
      const lum = 0.299 * td[i] + 0.587 * td[i + 1] + 0.114 * td[i + 2];
      if (lum < 70) { sx += x; sy += y; n++; }
    }
  }
}
const cx = sx / n, cy = sy / n, protectR = tw * 0.1;
console.log('lens', Math.round(cx), Math.round(cy), 'R', Math.round(protectR));

const CREAM = [245, 239, 230];
for (let y = 0; y < th; y++) {
  for (let x = 0; x < tw; x++) {
    const i = (y * tw + x) * tc;
    if (td[i + 3] === 0) continue;
    const dx = x - cx, dy = y - cy;
    if (dx * dx + dy * dy < protectR * protectR) continue;
    const r = td[i], g = td[i + 1], b = td[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxc = Math.max(r, g, b), minc = Math.min(r, g, b);
    // dark & not strongly gold-colored => text/shadow: make cream
    if (lum < 120 && maxc - minc < 60) {
      td[i] = CREAM[0];
      td[i + 1] = CREAM[1];
      td[i + 2] = CREAM[2];
    }
  }
}
const darkPng = await sharp(td, { raw: { width: tw, height: th, channels: tc } }).png().toBuffer();
await writeFile('public/brand/lexma-logo-dark.png', darkPng);

/* ---- regenerate the small mark (used by drone section etc. if any) ---- */
const mMeta = await sharp(baseTrim).metadata();
const region = {
  left: Math.round(mMeta.width * 0.13),
  top: 0,
  width: Math.round(mMeta.width * 0.74),
  height: Math.round(mMeta.height * 0.62),
};
const markX = await sharp(baseTrim).extract(region).png().toBuffer();
const mark = await sharp(markX).trim({ threshold: 8 }).png().toBuffer();
await writeFile('public/brand/lexma-mark.png', mark);

/* ---- verification composite: dark logo on black canvas ---- */
const comp = await sharp({
  create: { width: tw + 80, height: th + 80, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } },
})
  .composite([{ input: darkPng, left: 40, top: 40 }])
  .png()
  .toBuffer();
await writeFile('scripts/_check-dark.png', comp);
console.log(`done: base ${tw}x${th}`);
