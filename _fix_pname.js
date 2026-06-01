var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  // 替换 JS 模板字符串中的 getPinColor(p.name) -> getPinColor(item)
  c = c.replace(/getPinColor\(p\.name\)/g, 'getPinColor(item)');
  fs.writeFileSync(fp, c, 'utf-8');
  var left = (c.match(/getPinColor\(p\.name\)/g) || []).length;
  console.log(n + ': leftover=' + left);
});
