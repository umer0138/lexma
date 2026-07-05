// Find the centroid of the dark camera lens inside the gold mark PNG
import sharp from 'sharp';

const { data, info } = await sharp('public/brand/lexma-mark.png')
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
let sx = 0, sy = 0, count = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const a = data[i + 3];
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (a > 200 && lum < 70) {
      sx += x; sy += y; count++;
    }
  }
}
const cx = sx / count, cy = sy / count;
console.log(JSON.stringify({
  width, height,
  lensCenter: { x: Math.round(cx), y: Math.round(cy) },
  imageCenter: { x: width / 2, y: height / 2 },
  offsetFrac: { x: ((cx - width / 2) / width).toFixed(4), y: ((cy - height / 2) / height).toFixed(4) },
}));
