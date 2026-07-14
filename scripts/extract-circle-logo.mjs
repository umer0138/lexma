// Extract the circular badge logo from the black-background source image.
// Uses Y-span of gold pixels as the true diameter (X may be clipped in source).
// Extends canvas left/right with black padding so the full circle is captured.
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const SRC = 'C:/Users/Hassaan Ali/Downloads/WhatsApp Image 2026-07-12 at 6.36.51 AM.jpeg';
const OUT = 'public/brand/lexma-logo-dark.png';
const CHECK = 'scripts/_check-circle.png';

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
console.log(`source: ${width}x${height}`);

const isGold = (i) => {
  const r = data[i], g = data[i+1], b = data[i+2];
  return r > 140 && g > 90 && b < 90 && r > b + 80 && r > g * 0.6;
};

// Find gold bounding box
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    if (isGold(i)) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}
console.log(`gold bounds: (${minX},${minY}) - (${maxX},${maxY})`);

// Use Y span as diameter (more reliable — X may be clipped by image crop)
const diameter = maxY - minY;
const radius = diameter / 2;
// Horizontal center: middle of image (logo is centered)
const cx = width / 2;
// Vertical center: middle of Y gold span
const cy = (minY + maxY) / 2;
console.log(`center: (${Math.round(cx)}, ${Math.round(cy)}), radius: ${Math.round(radius)}`);

// Target canvas: diameter x diameter, centered on (cx, cy) in the source
const pad = 8; // a few extra pixels so the ring edge isn't clipped
const size = Math.round(diameter + pad * 2);

// Build the square canvas by sampling from source, filling out-of-bounds with black
const out = Buffer.alloc(size * size * 4, 0); // start all black transparent
const srcLeft = Math.round(cx - size / 2);
const srcTop  = Math.round(cy - size / 2);

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const sx = srcLeft + x, sy = srcTop + y;
    const oi = (y * size + x) * 4;
    if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
      const si = (sy * width + sx) * channels;
      out[oi]   = data[si];
      out[oi+1] = data[si+1];
      out[oi+2] = data[si+2];
      out[oi+3] = 255;
    }
    // pixels outside source bounds stay black (already 0,0,0,0 → will be fully transparent after mask)
  }
}

// Apply circular alpha mask (AA at edge)
const ccx = size / 2, ccy = size / 2;
const clipR = size / 2 - 2;

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const oi = (y * size + x) * 4;
    const dx = x - ccx, dy = y - ccy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > clipR + 1.5) {
      out[oi+3] = 0;
    } else if (dist > clipR - 0.5) {
      out[oi+3] = Math.round(255 * (clipR + 1.5 - dist) / 2);
    }
    // else: fully opaque (already 255 or 0 for out-of-bounds)
  }
}

const outBuf = await sharp(out, { raw: { width: size, height: size, channels: 4 } })
  .resize(600, 600)
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(OUT, outBuf);
console.log(`saved: ${OUT} (${Math.round(outBuf.length/1024)}KB)`);

// verification on black bg
const check = await sharp({ create: { width: 700, height: 700, channels: 4, background: { r:10, g:10, b:10, alpha:1 } } })
  .composite([{ input: outBuf, left: 50, top: 50 }])
  .png().toBuffer();
await writeFile(CHECK, check);
console.log(`check: ${CHECK}`);
