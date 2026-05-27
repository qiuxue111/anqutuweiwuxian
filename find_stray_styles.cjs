const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Count stray display:inline-flex that are NOT inside <a ...>
let inTag = false;
let strayCount = 0;
const results = [];

for (let i = 0; i < c.length; i++) {
  if (c[i] === '<') inTag = true;
  if (inTag && c[i] === '>') { inTag = false; continue; }
}

// Simpler: count how many times "display:inline-flex" appears
// Subtract 1 for each <a...> tag that contains it
const p = 'display:inline-flex';
let idx = -1;
const allPos = [];
while ((idx = c.indexOf(p, idx + 1)) >= 0) {
  // Check if we're inside a tag by looking backwards for <
  const before = c.lastIndexOf('<', idx);
  const before2 = c.lastIndexOf('>', idx);
  const insideTag = before > before2; // last angle bracket before p is <, not >
  const insideA = c.lastIndexOf('<a', idx) > c.lastIndexOf('</a>', idx);
  // or check if the immediate context is <a ... style="...
  const isLink = c.substring(idx - 30, idx).includes('href="');
  allPos.push({ pos: idx, insideTag, insideA, isLink });
}

console.log('Total display:inline-flex found:', allPos.length);
allPos.forEach((p, i) => {
  console.log(`  #${i+1}: insideTag=${p.insideTag}, insideA=${p.insideA}, isLink=${p.isLink}, context: "${c.substring(p.pos-20, p.pos+30)}"`);
});

// Stray ones: those NOT inside <a ...> tag
const stray = allPos.filter(p => !p.isLink);
console.log('\nStray (not in <a> tag):', stray.length);
stray.forEach(p => {
  console.log(`  Context: "${c.substring(p.pos-40, p.pos+60)}"`);
});
