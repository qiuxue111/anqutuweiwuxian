var fs = require('fs');
var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];
var totalErrors = 0;

files.forEach(function(n) {
  var c = fs.readFileSync('F:/暗区突围网站/pages/' + n + '.html', 'utf-8');
  var lines = c.split('\n');
  var errors = [];

  // 1. 孤立的 async 行
  lines.forEach(function(l, i) {
    var t = l.trim();
    if (t === 'async' && i > 0 && !/async/.test(lines[i-1])) {
      errors.push('L' + (i+1) + ': lone "async"');
    }
    // 2. 调色盘相关报错（JS 里有但无元素）
    if (t.indexOf('paletteBtn') >= 0 && t.indexOf('.onclick') >= 0 && i > 0) {
      // 检查前面是否有 paletteBtn 的 HTML
      var hasHTML = c.indexOf('<button id="paletteBtn"') >= 0;
      if (!hasHTML) {
        errors.push('L' + (i+1) + ': paletteBtn onclick but no HTML element');
      }
    }
    // 3. 文件协议安全错误（无法避免，忽略）
  });

  if (errors.length > 0) {
    console.log(n + ': ' + errors.length + ' issue(s)');
    errors.forEach(function(e) { console.log('  ' + e); });
    totalErrors += errors.length;
  } else {
    console.log(n + ': OK');
  }
});

console.log('\nTotal issues: ' + totalErrors);
