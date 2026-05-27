const fs = require('fs');
const { execSync } = require('child_process');
const buf = execSync('git -C "F:\\暗区突围网站" show 03cf19c:pages/maps.html', {encoding: 'buffer'});
fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', buf);
console.log('Written:', buf.length, 'bytes');
// Verify encoding
const s = buf.toString('utf8');
console.log('FFFD:', (s.match(/\ufffd/g) || []).length);
console.log('Has 编辑器:', s.includes('地图编辑器'));
