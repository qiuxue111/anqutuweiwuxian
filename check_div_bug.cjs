const fs = require('fs');
['beishan','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  const idx = c.indexOf('position:absolute;top:8px;left:8px');
  if (idx >= 0) {
    console.log(e, '附近代码:', c.substring(idx - 30, idx + 100));
  }
});
