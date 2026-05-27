const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
let idx = c.indexOf('supabase("pins"');
console.log(c.substring(idx, idx+500));
