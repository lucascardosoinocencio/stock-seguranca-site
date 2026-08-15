const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assents');
const OUT = path.join(__dirname, '..', 'assets', 'optimized', 'images');

// name -> { file, widths, kind }
// kind: 'product' (photo), 'logo' (needs transparency/flat bg preserved)
const jobs = [
  { file: 'cftv kit vision.jpeg', slug: 'cftv-hikvision-kit', widths: [800, 480] },
  { file: 'controle de acesso hikvision.jpeg', slug: 'controle-acesso-hikvision', widths: [800, 480] },
  { file: 'controle de acesso intelbras.png', slug: 'controle-acesso-intelbras', widths: [800, 480] },
  { file: 'fechadura ezviz.jpeg', slug: 'fechadura-ezviz', widths: [800, 480] },
  { file: 'fechadura-intelbras.webp', slug: 'fechadura-intelbras', widths: [800, 480] },
  { file: 'hi-speed-fb nice.png', slug: 'motor-portao-nice', widths: [800, 480] },
  { file: 'kit cftv intelbras.webp', slug: 'cftv-intelbras-kit', widths: [800, 480] },
  { file: 'kit-cercaeletrica-intelbras.png', slug: 'cerca-eletrica-intelbras', widths: [800, 480] },
  { file: 'manutenção motor 2.jpeg', slug: 'manutencao-motor-2', widths: [1200, 800] },
  { file: 'manutenção motor.jpeg', slug: 'manutencao-motor-1', widths: [1200, 800] },
  { file: 'sistema-8000-sistema-de-alarme-sem-fio.webp', slug: 'central-alarme-intelbras', widths: [800, 480] },
  { file: 'logo-cliente.jpg', slug: 'logo-stock-seguranca', widths: [900, 500, 200] },
  { file: 'logo-intelbras.png', slug: 'logo-intelbras', widths: [600, 300] },
  { file: 'logo-hikvision.jpg', slug: 'logo-hikvision', widths: [600, 300], trim: true },
  { file: 'logo-nice.png', slug: 'logo-nice', widths: [600, 300] },
  { file: 'concertina 1.jpg', slug: 'concertina-1', widths: [800, 480] },
  { file: 'concertina 2.jpeg', slug: 'concertina-2', widths: [800, 480] },
  { file: 'motor nice 1.jpg', slug: 'motor-nice-deslizante', widths: [800, 480] },
  { file: 'motor nice basculante.webp', slug: 'motor-nice-basculante', widths: [800, 480] },
  { file: 'video porteiro - intelbras.jpg', slug: 'video-porteiro-intelbras', widths: [800, 480] },
  { file: 'video-porteiro-hikvision.jpg', slug: 'video-porteiro-hikvision', widths: [800, 480] },
  { file: 'central monitoramento.jpg', slug: 'central-monitoramento', widths: [1100, 700] },
];

async function run() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const job of jobs) {
    const inputPath = path.join(SRC, job.file);
    if (!fs.existsSync(inputPath)) {
      console.warn('MISSING', job.file);
      continue;
    }
    const base = () => (job.trim ? sharp(inputPath).trim({ threshold: 15 }) : sharp(inputPath));
    const meta = await base().metadata();
    for (const w of job.widths) {
      const targetW = Math.min(w, meta.width || w);
      const outPath = path.join(OUT, `${job.slug}-${w}.webp`);
      await base()
        .resize({ width: targetW, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      const size = fs.statSync(outPath).size;
      console.log(`${job.slug}-${w}.webp`, `${(size / 1024).toFixed(0)}KB`, `(orig ${meta.width}x${meta.height})`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
