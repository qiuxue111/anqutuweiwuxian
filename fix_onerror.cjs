const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Fix the broken onerror in loadAllVideos template string
// Original: onerror="this.style.display='none'"
// The single quotes inside the double-quoted attribute break the template literal
c = c.replace(
  `onerror=\\"this.style.display='none'\\"`,
  `onerror='this.style.width=\"0\"'`
);

// Also fix renderVideoAdmin which has the same pattern
c = c.replace(
  `onerror=\\"this.style.display='none'\\"`,
  `onerror='this.style.width=\"0\"'`
);

// Check for other broken patterns
if (c.includes(`onerror=\\"`)) {
  // Use a more aggressive fix
  c = c.replace(/onerror="[^"]*"/g, `onerror='this.style.width="0"'`);
}

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Fixed maps.html onerror');

// Validate the script
const scriptMatch = c.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try { new Function(scriptMatch[1]); console.log('Script validates OK'); }
  catch(e) { console.log('Still has error:', e.message); }
}
