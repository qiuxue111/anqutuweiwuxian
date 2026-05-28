const fs = require('fs');

const fixes = {
  'farm': false,
  'valley': false,
  'beishan': true,
  'armory': true,
  'airport': true,
  'tvstation': true
};

Object.keys(fixes).forEach(eng => {
  const fp = `F:\\暗区突围网站\\pages\\map-${eng}.html`;
  let c = fs.readFileSync(fp, 'utf-8');
  const hasFloor = fixes[eng];
  
  // 替换删除POST
  const oldPost = "{pin_id:p.id,name:p.name,x:x,y:y,submitted_by:uname,type:p.type||'',ic:p.ic||''}";
  let newPost = "{pin_id:p.id,name:p.name,x:x,y:y,submitted_by:uname,type:p.type||'',ic:p.ic||'',map_name:mapNameCN}";
  if (hasFloor) newPost = newPost.slice(0, -1) + ",floor:cf}";
  
  c = c.replace(oldPost, newPost);
  fs.writeFileSync(fp, c, 'utf-8');
  
  // 验证
  const check = fs.readFileSync(fp, 'utf-8');
  const idx = check.indexOf("deletion_requests','POST'");
  const end = check.indexOf("})", idx);
  const block = check.substring(idx, end + 3);
  const ok = (hasFloor ? block.includes('floor') : true) && block.includes('map_name');
  console.log(`${eng}: ${ok?'✅':'❌'} - ${block.substring(0, 100)}`);
  
  // JS验证
  const m = check.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + `\\del_${eng}.js`;
    fs.writeFileSync(tmp, m[1], 'utf-8');
    try { require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' }); }
    catch(e) { console.log(`${eng}: ❌ JS`); }
  }
});
