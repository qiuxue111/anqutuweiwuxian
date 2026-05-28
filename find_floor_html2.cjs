const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  if (e === 'armory') {
    const idx = c.indexOf('flex-wrap:wrap;max-width:380px');
    if (idx >= 0) console.log(e, '楼层按钮:', c.substring(idx-60, idx+300));
  } else {
    const idx = c.lastIndexOf('class="floor-btn');
    if (idx >= 0) {
      const divStart = c.lastIndexOf('<div', idx);
      const divEnd = c.indexOf('</div>', idx) + 6;
      console.log(e, '楼层按钮:', c.substring(divStart, divEnd));
    } else {
      console.log(e, 'no floor-btn in HTML');
    }
  }
  console.log('---');
});
