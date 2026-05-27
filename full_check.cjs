const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

['beishan','valley','armory','farm','airport','tvstation'].forEach(id => {
  const start = c.indexOf('id="' + id + '"');
  const section = c.substring(start, start + 400);
  console.log('--- ' + id + ' ---');
  console.log(section);
  console.log('\n');
});
