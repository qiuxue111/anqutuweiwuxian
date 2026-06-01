var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 1. 缩放上限 10 → 1600
  c = c.replace('if(scaleM>10)scaleM=10;', 'if(scaleM>1600)scaleM=1600;');
  c = c.replace('if(v>10)v=10;', 'if(v>1600)v=1600;');
  c = c.replace('if(v<0.1)v=0.1;', 'if(v<0.01)v=0.01;');
  
  // 2. 双击放大
  var dblClickCode = 
'\n// 双击放大\n' +
'document.addEventListener("dblclick", function(e) {\n' +
'  var wrap = document.querySelector(".map-wrap");\n' +
'  if (!wrap) return;\n' +
'  if (!wrap.contains(e.target)) return;\n' +
'  var wr = wrap.getBoundingClientRect();\n' +
'  var mx = e.clientX - wr.left, my = e.clientY - wr.top;\n' +
'  zoom(2, mx, my);\n' +
'});\n';
  
  // 在 zoom 函数后面添加双击事件
  var zoomIdx = c.indexOf('function zoom(v,cx,cy){');
  var zoomEnd = c.indexOf('}\n', c.indexOf('zoomTo', zoomIdx));
  if (zoomEnd < 0) {
    // fallback: 后面有个 function
    zoomEnd = c.indexOf('function', zoomIdx + 10) - 1;
  }
  
  if (zoomIdx >= 0 && zoomEnd > zoomIdx) {
    c = c.substring(0, zoomEnd + 1) + dblClickCode + c.substring(zoomEnd + 1);
  }
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
