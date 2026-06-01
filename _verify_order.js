var fs = require('fs');
var targetFiles = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];
targetFiles.forEach(function(n) {
  var c = fs.readFileSync('F:/暗区突围网站/pages/' + n + '.html', 'utf-8');
  var b = (c.match(/\{/g) || []).length;
  var d = (c.match(/\}/g) || []).length;
  // 检查顺序：HTML 出现在 JS 之前
  var hs = c.lastIndexOf('<!-- 调色盘 -->');
  var jsStart = c.lastIndexOf('(function(){');
  var correctOrder = hs < jsStart || hs > c.lastIndexOf('</script>');
  console.log(n + ': braces=' + (b === d ? 'OK' : 'FAIL') + ' order=' + (hs < jsStart ? 'HTML->JS' : 'FAIL'));
});
