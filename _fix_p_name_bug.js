var fs = require('fs');
var fix = [
  'map-beishan',
  'map-valley',
  'map-farm',
  'map-airport',
  'map-armory',
  'map-tvstation'
];

fix.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  c = c.replace("getPinColor(p.name);if(pc2==='#ff4444')", "getPinColor(item);if(pc2==='#ff4444')");
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': ' + (c.indexOf("getPinColor(p.name)") >= 0 ? 'FAIL' : 'OK'));
});
