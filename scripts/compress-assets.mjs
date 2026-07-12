// Batch-compress all large images in public/ in-place.
// Safe: reads → tmp → rename (no corrupt partial writes).
// Run once; re-running is idempotent (already-small files are skipped).
import sharp from 'sharp';
import { writeFile, rename, readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const JPEG_QUALITY  = 78;    // good quality, ~60% smaller
const WEBP_QUALITY  = 82;
const MIN_BYTES     = 80 * 1024;  // skip files already < 80 KB

// (src_dir, max_output_width, quality_override)
const DIRS = [
  ['public/images',          1920, JPEG_QUALITY],
  ['public/images/front',    1600, JPEG_QUALITY],
  ['public/images/aerials',  1600, JPEG_QUALITY],
  ['public/images/interior', 1600, JPEG_QUALITY],
  ['public/images/staging',  1600, JPEG_QUALITY],
  ['public/images/apt',      1600, JPEG_QUALITY],
];

// Also compress logo PNGs → much smaller PNGs
const LOGO_FILES = [
  'public/brand/lexma-logo-dark.png',
  'public/brand/lexma-logo-full.png',
  'public/brand/lexma-mark.png',
  'public/brand/lexma-photography-logo.png',
];

let saved = 0, count = 0;

async function compressJpeg(path, maxW, quality) {
  const info = await stat(path);
  if (info.size < MIN_BYTES) return;
  const before = info.size;
  const buf = await sharp(path)
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toBuffer();
  if (buf.length >= before) return; // already optimal
  const tmp = path + '.tmp';
  await writeFile(tmp, buf);
  await rename(tmp, path);
  const kb = (before - buf.length) / 1024;
  saved += kb;
  count++;
  console.log(`  ${basename(path)}: ${Math.round(before/1024)}KB → ${Math.round(buf.length/1024)}KB`);
}

async function compressPng(path) {
  const info = await stat(path);
  if (info.size < MIN_BYTES) return;
  const before = info.size;
  const buf = await sharp(path)
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  if (buf.length >= before) return;
  const tmp = path + '.tmp';
  await writeFile(tmp, buf);
  await rename(tmp, path);
  const kb = (before - buf.length) / 1024;
  saved += kb;
  count++;
  console.log(`  ${basename(path)}: ${Math.round(before/1024)}KB → ${Math.round(buf.length/1024)}KB`);
}

// compress all JPGs in a directory (non-recursive)
async function processDir(dir, maxW, quality) {
  let files;
  try { files = await readdir(dir); } catch { return; }
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      await compressJpeg(join(dir, f), maxW, quality);
    }
  }
}

for (const [dir, maxW, q] of DIRS) await processDir(dir, maxW, q);
for (const f of LOGO_FILES) await compressPng(f);

console.log(`\nDone: ${count} files compressed, ~${Math.round(saved)}KB saved`);
