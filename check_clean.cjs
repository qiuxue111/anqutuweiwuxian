const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const h1End = c.indexOf('</h1>');
const firstDetail = c.indexOf('id="beishan"', h1End);
console.log('After h1:', JSON.stringify(c.substring(h1End + 5, firstDetail)));

// Check each map
['beishan','valley','armory','farm','airport','tvstation'].forEach(id => {
  const s = c.indexOf('id="' + id + '"');
  const sec = c.substring(s, s + 400);
  console.log(`\n${id}:`);
  console.log(JSON.stringify(sec));
});
