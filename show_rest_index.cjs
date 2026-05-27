const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');
const s = c.indexOf('id="gear"');
console.log(c.substring(s, s + 1800));
