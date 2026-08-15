const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assents', 'logo-hikvision.jpg');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'optimized', 'images');

async function run() {
  const trimmed = sharp(SRC).trim({ threshold: 15 });
  const { data, info } = await trimmed.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r > 232 && g > 232 && b > 232) {
      data[i + 3] = 0;
    } else if (r > 200 && g > 200 && b > 200) {
      // soft edge: proportionally fade near-white pixels to avoid a hard halo
      const brightness = (r + g + b) / 3;
      const alpha = Math.max(0, 255 - ((brightness - 200) / (232 - 200)) * 255);
      data[i + 3] = Math.round(alpha);
    }
  }

  const base = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  for (const w of [600, 300]) {
    const targetW = Math.min(w, info.width);
    await base.clone().resize({ width: targetW, withoutEnlargement: true }).png({ quality: 90 }).toFile(path.join(OUT_DIR, `logo-hikvision-transparent-${w}.png`));
  }
  console.log('done', info.width, info.height);
}
run().catch((e) => { console.error(e); process.exit(1); });
