const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf-8');
const idx = c.indexOf("var type='other'");
if (idx >= 0) console.log(c.substring(idx-100, idx+300));
