const fs = require('fs');
const path = require('path');

const charset = fs.readFileSync(path.join(__dirname, 'charset.txt'), 'utf8');
const textParam = encodeURIComponent(charset);

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const requests = [
  { family: 'Big+Shoulders', weights: [700, 800, 900] },
  { family: 'IBM+Plex+Mono', weights: [500, 600] },
  { family: 'Manrope', weights: [400, 700] },
];

async function fetchFace(family, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${textParam}&display=swap`;
  const css = await (await fetch(url, { headers: { 'User-Agent': UA } })).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/);
  if (!match) { console.warn('no woff2 found for', family, weight, css.slice(0, 200)); return null; }
  const fontUrl = match[1];
  const buf = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
  return buf.toString('base64');
}

(async () => {
  let out = '';
  for (const { family, weights } of requests) {
    const cssFamily = family.replace(/\+/g, ' ');
    for (const weight of weights) {
      const b64 = await fetchFace(family, weight);
      if (!b64) continue;
      out += `@font-face{font-family:'${cssFamily}';font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}\n`;
      console.log(`${cssFamily} ${weight}: ${(b64.length * 0.75 / 1024).toFixed(1)}KB`);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'fonts-inline.css'), out);
  console.log('total css size:', (out.length / 1024).toFixed(1), 'KB');
})();
