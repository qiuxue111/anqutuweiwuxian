const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');

// 找第一个 "meta'>" 后面的内容 - 坐标信息
const metaIdx = c.indexOf("meta'>");
if (metaIdx < 0) { console.log('not found'); process.exit(0); }
// 拿包含坐标的那个 meta 行
const start = c.lastIndexOf("html+=\"<div class=\\'meta\\'", metaIdx - 200);
// 这一行原本是：
const fullMatch = c.substring(start > 0 ? start : metaIdx - 50, metaIdx + 150);
console.log('META LINE:', fullMatch);
