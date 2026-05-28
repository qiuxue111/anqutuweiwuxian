const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // 精确替换 ",floor:cf" 为空
  c = c.split(",floor:cf").join("");
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(`${eng}: ✅`);
});

// 验证
['beishan','armory','airport','tvstation','farm','valley'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("supabase('pending_pins'");
  const post = c.substring(idx, idx + 300);
  console.log(`${eng}: contains floor? ${post.includes('floor')}`);
  
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + '\\fp_' + eng + '.js';
    fs.writeFileSync(tmp, m[1], 'utf-8');
    try {
      require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' });
    } catch(e) { console.log(`${eng}: ❌ JS`); }
  }
});
