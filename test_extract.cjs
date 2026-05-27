const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var idx = c.indexOf('<script>') + 8;
var idx2 = c.indexOf('</script>', idx);
var s = c.substring(idx, idx2);
fs.writeFileSync('F:\\temp_script_only.js', s);
console.log('Wrote', s.length, 'chars');
