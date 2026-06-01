var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 容器图片尺寸：Math.min(100,60/Math.pow(scaleM,1.176)) → Math.max(2,Math.min(100,60/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(100,60\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(2,Math.min(100,60/Math.pow(scaleM,1.176)))'
  );

  // 圆点尺寸：Math.min(60,36/Math.pow(scaleM,1.176)) → Math.max(2,Math.min(60,36/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(60,36\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(2,Math.min(60,36/Math.pow(scaleM,1.176)))'
  );

  // 边框：Math.min(3,2/Math.pow(scaleM,1.176)) → Math.max(0.5,Math.min(3,2/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(3,2\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(0.5,Math.min(3,2/Math.pow(scaleM,1.176)))'
  );

  // 圆角：Math.min(10,4/Math.pow(scaleM,1.176)) → Math.max(1,Math.min(10,4/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(10,4\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(1,Math.min(10,4/Math.pow(scaleM,1.176)))'
  );

  // 阴影：Math.min(12,5/Math.pow(scaleM,1.176)) → Math.max(1,Math.min(12,5/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(12,5\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(1,Math.min(12,5/Math.pow(scaleM,1.176)))'
  );

  // emoji文字：Math.min(36,20/Math.pow(scaleM,1.176)) → Math.max(6,Math.min(36,20/Math.pow(scaleM,1.176)))
  c = c.replace(
    /Math\.min\(36,20\/Math\.pow\(scaleM,1\.176\)\)/g,
    'Math.max(6,Math.min(36,20/Math.pow(scaleM,1.176)))'
  );

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
