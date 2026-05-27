const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// For each map section (beishan, valley, armory, farm, airport, tvstation):
// Keep: <div class="map-detail" id="xxx"> + <h2>...</h2> + button
// Remove: map-meta, all map-section divs
// End with: button + </div>

// Strategy: for each map-detail div, find the content after <h2>...</h2> and before the final button

[['beishan', '北山', '中等'], 
 ['valley', '山谷', '困难'],
 ['armory', '军械库', '困难'],
 ['farm', '农场', '简'],
 ['airport', '机场', '中等'],
 ['tvstation', '电视台', '中等']].forEach(([id, name, difficulty]) => {
  // Find the opening tag
  const openTag = `<div class="map-detail" id="${id}">`;
  const openIdx = c.indexOf(openTag);
  if (openIdx < 0) { console.log(`${name}: NOT FOUND`); return; }
  
  // Find the closing </h2>
  const h2Close = c.indexOf('</h2>', openIdx) + 5;
  if (h2Close < 5) { console.log(`${name}: h2 NOT FOUND`); return; }
  
  // Find the button div (the last one in this section)
  const btnStart = c.indexOf('<div style="margin-top:1rem;">', h2Close);
  if (btnStart < 0) { console.log(`${name}: button NOT FOUND`); return; }
  
  // Find the closing </div> of the map-detail
  // After the button, there's: </div>\n    </div> (inner + outer)
  const lastClose = c.indexOf('</div>\n    </div>', btnStart);
  if (lastClose < 0) { console.log(`${name}: closing NOT FOUND`); return; }
  
  // Remove everything between h2 closing and the button
  const before = c.substring(0, h2Close);
  const after = c.substring(btnStart);
  
  c = before + '\n      ' + after;
  console.log(`${name}: simplified (${id})`);
});

// Also fix the empty map-section divs that might remain and collapse whitespace
c = c.replace(/\n +<div class="map-section">\n +<\/div>/g, '');
c = c.replace(/\n{4,}/g, '\n\n\n');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone. Size:', c.length);
