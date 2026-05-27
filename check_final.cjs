const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Check the context of header area
const h1End = c.indexOf('</h1>', c.indexOf('map-header">'));
console.log('After </h1>:');
console.log(c.substring(h1End + 5, h1End + 100));
console.log('...');
// Check beishan map-detail area
const bStart = c.indexOf('id="beishan"');
console.log('\nbeishan detail:');
console.log(c.substring(bStart, bStart + 350));
