const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Add supabase script + login check to the head area (before </head>)
// Also add inline JS for video management

const mapNames = {
  beishan: { name: '北山' },
  valley: { name: '山谷' },
  armory: { name: '军械库' },
  farm: { name: '农场' },
  airport: { name: '机场' },
  tvstation: { name: '电视台' }
};

// First: add supabase + login check in head
c = c.replace('</head>', `  <script src="../supabase.js"></script>
  <script>
    let currentUser = null, currentToken = null;

    function initAuth() {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.slice(1));
        const token = params.get('access_token');
        const expiresIn = params.get('expires_in');
        if (token) {
          localStorage.setItem('abi_token', token);
          localStorage.setItem('abi_user', params.get('email') || '');
          window.location.hash = '';
          location.reload();
        }
      }
      const t = localStorage.getItem('abi_token');
      currentToken = t;
      const u = localStorage.getItem('abi_user');
      if (u) currentUser = u;
      if (currentToken) checkVideoAccess();
    }

    function checkVideoAccess() {
      const btn = document.getElementById('videoAdminBtn');
      if (btn) btn.style.display = '';
    }

    function loginGitHub() {
      const { createClient } = supabasejs;
      const supa = createClient('https://hanrfbciinkhgcumvous.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok');
      supa.auth.signInWithOAuth({ provider: 'github' });
    }
  </script>
</head>`);

// After navbar, add video admin button (only visible when logged in)
c = c.replace('<ul class="nav-links">',
  `<span style="position:relative;">
    <button id="videoAdminBtn" onclick="toggleVideoPanel()" style="display:none;margin-left:0.5rem;padding:0.25rem 0.6rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;">管理视频</button>
    <button id="loginBtn" onclick="loginGitHub()" style="padding:0.25rem 0.6rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;">登录</button>
  </span>
  <ul class="nav-links">`);

// Add video panel HTML before footer
c = c.replace('<footer>', `<div id="videoPanel" style="display:none;margin-top:2rem;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">
  <h3 style="color:#ffc832;margin-bottom:1rem;">管理地图视频</h3>
  <div id="videoMapBtns" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;"></div>
  <div id="videoForm" style="display:none;">
    <p style="color:#ccc;margin-bottom:0.5rem;">粘贴 B站视频链接：</p>
    <input id="videoUrlInput" type="url" placeholder="https://www.bilibili.com/video/BV..." style="width:100%;padding:0.5rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:6px;margin-bottom:0.5rem;">
    <div id="videoPreview" style="display:none;padding:0.5rem;background:#1a1a22;border-radius:8px;margin-bottom:0.5rem;">
      <img id="previewCover" style="width:160px;border-radius:4px;">
      <p id="previewTitle" style="color:#fff;margin:0.5rem 0 0;font-size:0.85rem;"></p>
    </div>
    <div style="display:flex;gap:0.5rem;">
      <button onclick="fetchBilibiliInfo()" style="padding:0.4rem 1rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:6px;cursor:pointer;">预览</button>
      <button onclick="saveVideo()" style="padding:0.4rem 1rem;background:#0a0a0f;color:#ffc832;border:1px solid #ffc832;border-radius:6px;cursor:pointer;">保存</button>
      <button onclick="closeVideoForm()" style="padding:0.4rem 1rem;background:#333;color:#ccc;border:none;border-radius:6px;cursor:pointer;">取消</button>
    </div>
  </div>
  <div id="selectedMapName" style="display:none;color:#888;font-size:0.85rem;margin-bottom:0.5rem;"></div>
  <div id="videoListContainer"></div>
</div>

<footer>`);

// For each map detail, add a + button and video list container right before the mapView button
// We'll use the unique map-detail id reference
Object.entries(mapNames).forEach(([id, info]) => {
  const tagPattern = `id="${id}">`;
  const tagIdx = c.indexOf(tagPattern);
  if (tagIdx < 0) return;
  
  const mapViewStart = c.indexOf('map-' + id + '.html', tagIdx);
  const mapViewEnd = c.indexOf('</a>', mapViewStart);
  
  if (mapViewStart >= 0 && mapViewEnd >= 0) {
    // Insert video section after the button's </a>
    // Find the closing </div> of the button div
    const btnDivClose = c.indexOf('</div>', mapViewEnd);
    
    // Insert video container after btnDivClose but before the primary </div>
    // Actually insert right before the button's <div>
    const btnDiv = c.lastIndexOf('<div style="margin-top', mapViewStart);
    
    const videoHtml = `\n      <div class="map-videos" id="videos-${id}"></div>
      <div style="margin-top:0.5rem;">
        <button class="add-video-btn" onclick="openVideoForm('${id}','${info.name}')" style="width:32px;height:32px;border-radius:50%;background:#1a1a22;color:#ffc832;border:1px solid #333;font-size:1.2rem;cursor:pointer;line-height:1;">+</button>
      </div>
      `;
    
    c = c.substring(0, btnDiv) + videoHtml + c.substring(btnDiv);
  }
});

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify
console.log('Done. Size:', c.length);
['beishan','valley','armory','farm','airport','tvstation'].forEach(id => {
  const hasAddBtn = c.includes(`openVideoForm('${id}'`);
  const hasVideos = c.includes(`id="videos-${id}"`);
  console.log(`  ${id}: addBtn=${hasAddBtn}, videoContainer=${hasVideos}`);
});
