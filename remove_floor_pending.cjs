const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];

pages.forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // pending_pins POST 中去掉 floor:cf（数据库没有该列）
  // 改为: ..., images:[], floor:cf}  ->  ..., images:[]}
  // 注意: 保留 placePin 中 push 到本地 pins 数组的 floor
  
  // 找到 placePin 中的 pending_pins POST
  const pendingStart = c.indexOf("supabase('pending_pins'");
  if (pendingStart < 0) return;
  
  const postEnd = c.indexOf("})", pendingStart);
  const postBlock = c.substring(pendingStart, postEnd + 2);
  
  if (postBlock.includes('floor:cf')) {
    // 去掉 floor:cf 和前面的逗号
    c = c.replace("floor:cf", "");
    // 如果变为 ",,images" 修复
    c = c.replace(",,", ",");
    // 如果变为 "{...,images" 修复
    c = c.replace(",]", "]");
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`${eng}: ✅ 移除 floor:cf`);
  } else {
    console.log(`${eng}: ⚠️ 没有 floor:cf`);
  }
});

// 验证
console.log('\n=== 验证 ===');
pages.forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("supabase('pending_pins'");
  const post = c.substring(idx, idx + 300);
  const hasFloor = post.includes('floor');
  const jsOk = (c.indexOf('\ufffd') < 0);
  console.log(`${eng}: ${hasFloor?'❌ 仍有floor':'✅ 已去掉floor'} ${jsOk?'✅ JS OK':'❌ 乱码'}`);
});
