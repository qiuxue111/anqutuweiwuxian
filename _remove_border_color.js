var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 容器图片边框：去掉颜色，改成 transparent
  c = c.replace(
    /border:'\+Math\.min\(3,2\/Math\.pow\(scaleM,1\.176\)\)\+'px solid '\+\(getPinColor\(p\.name\)\|\|'rgba\(255,200,50,0\.6\)'\)/g,
    "border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid transparent"
  );

  // 圆点边框 #fff → transparent
  c = c.replace(
    /border:'\+Math\.min\(3,2\/Math\.pow\(scaleM,1\.176\)\)\+'px solid #fff/g,
    "border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid transparent"
  );

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': fixed');
});
