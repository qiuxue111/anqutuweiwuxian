const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Replace the init function with full video logic
// Find the script block after supabase import and replace it
const scriptStart = 'function initAuth() {';
const scriptEnd = '  </script>';

const fullJS = `    let currentUser = null, currentToken = null, selectedMapId = null;

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

      // Highlight map buttons
      document.querySelectorAll('#videoMapBtns button').forEach(b => b.style.background = '#1a1a22');
    }

    function closeVideoForm() {
      document.getElementById('videoForm').style.display = 'none';
      document.getElementById('selectedMapName').style.display = 'none';
    }

    function extractBVID(url) {
      const m = url.match(/(?:bilibili\\.com\\/video\\/)?(BV[a-zA-Z0-9]+)/i);
      return m ? m[1] : null;
    }

    async function fetchBilibiliInfo() {
      const url = document.getElementById('videoUrlInput').value.trim();
      if (!url) { alert('请输入B站视频链接'); return; }
      const bvid = extractBVID(url);
      if (!bvid) { alert('无法识别BV号'); return; }

      document.getElementById('videoPreview').style.display = 'none';

      try {
        const res = await fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid);
        const data = await res.json();
        if (data.code !== 0) { alert('获取视频信息失败: ' + data.message); return; }

        const v = data.data;
        const title = v.title;
        const cover = v.pic;
        const aid = v.aid;

        document.getElementById('previewCover').src = cover;
        document.getElementById('previewTitle').textContent = title;
        document.getElementById('videoPreview').style.display = 'block';
        document.getElementById('videoUrlInput').dataset.aid = aid;
        document.getElementById('videoUrlInput').dataset.bvid = bvid;
        document.getElementById('videoUrlInput').dataset.cover = cover;
        document.getElementById('videoUrlInput').dataset.title = title;
      } catch(e) {
        alert('获取视频信息失败，请确保链接正确');
      }
    }

    function supabase(method, table, body, q) {
      const token = localStorage.getItem('abi_token');
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
      let useToken = token;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp && payload.exp * 1000 > Date.now()) { /* valid */ }
          else { useToken = null; }
        } catch(e) { useToken = null; }
      }
      const bearer = useToken || anonKey;
      const url = 'https://hanrfbciinkhgcumvous.supabase.co/rest/v1/' + table + (q ? '?' + q : '');
      return fetch(url, {
        method: method,
        headers: {
          'Authorization': 'Bearer ' + bearer,
          'apiKey': anonKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: body ? JSON.stringify(body) : undefined
      });
    }

    async function saveVideo() {
      if (!selectedMapId) { alert('请选择地图'); return; }
      const inp = document.getElementById('videoUrlInput');
      const url = inp.value.trim();
      const bvid = extractBVID(url) || inp.dataset.bvid;
      const title = inp.dataset.title;
      const cover = inp.dataset.cover;

      if (!bvid || !title) { alert('请先点击预览获取视频信息'); return; }

      const video = {
        map_name: selectedMapId,
        bvid: bvid,
        url: url,
        title: title,
        cover: cover,
        created_by: currentUser || 'admin'
      };

      try {
        const r = await supabase('POST', 'map_videos', video);
        if (r.ok || r.status === 201) {
          alert('视频已添加');
          closeVideoForm();
          loadVideosForMap(selectedMapId);
          if (document.getElementById('videoPanel').style.display === 'block') renderVideoAdmin();
        } else {
          const t = await r.text();
          alert('保存失败: ' + t);
        }
      } catch(e) {
        alert('保存失败');
      }
    }

    async function deleteVideo(id) {
      if (!confirm('确定删除该视频？')) return;
      try {
        const r = await supabase('DELETE', 'map_videos', null, 'id=eq.' + id);
        if (r.ok || r.status === 204) {
          loadAllVideos();
          if (document.getElementById('videoPanel').style.display === 'block') renderVideoAdmin();
        } else {
          const t = await r.text();
          alert('删除失败: ' + t);
        }
      } catch(e) {
        alert('删除失败');
      }
    }

    async function loadAllVideos() {
      try {
        const r = await supabase('GET', 'map_videos', null, 'order=created_at.desc');
        if (!r.ok) return;
        const videos = await r.json();
        if (!Array.isArray(videos)) return;

        const grouped = {};
        ['beishan','valley','armory','farm','airport','tvstation'].forEach(k => grouped[k] = []);

        videos.forEach(v => {
          const mk = v.map_name || 'farm';
          if (grouped[mk]) grouped[mk].push(v);
        });

        Object.entries(grouped).forEach(([mapId, list]) => {
          const container = document.getElementById('videos-' + mapId);
          if (!container) return;
          if (list.length === 0) { container.innerHTML = ''; return; }
          container.innerHTML = list.map(v => '<a href="' + v.url + '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:0.4rem;margin:0.2rem;padding:0.25rem 0.5rem;background:#1a1a22;border-radius:6px;text-decoration:none;color:#ccc;font-size:0.78rem;max-width:180px;">' +
            (v.cover ? '<img src="' + v.cover + '" style="width:48px;height:30px;border-radius:4px;object-fit:cover;" onerror="this.style.display=\'none\'">' : '') +
            '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (v.title || 'B站视频') + '</span>' +
            '<span style="color:#666;font-size:0.7rem;">→</span>' +
            '</a>').join('');
        });
      } catch(e) {}
    }

    function loadVideosForMap(mapId) {
      loadAllVideos();
    }

    async function renderVideoAdmin() {
      try {
        const r = await supabase('GET', 'map_videos', null, 'order=created_at.desc');
        if (!r.ok) { document.getElementById('videoListContainer').innerHTML = '<p style="color:#888;">加载失败</p>'; return; }
        const videos = await r.json();
        if (!Array.isArray(videos)) return;

        const mapNames = { beishan:'北山', valley:'山谷', armory:'军械库', farm:'农场', airport:'机场', tvstation:'电视台' };
        const grouped = {};
        ['beishan','valley','armory','farm','airport','tvstation'].forEach(k => grouped[k] = []);
        videos.forEach(v => { const mk = v.map_name || 'farm'; if (grouped[mk]) grouped[mk].push(v); });

        // Map buttons
        const btnContainer = document.getElementById('videoMapBtns');
        btnContainer.innerHTML = Object.entries(mapNames).map(([k, n]) =>
          '<button onclick="openVideoForm(\'' + k + '\',\'' + n + '\')" style="padding:0.3rem 0.8rem;background:#1a1a22;color:#ffc832;border:1px solid #333;border-radius:6px;cursor:pointer;">+' + n + '</button>'
        ).join('');

        // Video list
        const listContainer = document.getElementById('videoListContainer');
        listContainer.innerHTML = Object.entries(grouped).map(([mapId, list]) => {
          if (list.length === 0) return '';
          return '<div style="margin-bottom:0.8rem;">' +
            '<p style="color:#ffc832;font-size:0.85rem;margin-bottom:0.3rem;">' + mapNames[mapId] + '</p>' +
            list.map(v => '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.5rem;background:#1a1a22;border-radius:6px;margin-bottom:0.3rem;">' +
              (v.cover ? '<img src="' + v.cover + '" style="width:64px;height:40px;border-radius:4px;object-fit:cover;">' : '') +
              '<span style="flex:1;color:#ccc;font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + v.title + '</span>' +
              '<button onclick="deleteVideo(' + v.id + ')" style="flex-shrink:0;padding:0.15rem 0.5rem;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem;">删除</button>' +
            '</div>').join('') + '</div>';
        }).join('') || '<p style="color:#666;font-size:0.85rem;">暂无视频</p>';
      } catch(e) {
        document.getElementById('videoListContainer').innerHTML = '<p style="color:#888;">加载失败</p>';
      }
    }

    document.addEventListener('DOMContentLoaded', initAuth);`;

// Find the initAuth script block and replace everything before </script>
const sIdx = c.indexOf('function initAuth()');
const eIdx = c.indexOf('</script>', sIdx);

if (sIdx >= 0 && eIdx >= 0) {
  c = c.substring(0, sIdx) + fullJS + c.substring(eIdx);
  console.log('Replaced JS block');
}

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done. Size:', c.length);
console.log('Has initAuth:', c.includes('function initAuth()'));
console.log('Has saveVideo:', c.includes('function saveVideo'));
console.log('Has deleteVideo:', c.includes('function deleteVideo'));
