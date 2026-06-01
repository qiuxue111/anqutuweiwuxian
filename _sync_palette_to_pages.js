var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

// 从最新 index.html 提取调色盘 JS
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 提取调色盘 IFFE 块（从最后一个 (function(){ 到 })();）
var palStart = idx.lastIndexOf('(function(){');
var palEnd = idx.indexOf('})();', palStart) + 5;
var paletteJS = idx.substring(palStart, palEnd);

// 提取 CSS 变量
var styleStart = idx.indexOf('<style>');
var styleContent = idx.substring(styleStart + 7, idx.indexOf('</style>'));
var rootIdx = styleContent.indexOf(':root{');
var rootEnd = styleContent.indexOf('}', rootIdx);
var cssVars = styleContent.substring(rootIdx, rootEnd + 1);

// 提取调色盘 HTML（paletteBtn + palettePanel + 包含的 script）
var htmlStart = idx.indexOf('<!-- 调色盘 -->');
var htmlEnd = idx.indexOf('</div><!-- 调色盘 -->', htmlStart);
if (htmlEnd < 0) htmlEnd = idx.indexOf('</div>\n<script>\n(function()', htmlStart);
var paletteHTML = idx.substring(htmlStart, idx.indexOf('<script>\n(function(){', htmlStart));

var targetFiles = [
  '3x3.html', 'gear.html', 'help.html', 'map-airport.html', 'map-armory.html',
  'map-beishan.html', 'map-editor.html', 'map-farm.html', 'map-mobile.html',
  'map-tvstation.html', 'map-valley.html', 'maps.html', 'review.html',
  'strategy.html', 'weapons.html'
];

targetFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) { console.log(file + ': not found, skip'); return; }
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 检查是否已有调色盘
  if (c.indexOf('paletteBtn') < 0) { console.log(file + ': no palette, skip'); return; }
  
  // 1. 替换调色盘 HTML
  // 找到旧的 paletteBtn/Panel 并替换
  var oldPalStart = c.indexOf('<!-- 调色盘 -->');
  var oldScriptStart = -1;
  if (oldPalStart >= 0) {
    // 找到 </body> 前的调色盘 script
    var bodyEnd = c.lastIndexOf('</body>');
    // 找最近的 <script> 在 </body> 之前
    var scBeforeBody = c.lastIndexOf('<script>', bodyEnd);
    // 找 palette 的 script
    var palScriptIdx = c.lastIndexOf('(function(){', bodyEnd);
    if (palScriptIdx > 0) {
      var palScriptEnd = c.indexOf('})();', palScriptIdx) + 5;
      var before = c.substring(0, palScriptIdx - 8); // remove preceding newline before <script>
      if (before.lastIndexOf('<script>') >= before.lastIndexOf('</script>')) {
        // palette script 在 <script> 标签内
        before = c.substring(0, before.lastIndexOf('<script>'));
      }
      var after = c.substring(palScriptEnd);
      c = before + after;
    }
  }
  
  // 2. 重新注入
  // 找到 body 结尾
  var bEnd = c.lastIndexOf('</body>');
  if (bEnd < 0) { console.log(file + ': no </body>'); return; }
  
  // 注入 HTML
  c = c.substring(0, bEnd) + '\n' + paletteHTML + '\n' + c.substring(bEnd);
  
  // 3. 注入 CSS 变量
  if (c.indexOf('<style>') >= 0) {
    // 只在 <style> 后面没有 cssVars 时插入
    var styleTagEnd = c.indexOf('</style>');
    var afterStyle = c.substring(0, styleTagEnd);
    if (afterStyle.indexOf(':root{') < 0) {
      c = c.replace('</style>', '\n' + cssVars + '\n</style>');
    }
  }
  
  // 4. 注入调色盘 JS
  var scriptEnd = c.lastIndexOf('</script>');
  if (scriptEnd < 0) { console.log(file + ': no </script>'); return; }
  c = c.substring(0, scriptEnd) + '\n' + paletteJS + '\n' + c.substring(scriptEnd);
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': updated (' + c.length + ' bytes)');
});

console.log('\nDone. Now verifying...');
