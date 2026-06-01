var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 1. 缩放上限 10 → 1600
  c = c.replace('if(scaleM>10)scaleM=10;', 'if(scaleM>1600)scaleM=1600;');
  c = c.replace('if(v>10)v=10;', 'if(v>1600)v=1600;');
  
  // 2. 在 zoom 函数的 } 后面加双击放大
  // zoom 函数是 function zoom(v,cx,cy){...}
  // 找到 zoom 函数定义，在其闭合 } 后插入
  var zoomFn = 'function zoom(v,cx,cy){';
  var zoomEnd = c.indexOf(zoomFn);
  if (zoomEnd >= 0) {
    // 找到 zoom 函数的完整定义
    var braceCount = 0;
    var found = false;
    for (var i = zoomEnd; i < c.length; i++) {
      if (c[i] === '{') braceCount++;
      if (c[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          // 这是 zoom 函数的闭合括号
          // 跳过可能的空白和后续的 zoomTo 函数
          var after = c.substring(i + 1);
          // 查找 zoomTo 的开头
          var zoomToIdx = after.indexOf('function zoomTo');
          if (zoomToIdx > 0) {
            // 在 zoom 的 } 和 zoomTo 之间插入双击事件
            var insertStr = '\n\n// 双击放大地图\ndocument.addEventListener("dblclick", function(e) {\n  var wrap = document.querySelector(".map-wrap");\n  if (!wrap) return;\n  if (!wrap.contains(e.target)) return;\n  var wr = wrap.getBoundingClientRect();\n  var mx = e.clientX - wr.left, my = e.clientY - wr.top;\n  zoom(2, mx, my);\n});\n';
            c = c.substring(0, i + 1) + insertStr + c.substring(i + 1);
          }
          break;
        }
      }
    }
  }
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK, length=' + c.length);
});
