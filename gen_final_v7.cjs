const fs = require('fs');
const { execSync } = require('child_process');

// Get current HEAD version
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Remove stray beishan v1s: find the pattern after </h1> that has videos-beishan
c = c.replace(
  /(<\/h1>)\s*<div class="map-videos" id="videos-beishan">[\s\S]*?<button class="add-video-btn"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*/,
  '$1\n    '
);
console.log('After removing stray beishan block, size:', c.length);

// Now find the 7 nav buttons before map-details — they should NOT have add-video-btn outside
// Build the 6 map sections from scratch
const mapHtml = {
  beishan: '<div class="map-detail" id="beishan">\n      <h2>北山 <span class="badge badge-med">中等</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-beishan.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA 查看交互地图</a>\n      </div>\n      <div class="map-videos" id="videos-beishan"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'beishan\',\'\\u5317\\u5c71\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>',
  valley: '<div class="map-detail" id="valley">\n      <h2>\u5C71\u8C37 <span class="badge badge-hard">\u56F0\u96BE</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-valley.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA \u67E5\u770B\u4EA4\u4E92\u5730\u56FE</a>\n      </div>\n      <div class="map-videos" id="videos-valley"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'valley\',\'\u5C71\u8C37\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>',
  armory: '<div class="map-detail" id="armory">\n      <h2>\u519B\u68B0\u5E93<span class="badge badge-hard">\u56F0\u96BE</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-armory.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA \u67E5\u770B\u4EA4\u4E92\u5730\u56FE</a>\n      </div>\n      <div class="map-videos" id="videos-armory"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'armory\',\'\u519B\u68B0\u5E93\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>',
  farm: '<div class="map-detail" id="farm">\n      <h2><a href="map-farm.html" style="color:#fff;text-decoration:none;">\u519C\u573A</a> <span class="badge badge-easy">\u7B80</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-farm.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA \u67E5\u770B\u4EA4\u4E92\u5730\u56FE</a>\n      </div>\n      <div class="map-videos" id="videos-farm"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'farm\',\'\u519C\u573A\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>',
  airport: '<div class="map-detail" id="airport">\n      <h2>\u673A\u573A <span class="badge badge-med">\u4E2D\u7B49</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-airport.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA \u67E5\u770B\u4EA4\u4E92\u5730\u56FE</a>\n      </div>\n      <div class="map-videos" id="videos-airport"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'airport\',\'\u673A\u573A\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>',
  tvstation: '<div class="map-detail" id="tvstation">\n      <h2>\u7535\u89C6\u53F0 <span class="badge badge-med">\u4E2D\u7B49</span></h2>\n      <div style="margin-top:1rem;">\n        <a href="map-tvstation.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">\uD83D\uDDFA \u67E5\u770B\u4EA4\u4E92\u5730\u56FE</a>\n      </div>\n      <div class="map-videos" id="videos-tvstation"></div>\n      <div style="margin-top:0.5rem;">\n        <button class="add-video-btn" onclick="openVideoForm(\'tvstation\',\'\u7535\u89C6\u53F0\')" title="\u6DFB\u52A0B\u7AD9\u89C6\u9891">+</button>\n      </div>\n    </div>'
};

// Replace each map section
const maps = ['beishan','valley','armory','farm','airport','tvstation'];
maps.forEach(id => {
  // Find the old <div class="map-detail" id="id"> ... </div>
  const openTag = '<div class="map-detail" id="' + id + '">';
  const start = c.indexOf(openTag);
  if (start < 0) { console.log(id + ': NOT FOUND'); return; }
  const end = c.indexOf('</div>\n\n', start + 50);
  const actualEnd = c.indexOf('</div>', end) + 6; // after </div>
  if (actualEnd < 0) { console.log(id + ': end NOT FOUND'); return; }
  
  c = c.substring(0, start) + mapHtml[id] + c.substring(actualEnd);
  console.log(id + ': replaced');
});

// Remove stray beishan blocks that escaped
c = c.replace(/<div class="map-videos" id="videos-beishan">[\s\S]*?<\/div>\s*<\/div>\s*/, '');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone. Size:', c.length);

// Verify with a quick check
maps.forEach(id => {
  const s = c.indexOf('id="' + id + '"');
  const sec = c.substring(s, s + 500);
  const hasBtn = sec.includes('add-video-btn');
  const hasVideos = sec.includes('videos-' + id);
  const hasMapLink = sec.includes('查看交互地图</a>');
  const closes = (sec.match(/<\/div>/g) || []).length;
  console.log(`  ${id}: btn=${hasBtn}, videos=${hasVideos}, mapLink=${hasMapLink}, closes=${closes}`);
});

// Check no stray buttons before any map-detail
const beforeMaps = c.substring(0, c.indexOf('videos-beishan'));
console.log('Before first map-detail:', beforeMaps.slice(-200).includes('add-video-btn') ? 'HAS STRAY' : 'CLEAN');
