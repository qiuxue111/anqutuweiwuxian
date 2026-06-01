var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile','3x3'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 替换 JS 字符串中的硬编码颜色
  // 单引号里的 #ffc832
  c = c.replace(/'#ffc832'/g, 'var(--accent)');
  // 双引号里的 #ffc832（但不包括 DEFAULTS 中）
  c = c.replace(/"#ffc832"/g, function(m) {
    var before = c.substring(0, c.indexOf(m));
    if (before.indexOf('DEFAULTS') > before.lastIndexOf('\n')) return m;
    return 'var(--accent)';
  });
  // 替换 #888 颜色（文字色）
  c = c.replace(/'#888'/g, 'var(--text-body)');
  c = c.replace(/"#888"/g, 'var(--text-body)');
  // rgba(255,200,50,0.12) 背景
  c = c.replace(/rgba\(255,200,50,[^)]+\)/g, 'var(--accent)');
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': done');
});
