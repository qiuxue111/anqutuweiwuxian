const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');
const scripts = c.match(/<script>[\s\S]*?<\/script>/g);
scripts.forEach((s, i) => {
  const code = s.replace('<script>','').replace('</script>','');
  try { new Function(code); console.log(`Script ${i}: OK`); }
  catch(e) { console.log(`Script ${i}: ERROR - ${e.message}`); }
});
