const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'artifact-preview.html');

const mimeFor = (file) => {
  const ext = path.extname(file).toLowerCase();
  return { '.webp': 'image/webp', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png' }[ext] || 'application/octet-stream';
};

const toDataUri = (relPath) => {
  const full = path.join(ROOT, relPath);
  const buf = fs.readFileSync(full);
  return `data:${mimeFor(relPath)};base64,${buf.toString('base64')}`;
};

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// --- extract body content ---
const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
let body = bodyMatch[1];

// drop the external script tag, we'll inline js separately
body = body.replace(/<script src="js\/main\.js"><\/script>\s*/, '');

// --- inline every local asset reference as base64 data URI ---
body = body.replace(/(src|poster|data-src)="(assets\/optimized\/[^"]+)"/g, (m, attr, relPath) => {
  return `${attr}="${toDataUri(relPath)}"`;
});
body = body.replace(/data-lightbox="(assets\/optimized\/[^"]+)"/g, (m, relPath) => {
  return `data-lightbox="${toDataUri(relPath)}"`;
});

// --- css: fonts (subset, base64) + site stylesheet ---
const fontsCss = fs.readFileSync(path.join(__dirname, 'fonts-inline.css'), 'utf8');
const siteCss = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');
const mainJs = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');

const out = `<title>Stock Segurança</title>
<style>
${fontsCss}
${siteCss}
</style>
${body}
<script>
${mainJs}
</script>
`;

fs.writeFileSync(OUT, out);
console.log('written', OUT, (fs.statSync(OUT).size / 1024 / 1024).toFixed(2), 'MB');
