const fs = require('fs');
const { execSync } = require('child_process');

const repoDir = 'F:\\暗区突围网站';
const filePath = repoDir + '\\pages\\maps.html';

// Get the committed version from HEAD
const buf = execSync(`git -C "${repoDir}" show HEAD:pages/maps.html`);
console.log('HEAD commit size:', buf.length);

fs.writeFileSync(filePath, buf);
console.log('Written to disk');

// Verify
const s = fs.readFileSync(filePath, 'utf8');
console.log('U+FFFD:', (s.match(/\ufffd/g) || []).length);
console.log('Has 攻略站:', s.includes('攻略站'));
console.log('Has 技术:', s.includes('技术'));
console.log('Has 前线要塞:', s.includes('前线要塞'));
