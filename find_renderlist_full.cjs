const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');

// 找 renderList 中的卡片模板
const rIdx = c.indexOf('function renderList');
const end = c.indexOf('\nfunction', rIdx + 20);
const fn = c.substring(rIdx, end > rIdx ? end : rIdx + 5000);

// 找 meta 那几行
const mIdx = fn.indexOf("坐标: <span");
// 向前看有没有 submitted_by 显示
const before = fn.substring(Math.max(0, mIdx - 300), mIdx);
console.log('BEFORE submit:', before.substring(before.length - 200));
console.log('---');
// 看完整的卡片 HTML 模板
console.log('FULL renderList:', fn.substring(0, 2000));
