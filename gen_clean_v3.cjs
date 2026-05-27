const fs = require('fs');
const { execSync } = require('child_process');

// Get original simplified version
const buf = execSync('git -C "F:\\暗区突围网站" show a33a391:pages/maps.html', {encoding: 'buffer'});
let c = buf.toString('utf8');

console.log('Base: a33a391, size:', c.length);

// Fix h2
c = c.replace('军械?<span', '军械库<span');
c = c.replace('🗺?查看', '🗺 查看');

// Add styles
c = c.replace('</head>', '<style>\n' +
  '  .map-videos { display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.5rem; }\n' +
  '  .map-video-card {\n' +
  '    display:inline-flex; align-items:center; gap:0.4rem;\n' +
  '    padding:0.3rem 0.5rem; background:#1a1a22; border-radius:6px;\n' +
  '    text-decoration:none; color:#ccc; font-size:0.78rem; max-width:200px;\n' +
  '  }\n' +
  '  .map-video-card:hover { background:#2a2a32; }\n' +
  '  .map-video-card img { width:48px; height:30px; border-radius:4px; object-fit:cover; }\n' +
  '  .add-video-btn {\n' +
  '    width:28px; height:28px; border-radius:50%;\n' +
  '    background:#252530; color:#ffc832;\n' +
  '    border:1px solid #333; font-size:1.1rem;\n' +
  '    cursor:pointer; line-height:1; transition:0.2s;\n' +
  '  }\n' +
  '  .add-video-btn:hover { background:#333; border-color:#ffc832; }\n' +
  '</style>\n</head>');

// For each map, use string replacement on the exact pattern
// Pattern: ...查看交互地图</a>\n      </div>\n    </div>
// Replace with: ...查看交互地图</a>\n      </div>\n      [videos + button]\n    </div>

const mapIds = [
  { id: 'beishan', name: '北山', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 山谷' },
  { id: 'valley', name: '山谷', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 军械库' },
  { id: 'armory', name: '军械库', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 农场' },
  { id: 'farm', name: '农场', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 机场' },
  { id: 'airport', name: '机场', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 电视台' },
  { id: 'tvstation', name: '电视台', btnPattern: '查看交互地图</a>\n      </div>\n    </div>\n\n    ' },  // tvstation is the last, different pattern
];

mapIds.forEach(m => {
  const insertHtml = '查看交互地图</a>\n' +
    '      </div>\n' +
    '      <div class="map-videos" id="videos-' + m.id + '"></div>\n' +
    '      <div style="margin-top:0.5rem;">\n' +
    '        <button class="add-video-btn" onclick="openVideoForm(\\'' + m.id + '\\',\\'' + m.name + '\\')" title="添加B站视频">+</button>\n' +
    '      </div>\n    </div>\n\n    ';
  
  const pattern = m.btnPattern;
  const found = c.includes(pattern);
  if (found) {
    c = c.replace(pattern, insertHtml + '<!-- ' + m.name + (m.id === 'beishan' ? ' --' : '') + '>');
    console.log(m.id + ': replaced OK');
  } else {
    console.log(m.id + ': pattern NOT FOUND');
  }
});

// Actually, the last map (tvstation) has different end pattern. Let's fix differently
// Just find the exact text and replace it

// Remove the extra >\n\n    <! that we created for last map
// Actually this is getting messy. Let me just write the whole file properly.

// At this point the approach is flawed. Let me use a different, simpler one:
// Put the base file first, then do targeted inserts.

console.log('\nSize:', c.length);
fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
