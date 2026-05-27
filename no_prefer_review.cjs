const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf8');
c = c.replace(',"Prefer":"return=representation"', '');
fs.writeFileSync('F:\\暗区突围网站\\pages\\review.html', c);
console.log('Done review - removed Prefer header');
