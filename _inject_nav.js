var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

var target = '<span style="color:#888;font-size:0.9rem;">→</span>\r\n    </div>\r\n  </a>\r\n\r\n</div>';

var mapNav = '\r\n\r\n  <!-- 战术交互地图导航 -->\r\n  <div class="enter-fade enter-delay-10" style="margin-top:1rem;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px;">\r\n    <div style="color:var(--accent);font-size:1rem;font-weight:600;margin-bottom:10px;">\u{1F5FA}\uFE0F 战术交互地图</div>\r\n    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">\r\n      <a href="pages/map-farm.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u{1F33E}</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">农场</span>\r\n      </a>\r\n      <a href="pages/map-beishan.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u{1F3D4}\uFE0F</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">北山</span>\r\n      </a>\r\n      <a href="pages/map-tvstation.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u{1F4FA}</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">电视台</span>\r\n      </a>\r\n      <a href="pages/map-armory.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u{1F52B}</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">军械库</span>\r\n      </a>\r\n      <a href="pages/map-valley.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u{1F3DE}\uFE0F</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">山谷</span>\r\n      </a>\r\n      <a href="pages/map-airport.html" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\r\n        <span style="font-size:1.2rem;">\u2708\uFE0F</span>\r\n        <span style="color:var(--text-body);font-size:0.9rem;">机场</span>\r\n      </a>\r\n    </div>\r\n  </div>';

if (c.indexOf(target) >= 0) {
  c = c.replace(target, target + mapNav);
  console.log('map nav injected');
} else {
  console.log('target not found, trying fallback');
  // fallback: find by keyword
  var idx = c.indexOf('全地图赛季任务一目了然');
  if (idx >= 0) {
    var endIdx = c.indexOf('</div>', idx + 50);
    endIdx = c.indexOf('</div>', endIdx + 6);
    endIdx = c.indexOf('</div>', endIdx + 6);
    endIdx = c.indexOf('</div>', endIdx + 6);
    c = c.substring(0, endIdx + 6) + mapNav + c.substring(endIdx + 6);
    console.log('map nav injected (fallback)');
  }
}

fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('Done, size:', c.length);
