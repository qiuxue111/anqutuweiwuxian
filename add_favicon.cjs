const fs = require('fs'), path = require('path');
const dir = 'F:\\暗区突围网站\\pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.forEach(fn => {
  const fp = path.join(dir, fn);
  let c = fs.readFileSync(fp, 'utf8');
  if (c.includes('favicon.ico')) { console.log(fn + ': already has favicon'); return; }
  c = c.replace('<head>', '<head>\n  <link rel="icon" href="../favicon.ico" type="image/jpeg">');
  fs.writeFileSync(fp, c);
  console.log(fn + ': added favicon');
});
