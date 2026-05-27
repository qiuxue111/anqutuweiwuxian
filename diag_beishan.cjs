const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Find beishan section
const b = c.indexOf('id="beishan"');
console.log('BEISHAN:');
console.log(c.substring(b, b + 500));
console.log('\n---');
const f = c.indexOf('id="farm"');
console.log('FARM:');
console.log(c.substring(f, f + 500));
