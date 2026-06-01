var fs = require('fs');
var files = ['maps','3x3','gear','review','strategy','weapons','map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 替换 CSS 规则里的 color:#fff → var(--text-body)
  // 但不替换 background 后面的 #fff（按钮背景色）
  c = c.replace(/([\.#][a-zA-Z-]+[^{]*\{[^}]*?)color:#fff([^}]*\})/g, function(m, pre, post) {
    return pre + 'color:var(--text-body)' + post;
  });
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': done');
});
