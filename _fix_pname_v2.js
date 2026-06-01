var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  var oldStr = 'getPinColor(p.name)';  // 19 chars
  var newStr = 'getPinColor(item)';    // 16 chars
  
  var lastIdx = c.lastIndexOf(oldStr);
  if (lastIdx >= 0) {
    c = c.substring(0, lastIdx) + newStr + c.substring(lastIdx + oldStr.length);
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(n + ': fixed');
  } else {
    console.log(n + ': not found');
  }
});
