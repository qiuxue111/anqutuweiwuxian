const fs = require('fs');
['beishan','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  // 找 </script> 之后的 floor-btn HTML
  const scriptEnd = c.lastIndexOf('</script>');
  const html = c.substring(scriptEnd);
  const idx = html.indexOf('floor-btn');
  if (idx >= 0) {
    // 向前找到最近的 <div
    const divStart = html.lastIndexOf('<div', idx);
    const divEnd = html.indexOf('</div>', idx) + 6;
    console.log(e, '按钮HTML:', html.substring(divStart, divEnd));
  } else {
    // 试试在 <script> 里面通过 JS 生成的
    const inScript = c.indexOf('floor-btn', c.lastIndexOf('<script>'));
    if (inScript >= 0) {
      const line = c.lastIndexOf('\n', inScript);
      const lineEnd = c.indexOf('\n', inScript);
      console.log(e, '在JS中:', c.substring(line, lineEnd));
    } else {
      console.log(e, 'not found');
    }
  }
});
