const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// 1. Fix 军械? -> 军械库 (the h2 title)
c = c.replace('军械?<span', '军械库<span');

// 2. Add style for video containers
c = c.replace('</head>', `<style>
  .map-videos { display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.5rem; }
  .map-video-card {
    display:inline-flex; align-items:center; gap:0.4rem;
    padding:0.3rem 0.5rem; background:#1a1a22; border-radius:6px;
    text-decoration:none; color:#ccc; font-size:0.78rem; max-width:200px;
  }
  .map-video-card:hover { background:#2a2a32; }
  .map-video-card img { width:48px; height:30px; border-radius:4px; object-fit:cover; }
  .map-video-card span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .add-video-btn {
    width:28px; height:28px; border-radius:50%;
    background:#252530; color:#ffc832;
    border:1px solid #333; font-size:1.1rem;
    cursor:pointer; line-height:1; transition:0.2s;
  }
  .add-video-btn:hover { background:#333; border-color:#ffc832; }
</style>
</head>`);

// 3. For each map section, insert video container + add button
// Each map-detail div now has: <h2>...</h2> + (some whitespace) + <div style="margin-top:1rem;"><a href="map-xxx.html"...>...</a></div>\n    </div>
// We need to insert before the </div> that closes map-detail

const mapIds = ['beishan', 'valley', 'armory', 'farm', 'airport', 'tvstation'];
const mapNames = { beishan:'北山', valley:'山谷', armory:'军械库', farm:'农场', airport:'机场', tvstation:'电视台' };

mapIds.forEach(id => {
  // Find the closing </div> of this map-detail
  // Pattern: after the action button </a>, then </div>\n    </div>
  const detailStart = c.indexOf(`<div class="map-detail" id="${id}">`);
  if (detailStart < 0) { console.log(`${id}: not found`); return; }
  
  const closeIdx = c.indexOf('</div>', detailStart + 200);
  // Actually find the LAST </div> in this section - the closing of map-detail
  // There's only one inner </div> (the button div), so the second </div> is the close
  let pos = detailStart, depth = 0;
  for (let i = detailStart; i < c.length; i++) {
    if (c.substring(i, i+5) === '<div ') { depth++; i += 4; }
    else if (c.substring(i, i+6) === '</div>') {
      depth--;
      if (depth < 0) {
        // This is the map-detail </div>
        const insertHtml = `\n      <div class="map-videos" id="videos-${id}"></div>
      <div style="margin-top:0.5rem;">
        <button class="add-video-btn" onclick="openVideoForm('${id}','${mapNames[id]}')" title="添加B站视频">+</button>
      </div>
    `;
        c = c.substring(0, i) + insertHtml + c.substring(i);
        console.log(`${id}: inserted at ${i}`);
        break;
      }
    }
  }
});

