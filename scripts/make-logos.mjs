// Key out the flat light background from the Lexma logo JPGs -> transparent PNGs
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

async function keyOut(src, out, opts = {}) {
  const { threshold = 46, soft = 30 } = opts;
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  // sample background color from the corners
  const corners = [
    0,
    (width - 1) * channels,
    (height - 1) * width * channels,
    ((height - 1) * width + (width - 1)) * channels,
  ];
  let br = 0, bg = 0, bb = 0;
  for (const c of corners) {
    br += data[c];
    bg += data[c + 1];
    bb += data[c + 2];
  }
  br /= 4; bg /= 4; bb /= 4;

  for (let i = 0; i < data.length; i += channels) {
    const dr = data[i] - br;
    const dg = data[i + 1] - bg;
    const db = data[i + 2] - bb;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < threshold) {
      data[i + 3] = 0;
    } else if (dist < threshold + soft) {
      data[i + 3] = Math.round(((dist - threshold) / soft) * 255);
    }
  }

  const png = await sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer();
  await writeFile(out, png);
  console.log(`${out} done (bg rgb(${br | 0},${bg | 0},${bb | 0}))`);
}

await keyOut(
  'public/brand/lexma-photography-logo.jpg',
  'public/brand/lexma-photography-logo.png',
  { threshold: 42, soft: 34 }
);
await keyOut(
  'public/brand/lexma-digital-logo.jpg',
  'public/brand/lexma-digital-logo.png',
  { threshold: 50, soft: 40 }
);
