const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
let idx = -1, count = 0;
while ((idx = c.indexOf('\ufffd', idx + 1)) >= 0 && count < 30) {
  count++;
  const ctx = c.substring(Math.max(0, idx - 20), idx + 25);
  console.log(`#${count}: ...${ctx.replace(/\ufffd/g, '�')}...`);
}
console.log(`Total remaining: ${(c.match(/\ufffd/g) || []).length}`);
