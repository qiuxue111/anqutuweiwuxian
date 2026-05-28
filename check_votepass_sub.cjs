const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html', 'utf-8');
// 检查 votePass 的 POST 有没有 submitted_by
const vIdx = c.indexOf('function votePass');
const body = c.substring(vIdx, vIdx + 800);
const postStart = body.indexOf('pins","POST"');
const postEnd = body.indexOf('});', postStart);
const post = body.substring(postStart, postEnd + 3);
console.log('votePass POST:', post);
