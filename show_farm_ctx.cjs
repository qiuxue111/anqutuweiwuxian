const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const farmIdx = c.indexOf('id="farm"');
console.log('Farm context:');
console.log(c.substring(farmIdx - 500, farmIdx + 800));
