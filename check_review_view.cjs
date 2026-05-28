const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf-8');
const idx = c.indexOf('view-on-map-btn');
if (idx < 0) { console.log('not found'); process.exit(0); }
// 找到 click 事件监听器
const clickIdx = c.indexOf('addEventListener', idx);
if (clickIdx < 0) { console.log('no event', c.substring(idx, idx+200)); process.exit(0); }
const nearby = c.substring(Math.max(0, clickIdx-200), clickIdx+800);
console.log(nearby);
