var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

var targetFiles = [
  '3x3.html', 'gear.html', 'help.html',
  'map-airport.html', 'map-armory.html', 'map-beishan.html',
  'map-editor.html', 'map-farm.html', 'map-mobile.html',
  'map-tvstation.html', 'map-valley.html',
  'maps.html', 'review.html', 'strategy.html', 'weapons.html'
];

targetFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  var c = fs.readFileSync(fp, 'utf-8');

  // 找到调色盘 JS（最后一个 (function(){ 到 })();）
  var jsStart = c.lastIndexOf('(function(){');
  var jsEnd = c.indexOf('})();', jsStart) + 5;
  var paletteJS = c.substring(jsStart, jsEnd);

  // 找到调色盘 HTML（<!-- 调色盘 --> 到 </div>×3 后）
  var hs = c.indexOf('<!-- 调色盘 -->');
  var np = c.indexOf('palettePanel', hs);
  var d1 = c.indexOf('</div>', np);
  var d2 = c.indexOf('</div>', d1 + 6);
  var d3 = c.indexOf('</div>', d2 + 6);
  var paletteHTML = c.substring(hs, d3 + 6);

  // 找到包裹 JS 的 <script> 标签
  var scrStart = c.lastIndexOf('<script>', jsStart);
  var scrEnd = c.indexOf('</script>', jsEnd);
  
  // 删除调色盘 JS 和它的 <script> 标签
  c = c.substring(0, scrStart) + '\n' + c.substring(scrEnd + 9);

  // 删除调色盘 HTML
  c = c.substring(0, c.indexOf('<!-- 调色盘 -->')) + c.substring(d3 + 6);

  // 重新注入：先 HTML，再 JS（在 `</body>` 前）
  var bodyEnd = c.lastIndexOf('</body>');
  c = c.substring(0, bodyEnd) + '\n' + paletteHTML + '\n<script>\n' + paletteJS + '\n</script>\n' + c.substring(bodyEnd);

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': fixed (' + c.length + ')');
});

console.log('Done.');
