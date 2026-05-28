const fs = require('fs');
['farm','valley'].forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  
  // 补上 floor:cf
  // 原: {name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[]}
  // 改: {name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],floor:cf}
  const oldPost = "{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[]}";
  const newPost = "{name:tp,x:x,y:y,map_name:mapNameCN,type:type,ic:'',note:'',images:[],floor:cf}";
  
  if (c.indexOf(oldPost) >= 0) {
    c = c.replace(oldPost, newPost);
    fs.writeFileSync(fp, c, 'utf-8');
    console.log(`${eng}: ✅ 补上 floor`);
  } else if (c.indexOf(oldPost.replace("[]","[]")) >= 0) {
    console.log(`${eng}: ✅ 已经存在 floor`);
  } else {
    console.log(`${eng}: ⚠️ 格式不匹配`);
  }
});

// 验证
['farm','valley'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('pending_pins');
  const post = c.substring(idx-5, idx+280);
  console.log(`${eng} POST包含 floor: ${post.includes('floor:cf')?'✅':'❌'}`);
  
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
