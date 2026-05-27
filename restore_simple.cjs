const fs = require('fs');
const { execSync } = require('child_process');

// Restore the clean commit (a33a391 - simplified maps)
const buf = execSync('git -C "F:\\暗区突围网站" show a33a391:pages/maps.html', {encoding: 'buffer'});
fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', buf);
console.log('Restored a33a391, size:', buf.length);
