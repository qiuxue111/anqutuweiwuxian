var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
// 用平方根缩放: s = Math.max(10, Math.min(40, 20 * Math.sqrt(1/scaleM)))
c=c.replace(/var s=Math\.max\(12,10\/scaleM\);/g,'var s=Math.max(10,Math.min(40,20*Math.sqrt(1/scaleM)));');
c=c.replace(/var ds=Math\.max\(8,5\/scaleM\)/g,'var ds=Math.max(6,Math.min(24,12*Math.sqrt(1/scaleM)))');
// 圆角/阴影/边框跟着一起：也用 sqrt
c=c.replace(/Math\.max\(3,2\/scaleM\)/g,'Math.max(2,Math.min(8,4*Math.sqrt(1/scaleM)))');
c=c.replace(/Math\.max\(4,3\/scaleM\)/g,'Math.max(2,Math.min(11,5*Math.sqrt(1/scaleM)))');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
