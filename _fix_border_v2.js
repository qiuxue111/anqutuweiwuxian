var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 容器图片边框：去掉 solid + 颜色部分，改为 transparent
  // 原来：border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid '+getPinColor...
  // 改为：border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid transparent'
  var old1 = "solid '+(getPinColor(p.name)||'rgba(255,200,50,0.6)')+';box-shadow:0 0 ";
  var new1 = "solid transparent';box-shadow:0 0 ";
  c = c.replace(old1, new1);

  // 圆点边框：solid #fff → transparent
  // 原来：solid #fff;box-shadow:0 0 
  var old2 = "solid #fff;box-shadow:0 0 ";
  var new2 = "solid transparent;box-shadow:0 0 ";
  c = c.replace(new2, new2); // placeholder - we'll do it differently

  // Actually match exact pattern: Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff
  c = c.replace(
    /Math\.min\(3,2\/Math\.pow\(scaleM,1\.176\)\)\+'px solid #fff/g,
    "Math.min(3,2/Math.pow(scaleM,1.176))+'px solid transparent"
  );

  // 容器图片边框（没有 getPinColor 的情况已经覆盖在上面的 solid transparent 替换中）

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': fixed');
});
