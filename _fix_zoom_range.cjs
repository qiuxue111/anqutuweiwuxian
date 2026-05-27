var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
c=c.replace(/if\(v<0\.2\)v=0\.2;if\(v>8\)v=8/g,'if(v<0.1)v=0.1;if(v>10)v=10');
c=c.replace(/if\(scaleM<0\.2\)scaleM=0\.2;if\(scaleM>8\)scaleM=8/g,'if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10');
c=c.replace(/min="20"/g,'min="10"');
c=c.replace(/max="800"/g,'max="1000"');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
