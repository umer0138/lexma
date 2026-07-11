// Remove the white/light halo around the photographer character.
// 1) Rebuild walk frames from source stills with keying + defringe + edge softening.
// 2) Defringe the existing pose webps in place.
import sharp from 'sharp';
import { writeFile, readdir, rename, unlink } from 'fs/promises';

sharp.cache(false); // don't hold input files open (Windows overwrite lock)

const WALK_SRC = 'C:/Users/HASSAA~1/AppData/Local/Temp/claude/B--Web-ide-petrinets/70dff546-dc3f-42d1-880a-9a9a0955c7f2/scratchpad/lexwalk2';
const FRAMES = [24, 25, 26, 27, 28, 29, 30, 31];

/* Defringe: kill light-neutral pixels near the alpha edge, soften remaining edge */
function defringe(data, w, h, { fringeLum = 135, fringeSat = 48, reach = 2 } = {}) {
  const a = (x, y) => data[(y * w + x) * 4 + 3];
  const kill = [];
  const soften = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] === 0) continue;
      // near a transparent pixel?
      let edge1 = false, edge2 = false;
      for (let dy = -reach; dy <= reach && !edge2; dy++) {
        for (let dx = -reach; dx <= reach; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          if (a(nx, ny) === 0) {
            edge2 = true;
            if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) edge1 = true;
            if (edge1) break;
          }
        }
      }
      if (!edge2) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      // light, washed-out fringe pixel → remove entirely
      if (lum > fringeLum && sat < fringeSat) kill.push(i);
      // remaining hard edge → soften for natural blend
      else if (edge1) soften.push(i);
    }
  }
  for (const i of kill) data[i + 3] = 0;
  for (const i of soften) data[i + 3] = Math.round(data[i + 3] * 0.55);
}

/* ---- 1) rebuild walk frames ---- */
let n = 0;
for (const f of FRAMES) {
  const src = `${WALK_SRC}/w${String(f).padStart(2, '0')}.png`;
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // key the flat light bg
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && Math.abs(r - b) < 14) {
      const lum = (r + g + b) / 3;
      if (lum > 118) data[i + 3] = 0;
    }
  }

  // largest connected component only (drops watermark)
  const mask = new Uint8Array(width * height);
  for (let p = 0, i = 3; p < mask.length; p++, i += channels) mask[p] = data[i] > 40 ? 1 : 0;
  const labels = new Int32Array(width * height);
  const q = new Int32Array(width * height);
  let best = null, lab = 0;
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p] || labels[p]) continue;
    lab++;
    let head = 0, tail = 0;
    q[tail++] = p;
    labels[p] = lab;
    let minX = width, maxX = 0, minY = height, maxY = 0, area = 0;
    while (head < tail) {
      const cur = q[head++];
      const cy = (cur / width) | 0;
      const cx = cur - cy * width;
      area++;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;
      for (let dy = -2; dy <= 2; dy++) {
        const ny = cy + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -2; dx <= 2; dx++) {
          const nx = cx + dx;
          if (nx < 0 || nx >= width) continue;
          const np = ny * width + nx;
          if (mask[np] && !labels[np]) {
            labels[np] = lab;
            q[tail++] = np;
          }
        }
      }
    }
    if (!best || area > best.area) best = { lab, minX, maxX, minY, maxY, area };
  }

  const rw = best.maxX - best.minX + 1;
  const rh = best.maxY - best.minY + 1;
  const slice = Buffer.alloc(rw * rh * 4);
  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      const sp = (best.minY + y) * width + (best.minX + x);
      if (labels[sp] === best.lab) {
        const so = sp * channels;
        const do_ = (y * rw + x) * 4;
        slice[do_] = data[so];
        slice[do_ + 1] = data[so + 1];
        slice[do_ + 2] = data[so + 2];
        slice[do_ + 3] = data[so + 3];
      }
    }
  }

  defringe(slice, rw, rh, { fringeLum: 118, fringeSat: 60, reach: 3 });

  n++;
  const buf = await sharp(slice, { raw: { width: rw, height: rh, channels: 4 } })
    .resize({ height: 480, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();
  await writeFile(`public/avatar/walk/walk-${String(n).padStart(2, '0')}.webp`, buf);
}
console.log('walk frames rebuilt:', n);

/* ---- 2) defringe pose webps in place ---- */
const poses = (await readdir('public/avatar')).filter((f) => f.endsWith('.webp'));
for (const f of poses) {
  const p = 'public/avatar/' + f;
  const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  defringe(data, info.width, info.height);
  const buf = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 86 })
    .toBuffer();
  await writeFile(p + '.tmp', buf);
  await unlink(p);
  await rename(p + '.tmp', p);
}
console.log('poses cleaned:', poses.length);
