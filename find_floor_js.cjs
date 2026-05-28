const fs = require('fs');
['beishan','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  // 找 JS 中生成楼层按钮的代码 - 通常是 floorLabels.forEach 或 html+= btn
  const jsStart = c.lastIndexOf('<script>');
  const js = c.substring(jsStart);
  const flIdx = js.indexOf('floorLabels');
  if (flIdx < 0) { console.log(e, 'no floorLabels in script'); return; }
  // 找到 floorLabels 后面的循环生成按钮
  const genStart = js.indexOf('html', flIdx);
  if (genStart < 0) { console.log(e, 'no html after floorLabels'); return; }
  const genEnd = js.indexOf('.innerHTML', genStart);
  console.log(e, '生成按钮的JS:');
  console.log(js.substring(Math.max(0, flIdx - 20), genEnd > genStart ? genEnd + 20 : genStart + 500));
  console.log('---');
});
