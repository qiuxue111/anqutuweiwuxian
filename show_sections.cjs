const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Show what each map-detail looks like
['beishan','valley','armory','farm','airport','tvstation'].forEach(id => {
  const start = c.indexOf(`id="${id}"`);
  if (start < 0) { console.log(id + ': NOT FOUND'); return; }
  const end = c.indexOf('</div>', start + 200);
  // Find the second </div> (closing map-detail)
  const detailDiv = c.lastIndexOf('<div', end);
  const section = c.substring(start, end + 200);
  console.log(`\n--- ${id} (${section.length} chars) ---`);
  console.log(section);
});