// 4. Add supabase script + auth + video JS before </body>
c = c.replace('</body>', `<script src="../supabase.js"></script>
<script>
  let currentUser = null, currentToken = null, selectedMapId = null;

  function initAuth() {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.slice(1));
      const token = params.get('access_token');
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
    if (currentToken) {
      const btn = document.getElementById('videoAdminBtn');
      if (btn) btn.style.display = '';
      const loginBtn = document.getElementById('loginBtn');
      if (loginBtn) loginBtn.style.display = 'none';
    }
    loadAllVideos();
  }

  function loginGitHub() {
    const { createClient } = supabasejs;
    const supa = createClient('https://hanrfbciinkhgcumvous.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok');
    supa.auth.signInWithOAuth({ provider: 'github' });
  }

  function toggleVideoPanel() {
    const p = document.getElementById('videoPanel');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
    if (p.style.display === 'block') renderVideoAdmin();
  }

  function openVideoForm(mapId, mapName) {
    selectedMapId = mapId;
    document.getElementById('selectedMapName').textContent = '添加视频到：' + mapName;
    document.getElementById('selectedMapName').style.display = '';
    document.getElementById('videoForm').style.display = 'block';
    document.getElementById('videoUrlInput').value = '';
    document.getElementById('videoPreview').style.display = 'none';
    document.getElementById('videoUrlInput').focus();
  }

  function closeVideoForm() {
    document.getElementById('videoForm').style.display = 'none';
    document.getElementById('selectedMapName').style.display = 'none';
  }

  function extractBVID(url) {
    var m = url.match(/(?:bilibili\\\\.com\\\\/video\\\\/)?(BV[a-zA-Z0-9]+)/i);
    return m ? m[1] : null;
  }

  async function fetchBilibiliInfo() {
    var url = document.getElementById('videoUrlInput').value.trim();
    if (!url) { alert('请输入B站视频链接'); return; }
    var bvid = extractBVID(url);
    if (!bvid) { alert('无法识别BV号'); return; }
    document.getElementById('videoPreview').style.display = 'none';
    try {
      var res = await fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid);
      var data = await res.json();
      if (data.code !== 0) { alert('获取失败: ' + data.message); return; }
      var v = data.data;
      document.getElementById('previewCover').src = v.pic;
      document.getElementById('previewTitle').textContent = v.title;
      document.getElementById('videoPreview').style.display = 'block';
      var inp = document.getElementById('videoUrlInput');
      inp.dataset.bvid = bvid;
      inp.dataset.cover = v.pic;
      inp.dataset.title = v.title;
    } catch(e) { alert('获取失败，请确认链接正确'); }
  }

  function supa(method, table, body, q) {
    var token = localStorage.getItem('abi_token');
    var anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
    var bearer = anonKey;
    if (token) {
      try {
        var payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) bearer = token;
      } catch(e) {}
    }
    var url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/' + table + (q ? '?' + q : '');
    return fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + bearer,
        'apiKey': anonKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: body ? JSON.stringify(body) : null
    });
  }

  async function saveVideo() {
    if (!selectedMapId) { alert('请选择地图'); return; }
    var inp = document.getElementById('videoUrlInput');
    var url = inp.value.trim();
    var bvid = inp.dataset.bvid;
    var title = inp.dataset.title;
    var cover = inp.dataset.cover;
    if (!bvid || !title) { alert('请先预览获取信息'); return; }
    try {
      var r = await supa('POST', 'map_videos', { map_name: selectedMapId, bvid: bvid, url: url, title: title, cover: cover });
      if (r.ok || r.status === 201) {
        alert('已添加');
        closeVideoForm();
        loadAllVideos();
        if (document.getElementById('videoPanel').style.display === 'block') renderVideoAdmin();
      } else {
        var t = await r.text();
        alert('保存失败: ' + t);
      }
    } catch(e) { alert('保存失败'); }
  }

  async function deleteVideo(id) {
    if (!confirm('确定删除该视频？')) return;
    try {
      var r = await supa('DELETE', 'map_videos', null, 'id=eq.' + id);
      if (r.ok || r.status === 204) {
        loadAllVideos();
        if (document.getElementById('videoPanel').style.display === 'block') renderVideoAdmin();
      } else { var t = await r.text(); alert('删除失败: ' + t); }
    } catch(e) { alert('删除失败'); }
  }

  async function loadAllVideos() {
    try {
      var r = await supa('GET', 'map_videos', null, 'order=created_at.desc');
      if (!r.ok) return;
      var videos = await r.json();
      if (!Array.isArray(videos)) return;
      var grouped = {};
      ['beishan','valley','armory','farm','airport','tvstation'].forEach(function(k) { grouped[k] = []; });
      videos.forEach(function(v) { var mk = v.map_name || 'farm'; if (grouped[mk]) grouped[mk].push(v); });
      Object.entries(grouped).forEach(function(e) {
        var list = e[1], mapId = e[0];
        var container = document.getElementById('videos-' + mapId);
        if (!container) return;
        container.innerHTML = list.map(function(v) {
          return '<a href="' + v.url + '" target="_blank" class="map-video-card">' +
            (v.cover ? '<img src="' + v.cover + '" onerror="this.style.display=\'none\'">' : '') +
            '<span>' + (v.title || 'B站视频') + '</span></a>';
        }).join('');
      });
    } catch(e) {}
  }

  async function renderVideoAdmin() {
    try {
      var r = await supa('GET', 'map_videos', null, 'order=created_at.desc');
      if (!r.ok) { document.getElementById('videoListContainer').innerHTML = '<p style="color:#888;">加载失败</p>'; return; }
      var videos = await r.json();
      if (!Array.isArray(videos)) return;
      var mapNames = { beishan:'北山', valley:'山谷', armory:'军械库', farm:'农场', airport:'机场', tvstation:'电视台' };
      var grouped = {};
      Object.keys(mapNames).forEach(function(k) { grouped[k] = []; });
      videos.forEach(function(v) { var mk = v.map_name || 'farm'; if (grouped[mk]) grouped[mk].push(v); });
      document.getElementById('videoMapBtns').innerHTML = Object.entries(mapNames).map(function(e) {
        var k = e[0], n = e[1];
        return '<button onclick="openVideoForm(\'' + k + '\',\'' + n + '\')" style="padding:0.3rem 0.8rem;background:#1a1a22;color:#ffc832;border:1px solid #333;border-radius:6px;cursor:pointer;">+' + n + '</button>';
      }).join('');
      var html = Object.entries(grouped).map(function(e) {
        var mapId = e[0], list = e[1];
        if (list.length === 0) return '';
        return '<div style="margin-bottom:0.8rem;"><p style="color:#ffc832;font-size:0.85rem;margin-bottom:0.3rem;">' + mapNames[mapId] + '</p>' +
          list.map(function(v) {
            return '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.5rem;background:#1a1a22;border-radius:6px;margin-bottom:0.3rem;">' +
              (v.cover ? '<img src="' + v.cover + '" style="width:64px;height:40px;border-radius:4px;object-fit:cover;">' : '') +
              '<span style="flex:1;color:#ccc;font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + v.title + '</span>' +
              '<button onclick="deleteVideo(' + v.id + ')" style="flex-shrink:0;padding:0.15rem 0.5rem;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem;">删除</button></div>';
          }).join('') + '</div>';
      }).join('');
      document.getElementById('videoListContainer').innerHTML = html || '<p style="color:#666;font-size:0.85rem;">暂无视频</p>';
    } catch(e) { document.getElementById('videoListContainer').innerHTML = '<p style="color:#888;">加载失败</p>'; }
  }

  document.addEventListener('DOMContentLoaded', initAuth);
</script>
</body>`);

