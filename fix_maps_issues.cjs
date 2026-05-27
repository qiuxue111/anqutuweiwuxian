const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// 1. Remove duplicate login buttons (keep one inside nav-links)
// The gen v2 script added buttons before <ul class="nav-links">, but there might be leftover
// Check how many login buttons exist
var loginCount = c.split('id="loginBtn"').length - 1;
console.log('Login buttons found:', loginCount);
if (loginCount > 1) {
  // Keep only the one in nav-links
  // Find all occurrences and remove extras
  c = c.replace(/\n +<button id="loginBtn"[^<]*<\/button>/g, function(m, offset) {
    // Check if it's before <ul class="nav-links"> (inside navbar) or floating
    var before = c.substring(Math.max(0, offset - 50), offset);
    var afterNavLinks = before.includes('nav-links');
    if (!afterNavLinks) {
      console.log('Removed stray login button at offset', offset);
      return '';
    }
    return m;
  });
}

// 2. Fix 🗺? -> 🗺 (remove stray ? after emoji in map-header)
c = c.replace('🗺?地图攻略', '🗺 地图攻略');

// 3. Remove stray + below "地图攻略" if it's outside of map-detail containers
// Find full context of the header area
var headerEnd = c.indexOf('</div>', c.indexOf('map-header'));
console.log('Header ends at:', headerEnd);

// Look for any stray + buttons outside map-detail
// After the header, there should be the first map-detail
var afterHeader = c.substring(headerEnd, headerEnd + 200);
console.log('After header:', JSON.stringify(afterHeader.substring(0, 150)));

// If there's a stray + outside map-detail, remove it
c = c.replace(/(<div class="map-header">[\s\S]*?<\/div>)\s*<button class="add-video-btn"[^<]*<\/button>\s*/g, '$1\n\n');

// 4. Remove 每张地图的详细点位... text
c = c.replace('<p>每张地图的详细点位、刷新规律、撤离条件一</p>\n', '');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone. Size:', c.length);
console.log('Login buttons remaining:', c.split('id="loginBtn"').length - 1);
console.log('🗺?:', c.includes('🗺?'));
