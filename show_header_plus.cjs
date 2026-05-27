const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const headerStart = c.indexOf('map-header');
const headerEnd = c.indexOf('map-detail', headerStart);
console.log('Between header and first map-detail:');
console.log(c.substring(headerStart + 12, headerEnd));
