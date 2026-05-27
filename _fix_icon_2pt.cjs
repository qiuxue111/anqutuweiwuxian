var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
// 公式: 60 / scaleM^1.176 => 用 Math.pow(scaleM, 1.176)
c=c.replace(/var s=60\*Math\.sqrt\(1\/scaleM\);/g,'var s=60/Math.pow(scaleM,1.176);');
c=c.replace(/var ds=36\*Math\.sqrt\(1\/scaleM\)/g,'var ds=36/Math.pow(scaleM,1.176)');
c=c.replace(/4\*Math\.sqrt\(1\/scaleM\)/g,'4/Math.pow(scaleM,1.176)');
c=c.replace(/5\*Math\.sqrt\(1\/scaleM\)/g,'5/Math.pow(scaleM,1.176)');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
