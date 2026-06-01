var fs = require('fs');
var files = ['maps','3x3','gear','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 替换 CSS 选择器里的 color:#fff（color: #fff 格式）
  c = c.replace(/\.([a-zA-Z-]+)\s*\{[^}]*?color:\s*#fff[^}]*\}/g, function(match) {
    return match.replace(/color:\s*#fff/gi, 'color:var(--text-body)');
  });
  // 替换内联 style 里的 color:#fff（只替换标题/文字类的）
  c = c.replace(/style="[^"]*color:#fff[^"]*"/g, function(match) {
    return match.replace(/color:#fff/gi, 'color:var(--text-body)');
  });
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': done');
});
