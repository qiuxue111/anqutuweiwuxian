const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];
pages.forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  // 找 pending_pins POST 后的跳转URL
  const idx = c.indexOf("pending_pins','POST'");
  const after = c.substring(idx, idx + 2000);
  // 找 var u=
  const vu = after.indexOf('var u=');
  if (vu >= 0) {
    const semi = after.indexOf(';', vu);
    console.log(e, '跳转URL:', after.substring(vu, Math.min(vu+150, semi)));
  } else {
    // 可能没有 var u=，看后续内容
    console.log(e, '无 var u=，看100个字符:', after.substring(0,100));
  }
});
