const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');
// 找 votePass 函数
const idx = c.indexOf('function votePass');
const end = c.indexOf('\nfunction', idx + 20);
const fn = c.substring(idx, end > idx ? end : idx + 4000);
console.log(fn);
