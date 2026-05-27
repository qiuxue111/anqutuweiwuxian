const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Helper: add view map button before the next map-detail or the editor section
function addMapBtn(searchText, linkHref) {
  const btnHtml = `      <div style="margin-top:1rem;">\n        <a href="${linkHref}" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- `;
  
  // Find the end of the section: </div>\n\n    <!-- next-section -->
  const idx = c.indexOf(searchText);
  if (idx < 0) { console.log('NOT FOUND:', searchText.substring(0,30)); return; }
  
  // Find the closing </div> after the searchText
  const closeDiv = c.indexOf('</div>', idx);
  // Find the next section comment (after the closing </div>)
  let insertAt = c.indexOf('\n    </div>\n\n    <!--', closeDiv);
  if (insertAt < 0) insertAt = c.indexOf('\n    </div>\n\n    <div', closeDiv);
  
  if (insertAt >= 0) {
    c = c.slice(0, insertAt) + btnHtml + c.slice(insertAt + 1); // replace the first \n after </div>
    console.log('Added:', linkHref);
  } else {
    console.log('Could not find insertion point after:', searchText.substring(0,30));
  }
}

// Find each section end and add buttons
// 1. 北山
addMapBtn('夜战模式记得调低亮度设置', 'map-beishan.html');

// 2. 山谷  
addMapBtn('PC 版草丛渲染距离更远', 'map-valley.html');

// 3. 军械库
addMapBtn('建议带夜视仪，地下层光线极暗', 'map-armory.html');

// 4. 港口 -> 机场
addMapBtn('码头方向经常刷撤离点', 'map-airport.html');

// 5. 电视台
addMapBtn('推荐腰射流配', 'map-tvstation.html');

// Rename 港口 to 机场
c = c.replace('<!-- 港口 -->', '<!-- 机场 -->');
c = c.replace('<h2>港口 <span class="badge badge-med">中等</span></h2>', '<h2>机场 <span class="badge badge-med">中等</span></h2>');
c = c.replace('id="port"', 'id="airport"');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done');

// Verify
['farm','beishan','valley','armory','airport','tvstation'].forEach(function(k){
  var cnt = (c.match(new RegExp('map-' + k, 'g')) || []).length;
  console.log('  map-' + k + ': ' + cnt);
});
