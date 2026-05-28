const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf-8');

// 在 renderList 卡片模板中找 submitted_by
const idx = c.indexOf('html+=\"<div class=\\'meta\\'");
if (idx < 0) { console.log('not found'); process.exit(0); }
// 看 meta 后面的内容
const end = c.indexOf('html+=', idx + 1);
const metaBlock = c.substring(idx, end > idx ? end : idx + 800);
console.log(metaBlock);
