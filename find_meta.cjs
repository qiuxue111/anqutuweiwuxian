const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');
const idx = c.indexOf("class=\\'meta\\'");
if (idx < 0) { console.log('not found'); process.exit(0); }
console.log(c.substring(idx - 30, idx + 400));
