const fs = require('fs');
const { execSync } = require('child_process');

// Base: latest clean commit
const buf = execSync('git -C "F:\\暗区突围网站" show ad6da02:pages/maps.html', {encoding: 'buffer'});
let c = buf.toString('utf8');
console.log('Base size:', c.length);

// Step 1: Remove the stray videos-beishan + button that's before the first map-detail
const headerEnd = c.indexOf('">\n      <h1');
const h1End = c.indexOf('</h1>', headerEnd);
const firstDetail = c.indexOf('class="map-detail"', h1End);
const straySection = c.substring(h1End + 5, firstDetail).trim();
console.log('Stray section found:', straySection.substring(0, 200));

// Remove everything between </h1> and the first map-detail
const afterH1 = c.indexOf('\n', h1End) + 1;
const beforeFirstDetail = firstDetail - 12; // jump back to '<div class='
c = c.substring(0, afterH1) + c.substring(beforeFirstDetail);
console.log('After removal, size:', c.length);

// Step 2: For each map, insert videos container + button BEFORE the map-detail closing </div>
const maps = [
  { id: 'beishan', name: '北山' },
  { id: 'valley', name: '山谷' },
  { id: 'armory', name: '军械库' },
  { id: 'farm', name: '农场' },
  { id: 'airport', name: '机场' },
  { id: 'tvstation', name: '电视台' }
];

maps.forEach(m => {
  const detailOpen = '<div class="map-detail" id="' + m.id + '">';
  const detailStart = c.indexOf(detailOpen);
  if (detailStart < 0) { console.log(m.id + ': detail not found'); return; }

  // From detail start, find the outer </div> that closes map-detail
  // Inner structure: <h2>...</h2> <br> <div class="map-videos" id="videos-xxx"> and <button class="add-video-btn"> was supposed to be here
  // Actually there's no videos/button yet because we removed them. So structure is:
  // <div class="map-detail" id="xxx"><h2>...
  // </h2>
  //
  // <div style="margin-top:1rem;">...查看交互地图</a>
  //      </div>
  //    </div>

  // Find the button div closing </div> and the map-detail closing
  const btnDivClose = c.indexOf('查看交互地图</a>', detailStart);
  if (btnDivClose < 0) { console.log(m.id + ': button not found'); return; }
  // After the </a> is: \n      </div>\n    </div>
  const innerDivClose = c.indexOf('</div>', btnDivClose);
  const outerDivClose = c.indexOf('</div>', innerDivClose + 6);

  if (outerDivClose < 0) { console.log(m.id + ': outer close not found'); return; }

  const insertHtml =
    '      </div>\n' + // close the button's div
    '      <div class="map-videos" id="videos-' + m.id + '"></div>\n' +
    '      <div style="margin-top:0.5rem;">\n' +
    "        <button class=\"add-video-btn\" onclick=\"openVideoForm('" + m.id + "','" + m.name + "')\" title=\"添加B站视频\">+</button>\n" +
    '      </div>\n    </div>';  // close map-detail

  // Replace from btnDivClose to outerDivClose + 6
  c = c.substring(0, btnDivClose) + insertHtml + c.substring(outerDivClose + 6);
  console.log(m.id + ': OK');
});

// Fix the login btn display: both should be display:none by default
// Actually the navbar code added the buttons with correct styles already

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone. Size:', c.length);

// Verify
maps.forEach(m => {
  const hasVideos = c.includes('id="videos-' + m.id + '"');
  const hasBtn = c.includes("openVideoForm('" + m.id);
  console.log('  ' + m.id + ': videos=' + hasVideos + ', btn=' + hasBtn);
});
console.log('loginBtn HTML:', c.split('<button id="loginBtn"').length - 1);
console.log('videoAdminBtn HTML:', c.split('<button id="videoAdminBtn"').length - 1);

// Find any stray + buttons in non-map-detail regions
// Check all class="add-video-btn" in HTML
let strayCount = 0;
let idx = 0;
while ((idx = c.indexOf('class="add-video-btn"', idx)) >= 0) {
  const before = c.substring(0, idx);
  const inScript = before.lastIndexOf('<script') > before.lastIndexOf('</script>');
  if (!inScript) {
    // Check if inside a map-detail
    const inDetail = before.lastIndexOf('map-detail') > before.lastIndexOf('</div>');
    if (!inDetail) {
      strayCount++;
      console.log('STRAY button at', idx);
    }
  }
  idx++;
}
console.log('Stray + buttons:', strayCount);
