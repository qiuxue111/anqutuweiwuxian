var fs = require('fs');
var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];
files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  var b = (c.match(/\x7b/g) || []).length;
  var d = (c.match(/\x7d/g) || []).length;
  // 检查加载器位置：在 <script> 标签内
  var ls = c.lastIndexOf('abi_palette');
  var before = c.substring(0, ls);
  var scrOpen = before.lastIndexOf('<script');
  var scrClose = before.lastIndexOf('</script>');
  var inScript = scrOpen > scrClose;
  // 检查 HTML 结构完整：<!DOCTYPE 要出现在文件开头
  var hasDT = c.indexOf('<!DOCTYPE html>') >= 0 || c.indexOf('<!DOCTYPE') >= 0;
  console.log(n + ': braces=' + (b === d ? 'OK' : 'FAIL') + ' inScript=' + (inScript ? 'Y' : 'n') + ' DOCTYPE=' + (hasDT ? 'Y' : 'n') + ' var(--accent)=' + (c.indexOf('var(--accent)') >= 0 ? 'Y' : 'n') + ' card-bg=' + (c.indexOf('var(--card-bg)') >= 0 ? 'Y' : 'n'));
});
