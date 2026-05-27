var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_complete.cjs','utf8');
// 基础系数 20→60
c=c.replace(/\*Math\.sqrt\(1\/scaleM\)\)\;'/g,'*60*Math.sqrt(1/scaleM)));');
// 要精确匹配原来的行 -> 直接替换整行
var lines=c.split('\n');
for(var i=0;i<lines.length;i++){
  if(lines[i].indexOf('var s=Math.max(10,Math.min(40,20*Math.sqrt(1/scaleM)));')>=0){
    lines[i]=lines[i].replace('20*Math.sqrt(1/scaleM)','60*Math.sqrt(1/scaleM)').replace('Math.min(40','Math.min(80');
  }
  if(lines[i].indexOf('var ds=Math.max(6,Math.min(24,12*Math.sqrt(1/scaleM)))')>=0){
    lines[i]=lines[i].replace('12*Math.sqrt(1/scaleM)','36*Math.sqrt(1/scaleM)').replace('Math.min(24','Math.min(48');
  }
}
c=lines.join('\n');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_complete.cjs',c);
console.log('OK');
