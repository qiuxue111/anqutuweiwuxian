var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 只替换最后一个 getPinColor(p.name)（在 items.forEach 里的 incorrect use）
  // 前4个在 pins.forEach 里的要保留
  var lastIdx = c.lastIndexOf('getPinColor(p.name)');
  if (lastIdx >= 0) {
    c = c.substring(0, lastIdx) + 'getPinColor(item)' + c.substring(lastIdx + 16);
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(n + ': fixed last occurrence at ' + lastIdx);
  } else {
    console.log(n + ': no getPinColor(p.name) found');
  }
});
