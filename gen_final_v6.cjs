const fs = require('fs');
const { execSync } = require('child_process');

const buf = execSync('git -C "F:\\暗区突围网站" show ad6da02:pages/maps.html', {encoding: 'buffer'});
let c = buf.toString('utf8');

// Step 1: Remove the stray beishan block before first map-detail
const h1Close = c.indexOf('</h1>', c.indexOf('map-header'));
const firstDetailOpen = c.indexOf('<div class="map-detail"');
c = c.substring(0, h1Close + 5) + '\n    ' + c.substring(firstDetailOpen);

// Step 2: For each map, insert videos + add-video-btn inside map-detail
const maps = [
  { id: 'beishan', name: '北山' },
  { id: 'valley', name: '山谷' },
  { id: 'armory', name: '军械库' },
  { id: 'farm', name: '农场' },
  { id: 'airport', name: '机场' },
  { id: 'tvstation', name: '电视台' }
];

maps.forEach(m => {
  const marker = '查看交互地图</a>';
  // Find the marker, but SKIP the one in <nav> (logo) 
  let searchFrom = 0;
  let pos;
  // We need to find the occurrence of this exact text within this map-detail section
  // Find the map-detail open
  const detailStart = c.indexOf('id="' + m.id + '">', c.indexOf('map-detail id="' + m.id));
  if (detailStart < 0) { console.log(m.id + ': detail start not found'); return; }
  
  const btnEnd = c.indexOf(marker, detailStart);
  if (btnEnd < 0) { console.log(m.id + ': button not found'); return; }
  
  const afterBtn = btnEnd + marker.length;
  // After </a> we have: \n      </div>\n    </div>
  // Replace the inner close + map-detail close with our insert
  const innerClose = c.indexOf('</div>', afterBtn);
  const outerClose = c.indexOf('</div>', innerClose + 6);
  
  if (outerClose < 0) { console.log(m.id + ': close not found'); return; }
  
  const insert =
    `</a>\n      </div>\n      <div class="map-videos" id="videos-${m.id}"></div>\n` +
    `      <div style="margin-top:0.5rem;">\n` +
    `        <button class="add-video-btn" onclick="openVideoForm('${m.id}','${m.name}')" title="添加B站视频">+</button>\n` +
    `      </div>\n    </div>`;
  
  c = c.substring(0, btnEnd) + insert + c.substring(outerClose + 6);
  console.log(m.id + ': OK');
});

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nSize:', c.length);

// Verify
maps.forEach(m => {
  const start = c.indexOf('id="' + m.id + '"');
  const section = c.substring(start, start + 500);
  const hasVideos = section.includes('videos-' + m.id);
  const hasBtn = section.includes("openVideoForm('" + m.id);
  const hasMapLink = section.includes('查看交互地图</a>');
  const hasClose = section.includes('</div>\n    </div>');
  console.log(`  ${m.id}: videos=${hasVideos}, btn=${hasBtn}, mapLink=${hasMapLink}, close=${hasClose}`);
});

// Check no stray buttons outside map-detail
const strayCheck = c.substring(0, c.indexOf('class="map-detail"'));
console.log('Stray + btn before first map-detail:', strayCheck.includes('add-video-btn'));
