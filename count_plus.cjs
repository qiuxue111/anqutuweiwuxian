const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

['beishan','valley','armory','farm','airport','tvstation'].forEach(k => {
  const re = new RegExp("openVideoForm\\('" + k + "'", 'g');
  const cnt = (c.match(re) || []).length;
  console.log(k + ': ' + cnt + ' + buttons');
});
