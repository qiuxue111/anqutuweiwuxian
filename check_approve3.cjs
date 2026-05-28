const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');
// 在 PATCH pending_pins 后面找 POST pins
const patchIdx = c.indexOf('pending_pins","PATCH"');
if (patchIdx < 0) { console.log('no PATCH'); process.exit(0); }
const after = c.substring(patchIdx, patchIdx + 2000);
const postIdx = after.indexOf('pins","POST"');
console.log(after.substring(postIdx - 30, postIdx + 400));
// 看看 floor 在前面的 GET 中是否包含
const getIdx = after.indexOf('pending_pins","GET"');
console.log('\nGET pending_pins:', after.substring(getIdx, getIdx + 400));
