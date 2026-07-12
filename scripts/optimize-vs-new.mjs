// Optimize new virtual staging photos from vs-new folder
import sharp from 'sharp';
import { writeFile, rename } from 'fs/promises';

const INPUTS = [
  { src: 'B:/MAIRA-website/vs-new/DSC_1821 - Virtual Staged-1.jpeg', out: 'public/images/staging/staging-new-01.jpg' },
  { src: 'B:/MAIRA-website/vs-new/DSC_1837 - Virtual Staged.jpeg',   out: 'public/images/staging/staging-new-02.jpg' },
];

for (const { src, out } of INPUTS) {
  const buf = await sharp(src)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();
  await writeFile(out + '.tmp', buf);
  await rename(out + '.tmp', out);
  const kb = Math.round(buf.length / 1024);
  console.log(`✓ ${out}  (${kb} KB)`);
}
