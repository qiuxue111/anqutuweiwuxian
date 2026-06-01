var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 提取调色盘 HTML（从 <!-- 调色盘 --> 到 palettePanel 的 </div>）
var hs = idx.indexOf('<!-- 调色盘 -->');
var np = idx.indexOf('palettePanel', hs);
var d1 = idx.indexOf('</div>', np);
var d2 = idx.indexOf('</div>', d1 + 6);
var d3 = idx.indexOf('</div>', d2 + 6);
var paletteHTML = idx.substring(hs, d3 + 6);

// 提取调色盘 JS（最后一个 (function(){ 到 })();）
var jsStart = idx.lastIndexOf('(function(){');
var jsEnd = idx.indexOf('})();', jsStart) + 5;
var paletteJS = idx.substring(jsStart, jsEnd);

// 提取 CSS 变量（:root{...} 在 <style> 中）
var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

var targetFiles = [
  '3x3.html', 'gear.html', 'help.html',
  'map-airport.html', 'map-armory.html', 'map-beishan.html',
  'map-editor.html', 'map-farm.html', 'map-mobile.html',
  'map-tvstation.html', 'map-valley.html',
  'maps.html', 'review.html', 'strategy.html', 'weapons.html'
];

targetFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) { console.log(file + ': not found'); return; }
  var c = fs.readFileSync(fp, 'utf-8');
  if (c.indexOf('paletteBtn') < 0) { console.log(file + ': no palette'); return; }

  // 1. 删除旧的调色盘 HTML（<!-- 调色盘 --> 到 </div>×3 后）
  var oldHs = c.indexOf('<!-- 调色盘 -->');
  var oldD1, oldD2, oldD3;
  if (oldHs >= 0) {
    oldD1 = c.indexOf('</div>', c.indexOf('palettePanel', oldHs));
    oldD2 = c.indexOf('</div>', oldD1 + 6);
    oldD3 = c.indexOf('</div>', oldD2 + 6);
    // 删除从 oldHs 到 oldD3+6
    if (oldD3 > oldHs) {
      c = c.substring(0, oldHs) + c.substring(oldD3 + 6);
    }
  }

  // 2. 删除旧的 palette JS（最后一个 (function(){ 到 })(); 在 </body> 附近）
  var bodyIdx = c.lastIndexOf('</body>');
  if (bodyIdx > 0) {
    var palJsStart = c.lastIndexOf('(function(){', bodyIdx);
    if (palJsStart > 0) {
      // 找到前面的 <script> 标签
      var scrTag = c.lastIndexOf('<script>', palJsStart);
      if (scrTag > c.lastIndexOf('</script>', palJsStart)) {
        // palette JS 在一个独立的 <script> 中，删除从 scrTag 到 })();
        var palJsEnd = c.indexOf('})();', palJsStart) + 5;
        // 检查后面是否有 </script>
        var closeScr = c.indexOf('</script>', palJsEnd);
        if (closeScr > palJsEnd && closeScr - palJsEnd < 20) {
          c = c.substring(0, scrTag) + c.substring(closeScr + 9);
        } else {
          // 只删除 JS 内容
          c = c.substring(0, palJsStart) + c.substring(palJsEnd);
        }
      }
    }
  }

  // 3. 注入 CSS 变量（如果还没有）
  if (c.indexOf(':root{') < 0) {
    if (c.indexOf('<style>') >= 0) {
      // 在 <style> 标签内插入
      var stTag = c.indexOf('<style>');
      var stEnd = c.indexOf('</style>', stTag);
      c = c.substring(0, stEnd) + '\n' + cssVars + '\n' + c.substring(stEnd);
    }
  }

  // 4. 注入调色盘 HTML
  c = c.replace('</body>', paletteHTML + '\n</body>');

  // 5. 注入调色盘 JS（在最后一个 </script> 前）
  var lastScr = c.lastIndexOf('</script>');
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + paletteJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': OK (' + c.length + ' bytes)');
});

console.log('\nDone.');
