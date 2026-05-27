var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\rebuild_clean.cjs','utf8');
// 简化 renderLayers: 删掉 all onmouseover/onmouseout 事件处理器，消灭引号嵌套
c=c.replace(/\" onmouseover=\\"this\.style\.background=\\\\\'rgba\(255,255,255,\.05\)\\\\'\\" onmouseout=\\"this\.style\.background=\\\\\'transparent\\\\'\\"/g,'"');
fs.writeFileSync('F:\\暗区突围网站\\rebuild_clean.cjs',c);
console.log('DONE');
