const fs = require('fs');
const pages = ['farm','beishan','valley','armory','airport','tvstation'];

pages.forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // pending_pins POST: 在 images:[] 后加 ,floor:cf
  // 找 pending_pins POST 的结束位置
  const idx = c.indexOf("supabase('pending_pins'");
  const postEnd = c.indexOf("})", idx);
  const postBlock = c.substring(idx, postEnd + 2);
  
  // 检查是否已有 floor:cf
  if (postBlock.includes('floor:cf')) {
    console.log(`${eng}: ⚠️ 已有 floor:cf`);
    return;
  }
  
  // 在 }) 前加上 ,floor:cf
  const newPost = postBlock.slice(0, -2) + ",floor:cf})";
  c = c.replace(postBlock, newPost);
  
  // 处理多余的逗号: images:[],,floor:cf -> images:[],floor:cf
  c = c.replace("[],,", "[],");
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(`${eng}: ✅ 加回 floor:cf`);
});

// 验证
console.log('\n=== 验证 ===');
pages.forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("supabase('pending_pins'");
  const post = c.substring(idx, idx + 300);
  const hasFloor = post.includes('floor:cf');
  console.log(`${eng}: ${hasFloor?'✅ 有 floor:cf':'❌ 无 floor:cf'}`);
  
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + `\\fp_${eng}.js`;
    fs.writeFileSync(tmp, m[1], 'utf-8');
    try {
      require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' });
    } catch(e) {
      console.log(`${eng}: ❌ JS语法`);
    }
  }
});