// 5. Add auth buttons in navbar
c = c.replace('<ul class="nav-links">',
  '<button id="videoAdminBtn" onclick="toggleVideoPanel()" style="display:none;padding:0.2rem 0.5rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">管理视频</button>\n' +
  '<button id="loginBtn" onclick="loginGitHub()" style="padding:0.2rem 0.5rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">登录</button>\n' +
  '<ul class="nav-links">');

// 6. Add video panel before footer
c = c.replace('<footer>',
  '<div id="videoPanel" style="display:none;margin-top:2rem;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">\n' +
  '  <h3 style="color:#ffc832;margin-bottom:1rem;">管理地图视频</h3>\n' +
  '  <div id="videoMapBtns" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;"></div>\n' +
  '  <div id="videoForm" style="display:none;">\n' +
  '    <p style="color:#ccc;margin-bottom:0.5rem;">粘贴B站视频链接：</p>\n' +
  '    <input id="videoUrlInput" type="url" placeholder="https://www.bilibili.com/video/BV..." style="width:100%;padding:0.5rem;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:6px;margin-bottom:0.5rem;">\n' +
  '    <div id="videoPreview" style="display:none;padding:0.5rem;background:#1a1a22;border-radius:8px;margin-bottom:0.5rem;">\n' +
  '      <img id="previewCover" style="width:160px;border-radius:4px;">\n' +
  '      <p id="previewTitle" style="color:#fff;margin:0.5rem 0 0;font-size:0.85rem;"></p>\n' +
  '    </div>\n' +
  '    <div style="display:flex;gap:0.5rem;">\n' +
  '      <button onclick="fetchBilibiliInfo()" style="padding:0.4rem 1rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:6px;cursor:pointer;">预览</button>\n' +
  '      <button onclick="saveVideo()" style="padding:0.4rem 1rem;background:#0a0a0f;color:#ffc832;border:1px solid #ffc832;border-radius:6px;cursor:pointer;">保存</button>\n' +
  '      <button onclick="closeVideoForm()" style="padding:0.4rem 1rem;background:#333;color:#ccc;border:none;border-radius:6px;cursor:pointer;">取消</button>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '  <p id="selectedMapName" style="display:none;color:#888;font-size:0.85rem;margin-bottom:0.5rem;"></p>\n' +
  '  <div id="videoListContainer"></div>\n' +
  '</div>\n\n<footer>');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify
console.log('Size:', c.length);
['beishan','valley','armory','farm','airport','tvstation'].forEach(id => {
  const videosDiv = c.includes('id="videos-' + id + '"');
  const addBtn = c.includes("openVideoForm('" + id);
  console.log('  ' + id + ': videos=' + videosDiv + ', +btn=' + addBtn);
});
console.log('军械库:', c.includes('军械库<span'));
