const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("supabase('pending_pins'");
  const post = c.substring(idx, idx + 400);
  // 显示 floor 出现的位置
  let f = 0;
  while (true) {
    const fi = post.indexOf('floor', f);
    if (fi < 0) break;
    console.log(`${eng} floor at offset ${fi}: ${post.substring(Math.max(0,fi-5), fi+15)}`);
    f = fi + 1;
  }
});
