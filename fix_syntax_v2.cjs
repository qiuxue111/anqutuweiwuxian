const fs = require('fs');
['weapons','strategy','gear'].forEach(f => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${f}.html`, 'utf8');
  c = c.replace('window.location.href=u;});}', 'window.location.href=u;}');
  c = c.replace('function init{', 'function init(){');
  
  // Remove all duplicate OAuth handlers between the fab function and init
  // Find the marker
  let idx = c.indexOf('function fabOpenPostForm');
  let idx2 = c.indexOf('function init()', idx);
  if (idx > 0 && idx2 > idx) {
    let before = c.substring(0, idx);
    let after = c.substring(idx2);
    c = before + after;
  }
  
  // Remove stray single `});` lines
  c = c.replace(/\n\s*\}\)\);\s*\n/g, '\n');
  
  fs.writeFileSync(`F:\\暗区突围网站\\pages\\${f}.html`, c);
  console.log(f + ': fixed');
});

// Validate
['weapons','strategy','gear'].forEach(f => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${f}.html`, 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach(s => {
    const code = s.replace('<script>','').replace('</script>','');
    try { new Function(code); } catch(e) {
      console.log(`  ${f}: ERROR - ${e.message}`);
      const lines = code.split('\n');
      const errLine = parseInt(e.message.match(/\d+/)?.[0]) || 0;
      console.log(`    near: ${lines.slice(errLine-2, errLine+2).join('\n    ')}`);
    }
  });
});
