const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
const text = stripped.replace(/<[^>]+>/g, ' ');
const decoded = text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, ' ');
const raw = Array.from(new Set(Array.from(decoded))).filter((c) => c.trim().length > 0 || c === ' ');

// O CSS usa text-transform (uppercase/lowercase) em várias seções, o que
// troca o glyph pedido ao navegador (ex: HTML tem "deixe", CSS mostra
// "DEIXE" — o navegador busca o glyph maiúsculo "X", não o minúsculo).
// Sem incluir as duas formas, a fonte subsetada fica sem esse glyph e o
// navegador troca silenciosamente pra uma fonte de fallback só naquela
// letra — foi exatamente isso que causou o "X" desproporcional no preview.
const both = new Set(raw);
for (const c of raw) {
  both.add(c.toUpperCase());
  both.add(c.toLowerCase());
}

const chars = Array.from(both);
fs.writeFileSync(path.join(__dirname, 'charset.txt'), chars.join(''));
console.log('charset.txt:', chars.length, 'characters');
