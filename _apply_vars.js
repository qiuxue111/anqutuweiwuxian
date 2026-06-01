var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 1. 在 <style> 后加 CSS 变量
var cssVars = '\n/* CSS 变量 */\n:root{\n' +
'  --bg-page:#08080e;\n' +
'  --text-body:#ccc;\n' +
'  --accent:#ffc832;\n' +
'  --accent-rgb:255,200,50;\n' +
'  --card-bg:rgba(20,20,30,0.6);\n' +
'  --card-border:rgba(255,255,255,0.05);\n' +
'  --user-bg:rgba(20,20,30,0.7);\n' +
'  --user-border:rgba(255,255,255,0.06);\n' +
'  --menu-bg:rgba(15,15,24,0.92);\n' +
'  --menu-border:rgba(255,255,255,0.06);\n' +
'  --btn-blue-text:#4a9eff;\n' +
'  --btn-red-text:#ff6b6b;\n' +
'  --btn-green-text:#51cf66;\n' +
'  --btn-purple-text:#cc5de8;\n' +
'}\n';
c = c.replace('<style>', '<style>' + cssVars);

// 2. 替换 body 背景和文字
c = c.replace('body{background:#08080e;color:#ccc;', 'body{background:var(--bg-page);color:var(--text-body);');

// 3. 替换 #ffc832 → var(--accent)（排除变量定义行）
var lines = c.split('\n');
lines = lines.map(function(line){
  if (line.indexOf('--accent:') >= 0 || line.indexOf('--accent-rgb:') >= 0) return line;
  // 跳过 #ffc832 在 hex 颜色选择器 value 里（如 palette 的 '#ffc832'）
  if (line.indexOf("v:'#ffc832'") >= 0 || line.indexOf("v:\"#ffc832\"") >= 0) return line;
  return line.replace(/#ffc832/g, 'var(--accent)');
});
c = lines.join('\n');

// 4. 替换 rgba(255,200,50,N)
c = c.replace(/rgba\(255,200,50,(\d+\.?\d*)\)/g, 'rgba(var(--accent-rgb),$1)');

// 5. 其他颜色
c = c.replace(/rgba\(20,20,30,0\.6\)/g,  'var(--card-bg)');
c = c.replace(/rgba\(20,20,30,0\.7\)/g,  'var(--user-bg)');
c = c.replace(/rgba\(15,15,24,0\.92\)/g, 'var(--menu-bg)');
c = c.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--card-border)');
c = c.replace(/rgba\(255,255,255,0\.06\)/g, 'var(--user-border)');
c = c.replace(/#4a9eff/g, 'var(--btn-blue-text)');
c = c.replace(/#ff6b6b/g, 'var(--btn-red-text)');
c = c.replace(/#51cf66/g, 'var(--btn-green-text)');
c = c.replace(/#cc5de8/g, 'var(--btn-purple-text)');

// 6. 更新调色盘的初始颜色值（COLORS 数组里的 v 必须是 hex 或 rgba）
// 读取调色盘 JS 里的 COLORS 数组并保持 v 是实际颜色值
// 但由于之前替换了 #ffc832，COLORS 里的 v:'var(--accent)' 不行
// 让调色盘 JS 保留原始颜色值
// 把调色盘区间的 var(--accent) 还原
var palStart = c.indexOf('// 调色盘');
if (palStart > 0) {
  var palEnd = c.indexOf('</script>', palStart);
  if (palEnd > palStart) {
    var palSection = c.substring(palStart, palEnd);
    palSection = palSection.replace(/var\(--accent\)/g, '#ffc832');
    palSection = palSection.replace(/var\(--bg-page\)/g, '#08080e');
    palSection = palSection.replace(/var\(--text-body\)/g, '#ccc');
    palSection = palSection.replace(/var\(--card-bg\)/g, 'rgba(20,20,30,0.6)');
    palSection = palSection.replace(/var\(--btn-blue-text\)/g, '#4a9eff');
    palSection = palSection.replace(/var\(--btn-red-text\)/g, '#ff6b6b');
    palSection = palSection.replace(/var\(--btn-green-text\)/g, '#51cf66');
    palSection = palSection.replace(/var\(--btn-purple-text\)/g, '#cc5de8');
    c = c.substring(0, palStart) + palSection + c.substring(palEnd);
  }
}

fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
