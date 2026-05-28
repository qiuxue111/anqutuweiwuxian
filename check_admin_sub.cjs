const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf-8');
const sIdx = c.indexOf('function adminPass');
const body = c.substring(sIdx, sIdx + 1000);
const idx = body.indexOf('submitted_by');
console.log('adminPass has submitted_by:', idx >= 0 ? '✅' : '❌');
const postStart = body.indexOf('pins","POST"');
console.log('POST:', body.substring(postStart, postStart + 300));
