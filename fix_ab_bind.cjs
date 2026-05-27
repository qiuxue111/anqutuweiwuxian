const fs = require('fs');
var content = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');
// 找到初始化 IIFE
content = content.replace(
  "var sb=document.getElementById('ab');if(sb&&!sb.onclick)sb.onclick=function(){showPicker();};\nvar b=document.getElementById('lbb');",
  "var b=document.getElementById('lbb');"
);
// 在初始化 IIFE 的 loadCloudPins 前加上 #ab 绑定
content = content.replace(
  "setTimeout(loadCloudPins,300)",
  "var sb=document.getElementById('ab');if(sb&&!sb.onclick)sb.onclick=function(){showPicker();};\n setTimeout(loadCloudPins,300)"
);
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', content);
console.log('Fixed');
