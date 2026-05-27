var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
// 去掉 Math.min/Math.max，直接纯公式
c=c.replace(/var s=Math\.max\(10,Math\.min\(80,60\*Math\.sqrt\(1\/scaleM\)\)\);/g,'var s=60*Math.sqrt(1/scaleM);');
c=c.replace(/var ds=Math\.max\(6,Math\.min\(48,36\*Math\.sqrt\(1\/scaleM\)\)\)/g,'var ds=36*Math.sqrt(1/scaleM)');
c=c.replace(/Math\.max\(2,Math\.min\(8,4\*Math\.sqrt\(1\/scaleM\)\)\)/g,'4*Math.sqrt(1/scaleM)');
c=c.replace(/Math\.max\(2,Math\.min\(11,5\*Math\.sqrt\(1\/scaleM\)\)\)/g,'5*Math.sqrt(1/scaleM)');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
