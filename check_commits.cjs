const fs = require('fs');
const { execSync } = require('child_process');

const commits = ['28e8d2e', '83c97c8', '32e69d5', '03cf19c'];
commits.forEach(hash => {
  const buf = execSync(`git -C "F:\\暗区突围网站" show ${hash}:pages/maps.html`, {encoding:'buffer'});
  const s = buf.toString('utf8');
  const fffd = (s.match(/\ufffd/g) || []).length;
  const brokenTags = (s.match(/\?\/strong>/g) || []).length + (s.match(/\?\/span>/g) || []).length + (s.match(/\?\/li>/g) || []).length + (s.match(/\?\/div>/g) || []).length + (s.match(/\?\/p>/g) || []).length;
  const hasEditor = s.includes('地图编辑器');
  console.log(`${hash}: size=${buf.length}, FFFD=${fffd}, brokenTags=${brokenTags}, editor=${hasEditor}`);
});
