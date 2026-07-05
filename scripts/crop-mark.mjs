// Crop the gold camera mark from the transparent photography logo
import sharp from 'sharp';
import { writeFile } from 'fs/promises';

const src = 'public/brand/lexma-photography-logo.png';
const meta = await sharp(src).metadata();
const { width, height } = meta;

// mark sits in the upper-middle portion; stop well above the LEXMA text (~57%)
const region = {
  left: Math.round(width * 0.2),
  top: Math.round(height * 0.12),
  width: Math.round(width * 0.6),
  height: Math.round(height * 0.41),
};

const extracted = await sharp(src).extract(region).png().toBuffer();
const buf = await sharp(extracted).trim({ threshold: 12 }).png().toBuffer();

await writeFile('public/brand/lexma-mark.png', buf);
const out = await sharp('public/brand/lexma-mark.png').metadata();
console.log(`mark: ${out.width}x${out.height}`);

// alpha sanity check on the full logo: corners should be transparent
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const a = (x, y) => data[(y * info.width + x) * info.channels + 3];
console.log('corner alphas:', a(2, 2), a(info.width - 3, 2), a(2, info.height - 3), a(info.width - 3, info.height - 3));
