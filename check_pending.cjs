const fs = require('fs');
['farm','beishan','valley','armory','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  const idx = c.indexOf('pending_pins');
  if (idx >= 0) console.log(e+':', c.substring(idx-10, idx+350));
});
