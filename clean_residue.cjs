const fs = require('fs');

function cleanResidue(fp) {
  let c = fs.readFileSync(fp, 'utf8');
  
  // Find the specific residue pattern: after document.addEventListener, there's a stray login function
  const marker = 'document.addEventListener';
  const markerIdx = c.indexOf(marker);
  
  if (markerIdx > 0) {
    // Find the end of this script block
    const scriptCloseIdx = c.indexOf('</script>', markerIdx);
    if (scriptCloseIdx > markerIdx) {
      const residue = c.substring(markerIdx, scriptCloseIdx);
      console.log(fp + ' residue:', JSON.stringify(residue).substring(0, 200));
      
      // Keep only up to the document.addEventListener line
      const addEventLineEnd = c.indexOf('\n', markerIdx);
      const cleanContent = c.substring(markerIdx, addEventLineEnd);
      
      c = c.substring(0, markerIdx) + cleanContent + '\n' + c.substring(scriptCloseIdx);
    }
  }
  
  fs.writeFileSync(fp, c);
  console.log(fp + ': cleaned');
}

cleanResidue('F:\\暗区突围网站\\index.html');
cleanResidue('F:\\暗区突围网站\\search.html');

// Validate
['F:\\暗区突围网站\\index.html','F:\\暗区突围网站\\search.html'].forEach(fp => {
  const c = fs.readFileSync(fp, 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach(s => {
    try { new Function(s.replace('<script>','').replace('</script>','')); console.log(fp + ': valid'); }
    catch(e) { console.log(fp + ': STILL ERROR - ' + e.message.substring(0,80)); }
  });
});
