var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
c=c.replace(/var s=Math\.max\(12,40\/scaleM\);/g,'var s=Math.max(12,10/scaleM);');
c=c.replace(/var ds=Math\.max\(8,20\/scaleM\)/g,'var ds=Math.max(8,5/scaleM)');
c=c.replace(/Math\.max\(3,8\/scaleM\)/g,'Math.max(3,2/scaleM)');
c=c.replace(/Math\.max\(4,10\/scaleM\)/g,'Math.max(4,3/scaleM)');
c=c.replace(/Math\.max\(3,8\/scaleM\)/g,'Math.max(3,2/scaleM)');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
