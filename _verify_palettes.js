var fs = require('fs');
var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];
files.forEach(function(n) {
  var c = fs.readFileSync('F:/暗区突围网站/pages/' + n + '.html', 'utf-8');
  var b = (c.match(/\{/g) || []).length;
  var d = (c.match(/\}/g) || []).length;
  var hasVar = c.indexOf('var(--accent)') >= 0;
  var hasCat = c.indexOf('调色板标签页') >= 0;
  var hasSys = c.indexOf('跟随系统') >= 0;
  console.log(n + ': braces=' + (b === d ? 'OK' : 'FAIL (' + b + '/' + d + ')') + ' var(--accent)=' + (hasVar?'Y':'n') + ' cat=' + (hasCat?'Y':'n') + ' sys=' + (hasSys?'Y':'n'));
});
