const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');

// 找 renderList 中的 view-on-map-btn 模板
const rlIdx = c.indexOf('function renderList');
const nextFn = c.indexOf('\nfunction', rlIdx + 20);
const renderListCode = c.substring(rlIdx, nextFn > rlIdx ? nextFn : rlIdx + 5000);

const btnIdx = renderListCode.indexOf('view-on-map-btn');
console.log('renderList template:', renderListCode.substring(btnIdx - 30, btnIdx + 500));
