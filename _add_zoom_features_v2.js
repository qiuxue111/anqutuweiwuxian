var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 1. 缩放上限 10 → 1600
  c = c.replace('if(scaleM>10)scaleM=10;', 'if(scaleM>1600)scaleM=1600;');
  c = c.replace('if(v>10)v=10;', 'if(v>1600)v=1600;');
  
  // 2. 在 zoom 函数后面加双击放大（在 zoom 函数闭合 } 之后加）
  // zoom 函数的结束是 } 后换行，后面一般紧跟着 function zoomTo
  c = c.replace('if(v>1600)v=1600;', 'if(v>1600)v=1600;\n}\n\n// 双击放大地图\ndocument.addEventListener("dblclick", function(e) {\n  var wrap = document.querySelector(".map-wrap");\n  if (!wrap) return;\n  if (!wrap.contains(e.target)) return;\n  var wr = wrap.getBoundingClientRect();\n  var mx = e.clientX - wr.left, my = e.clientY - wr.top;\n  zoom(2, mx, my);\n});');
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
