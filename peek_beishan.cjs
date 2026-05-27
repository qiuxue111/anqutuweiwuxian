const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find beishan close section
const idx = c.indexOf('id="beishan"');
const section = c.substring(idx, idx + 500);
console.log('BEISHAN section:');
console.log(JSON.stringify(section));
