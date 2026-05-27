const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const idx = c.indexOf('每张地图');
console.log('Context:', c.substring(Math.max(0, idx - 20), idx + 50));
