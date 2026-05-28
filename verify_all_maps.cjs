const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-'+e+'.html','utf-8');
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + '\\map_' + e + '.js';
    fs.writeFileSync(tmp, m[1], 'utf-8');
    try {
      require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' });
      console.log(e + ': ✅ JS OK');
    } catch(e) {
      console.log(e + ': ❌ JS语法错误');
    }
  }
});
