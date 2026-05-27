const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-beishan.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) console.log('Script len:', m[1].length);
