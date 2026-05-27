const fs = require('fs');
const files = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
  'F:\\暗区突围网站\\pages\\maps.html',
  'F:\\暗区突围网站\\pages\\map-editor.html',
  'F:\\暗区突围网站\\pages\\weapons.html',
  'F:\\暗区突围网站\\pages\\strategy.html',
  'F:\\暗区突围网站\\pages\\gear.html',
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  const scripts = c.match(/<script>[\s\S]*?<\/script>/g) || [];
  scripts.forEach((s, i) => {
    try {
      new Function(s.replace(/<script>/, '').replace(/<\/script>/, ''));
    } catch (e) {
      console.log(`${f} [script ${i}]: SYNTAX ERROR - ${e.message}`);
      // Show first 100 chars
      console.log('  ' + s.substring(0, 200).replace(/\n/g, '\\n'));
    }
  });
});
console.log('Done checking');
