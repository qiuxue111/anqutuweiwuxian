const fs = require('fs');
['review.html','map-farm.html','map-beishan.html','map-valley.html','map-armory.html','map-airport.html','map-tvstation.html'].forEach(f => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${f}`, 'utf-8');
  const m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (m) {
    const tmp = require('os').tmpdir() + `\\${f.replace('.html','')}.js`;
    fs.writeFileSync(tmp, m[1], 'utf-8');
    try {
      require('child_process').execSync('node -c "' + tmp + '"', { stdio: 'pipe' });
      console.log(f + ': ✅');
    } catch(e) {
      console.log(f + ': ❌ JS ERROR');
    }
  }
});
