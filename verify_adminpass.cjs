const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\review.html','utf-8');

// 验证 adminPass 现在有 floor
const idx = c.indexOf('function adminPass');
const body = c.substring(idx, idx + 800);
const hasFloor = body.includes('floor:');
console.log('adminPass has floor:', hasFloor ? '✅' : '❌');

// JS 验证
const m = c.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  const tmp = require('os').tmpdir() + '\\rv_final.js';
  fs.writeFileSync(tmp, m[1], 'utf-8');
  try { require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' }); console.log('✅ JS OK'); }
  catch(e) { console.log('❌ JS语法错误'); }
}
