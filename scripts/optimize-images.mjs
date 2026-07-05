import sharp from 'sharp';
import { readdir, writeFile, stat, rm, rename } from 'fs/promises';
import path from 'path';

const SRC = 'public/images';
const dirs = ['aerials', 'front', 'interior'];

let totalBefore = 0, totalAfter = 0;

for (const dir of dirs) {
  const folder = path.join(SRC, dir);
  const files = (await readdir(folder)).filter(f => /\.jpe?g$/i.test(f));
  for (const file of files) {
    const full = path.join(folder, file);
    const before = (await stat(full)).size;
    totalBefore += before;
    const buf = await sharp(full)
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    const tmp = full + '.tmp.jpg';
    await writeFile(tmp, buf);
    await rm(full);
    await rename(tmp, full);
    totalAfter += buf.length;
  }
  console.log(`${dir}: ${files.length} files done`);
}
console.log(`Total: ${(totalBefore / 1048576).toFixed(0)}MB -> ${(totalAfter / 1048576).toFixed(0)}MB`);
