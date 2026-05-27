const fs = require('fs');
const root = 'F:\\暗区突围网站\\v2';

// Create directories
['', 'pages', 'assets'].forEach(function(d) {
  var dir = root + '\\' + d;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});
});

// ==========================================
// SHARED COMPONENTS
// ==========================================

var globalCSS = `/* Reset & base */
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#08080e;color:#ccc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;}
a{color:#ffc832;text-decoration:none;}
a:hover{opacity:0.8;}

/* Floating menu button - upper left, semi-transparent */
#menuBtn{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.08);color:#ccc;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#menuBtn:hover{background:rgba(255,200,50,0.15);color:#ffc832;}

/* Bubble menu */
#bubbleMenu{display:none;position:fixed;top:56px;left:12px;z-index:9998;background:rgba(15,15,24,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:8px;min-width:180px;box-shadow:0 8px 40px rgba(0,0,0,0.6);overflow:hidden;}
#bubbleMenu a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#ccc;border-radius:8px;font-size:0.95rem;transition:all 0.15s;}
#bubbleMenu a:hover{background:rgba(255,200,50,0.08);color:#ffc832;}
#bubbleMenu .sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 8px;}

/* User area - top right */
#userArea{position:fixed;top:12px;right:12px;z-index:9999;display:flex;align-items:center;gap:8px;}
#userName{color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);display:none;}
#loginBtn{padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
#loginBtn:hover{background:rgba(255,200,50,0.25);}

/* Page content area */
.content{padding:60px 16px 20px;max-width:900px;margin:0 auto;}
`;

var globalJS = `
// ===== GLOBAL AUTH =====
function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}

(function(){
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        var uname=payload.preferred_username||payload.user_metadata?.preferred_username||payload.email||'';
        localStorage.setItem('abi_user',uname);
        history.replaceState(null,'',window.location.pathname);
        location.reload();
      }catch(e){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
})();

function toggleMenu(){
  var m=document.getElementById('bubbleMenu');
  if(!m)return;
  m.style.display=m.style.display==='none'?'block':'none';
  // Close on outside click
  if(m.style.display==='block'){
    setTimeout(function(){
      document.addEventListener('click', function closeMenu(e){
        if(!m.contains(e.target) && e.target.id!=='menuBtn'){
          m.style.display='none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 10);
  }
}

function logout(){
  localStorage.removeItem('abi_token');
  localStorage.removeItem('abi_user');
  location.reload();
}

function showUserCenter(){
  toggleMenu();
  var u=localStorage.getItem('abi_user');
  if(!u){alert('请先登录');return;}
  alert('用户: '+u+'\\n(更多功能开发中)');
}
`;

// ==========================================
// SUPABASE HELPER
// ==========================================

var supabaseFn = `
var SUPABASE_URL='https://hanrfbciinkhgcumvous.supabase.co';
var SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
function db(method,table,body,query){
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}
`;

// ==========================================
// BUBBLE MENU HTML (same for all pages)
// ==========================================

function bubbleMenu(currentPage) {
  var links = [
    {href:'index.html', icon:'🏠', label:'首页'},
    {href:'pages/maps.html', icon:'🗺', label:'地图选图'},
    {href:'pages/weapons.html', icon:'🔧', label:'改枪'},
    {href:'pages/strategy.html', icon:'💬', label:'聊天'},
    {href:'pages/gear.html', icon:'📖', label:'攻略'},
    {href:'search.html', icon:'🔍', label:'搜索'},
    {sep:true},
    {onclick:'showUserCenter()', icon:'👤', label:'用户中心'},
    {onclick:'logout()', icon:'🚪', label:'退出登录'},
  ];
  
  var items = links.map(function(l) {
    if (l.sep) return '<div class="sep"></div>';
    if (l.onclick) return '<a href="#" onclick="'+l.onclick+'">'+l.icon+' '+l.label+'</a>';
    return '<a href="'+l.href+'"'+(l.href===currentPage?' style="color:#ffc832;"':'')+'>'+l.icon+' '+l.label+'</a>';
  }).join('');
  
  return `<style>${globalCSS}</style>
<button id="menuBtn" onclick="toggleMenu()">☰</button>
<div id="userArea">
  <span id="userName"></span>
  <button id="loginBtn" onclick="loginGitHub()">登录</button>
</div>
<div id="bubbleMenu">${items}</div>
<div class="content">`;
}

// ==========================================
// PAGE GENERATORS
// ==========================================

function pageHTML(title, headExtra, bodyContent, jsCode, currentPage) {
  var menuNav = '';
  // Pages in root use relative paths, pages in /pages/ use ../
  if (currentPage.indexOf('pages/')===0) {
    menuNav = bubbleMenu(currentPage).replace('href="index.html"','href="../index.html"');
  } else {
    menuNav = bubbleMenu(currentPage);
  }
  
  // Fix page links in nav based on location
  if (currentPage.indexOf('pages/')===0) {
    menuNav = menuNav.replace('href="search.html"', 'href="../search.html"');
    menuNav = menuNav.replace('href="pages/maps.html"', 'href="maps.html"');
    menuNav = menuNav.replace('href="pages/weapons.html"', 'href="weapons.html"');
    menuNav = menuNav.replace('href="pages/strategy.html"', 'href="strategy.html"');
    menuNav = menuNav.replace('href="pages/gear.html"', 'href="gear.html"');
    menuNav = menuNav.replace('href="index.html"', 'href="../index.html"');
  }
  
  var fullJS = supabaseFn + '\n' + globalJS + '\n' + jsCode;
  
  return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'+title+' - 暗区无限攻略站</title>\n'+headExtra+'\n</head>\n<body>\n' + menuNav + '\n' + bodyContent + '\n</div>\n<script>\n' + fullJS + '\n</script>\n</body>\n</html>';
}

// ==========================================
// BUILD ALL PAGES
// ==========================================

// 1. Index page
var indexHTML = pageHTML('首页', '', `
  <h1 style="color:#ffc832;font-size:1.8rem;margin-bottom:0.5rem;">暗区无限攻略站</h1>
  <p style="color:#888;margin-bottom:2rem;">暗区突围：无限 玩家社区</p>

  <div id="hotPosts" style="margin-bottom:2rem;">
    <h2 style="color:#ffc832;font-size:1.1rem;margin-bottom:1rem;">📌 最新帖子</h2>
    <div id="postList" style="display:flex;flex-direction:column;gap:10px;"></div>
  </div>

  <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:2rem;">
    <a href="pages/maps.html" style="flex:1;min-width:120px;padding:16px;background:rgba(20,20,30,0.6);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">🗺 地图选图</a>
    <a href="pages/weapons.html" style="flex:1;min-width:120px;padding:16px;background:rgba(20,20,30,0.6);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">🔧 改枪</a>
    <a href="pages/strategy.html" style="flex:1;min-width:120px;padding:16px;background:rgba(20,20,30,0.6);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">💬 聊天</a>
    <a href="pages/gear.html" style="flex:1;min-width:120px;padding:16px;background:rgba(20,20,30,0.6);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">📖 攻略</a>
  </div>
`, `
async function loadHotPosts(){
  try{
    var r=await db('GET','map_posts',null,'order=created_at.desc&limit=10');
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    var el=document.getElementById('postList');
    if(!posts||posts.length===0){
      el.innerHTML='<div style="text-align:center;color:#555;padding:2rem;">暂无帖子</div>';
      return;
    }
    el.innerHTML=posts.map(function(p){
      var prev=(p.content||'').substring(0,120);
      var cat=p.category||'杂谈';
      var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
      return '<div style="background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px;">'+
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">'+
        '<span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cat+'</span>'+
        '<span style="font-size:0.7rem;color:#555;">'+(p.author||'匿名')+'</span>'+
        '<span style="font-size:0.7rem;color:#444;">'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div style="color:#ddd;font-size:0.95rem;font-weight:500;">'+esc(p.title||'无标题')+'</div>'+
        '<div style="color:#777;font-size:0.8rem;margin-top:4px;">'+esc(prev)+(prev.length>=120?'...':'')+'</div></div>';
    }).join('');
  }catch(e){
    document.getElementById('postList').innerHTML='<div style="text-align:center;color:#555;padding:2rem;">加载失败</div>';
  }
}
function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s||''));return d.innerHTML;}
document.addEventListener('DOMContentLoaded',loadHotPosts);
`, 'index.html');

// 2. Maps page (map selection)
var mapList = [
  {id:'farm', name:'农场', icon:'🌾', desc:'新手首选，资源丰富', url:'map-farm.html'},
  {id:'beishan', name:'北山', icon:'⛰️', desc:'山地战，远程对决', url:'map-beishan.html'},
  {id:'valley', name:'山谷', icon:'🏞️', desc:'峡谷穿梭，近距离', url:'map-valley.html'},
  {id:'armory', name:'军械库', icon:'🏪', desc:'仓库争夺，高回报', url:'map-armory.html'},
  {id:'airport', name:'港口', icon:'🛩️', desc:'港口攻防，大战场', url:'map-airport.html'},
  {id:'tvstation', name:'电视台', icon:'📺', desc:'室内CQB，战术决胜', url:'map-tvstation.html'},
];

var mapsCards = mapList.map(function(m) {
  return '<div style="background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;display:flex;justify-content:space-between;align-items:center;">'+
    '<div><div style="font-size:1.1rem;font-weight:500;color:#ddd;">'+m.icon+' '+m.name+'</div>'+
    '<div style="font-size:0.8rem;color:#666;margin-top:2px;">'+m.desc+'</div></div>'+
    '<a href="'+m.url+'" style="padding:8px 16px;background:rgba(255,200,50,0.1);border:1px solid rgba(255,200,50,0.2);border-radius:8px;color:#ffc832;font-size:0.85rem;">🗺 交互地图</a></div>';
}).join('');

// Also add B站视频 display for each map
var videoContainers = mapList.map(function(m) {
  return '<div id="videos-'+m.id+'" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;"></div>';
}).join('');

var mapsHTML = pageHTML('地图选图', '', `
  <h1 style="color:#ffc832;font-size:1.5rem;margin-bottom:0.5rem;">🗺 地图选图</h1>
  <p style="color:#666;margin-bottom:1.5rem;">选择地图查看详细的交互式地图</p>
  <div style="display:flex;flex-direction:column;gap:10px;">
    ${mapsCards}
  </div>
  <div style="margin-top:2rem;">
    <h2 style="color:#ffc832;font-size:1rem;margin-bottom:0.8rem;">📹 玩家攻略视频</h2>
    ${videoContainers}
  </div>
`, `
// Load B站 videos
(async function loadAllVideos(){
  try{
    var r=await db('GET','map_videos',null,'order=created_at.desc&limit=50');
    if(!r.ok)return;
    var videos=await r.json();
    if(!Array.isArray(videos))return;
    ['farm','beishan','valley','armory','airport','tvstation'].forEach(function(k){
      var ct=document.getElementById('videos-'+k);
      if(!ct)return;
      var list=videos.filter(function(v){return v.map_name===k;});
      ct.innerHTML=list.map(function(v){
        var cover=v.cover||'';
        var thumbs='';
        if(cover) thumbs='<img src="'+cover+'" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" alt="">';
        return '<div style="width:200px;flex-shrink:0;"><a href="'+v.url+'" target="_blank" style="color:#ccc;text-decoration:none;">'+
          '<div style="width:100%;height:110px;background:#1a1a28;border-radius:6px;margin-bottom:4px;overflow:hidden;">'+thumbs+'</div>'+
          '<div style="font-size:0.8rem;line-height:1.3;">'+esc(v.title||'视频')+'</div></a></div>';
      }).join('');
    });
  }catch(e){}
  function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s||''));return d.innerHTML;}
})();
`, 'pages/maps.html');

// 3. Weapons / Strategy / Gear - Post pages
var postPageHTML = function(title, category, icon) {
  return pageHTML(title, `
<style>
.postForm{background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;margin-bottom:1.5rem;}
.postForm input,.postForm textarea,.postForm select{width:100%;padding:10px;margin-bottom:8px;background:#12121a;border:1px solid #1e1e2a;border-radius:8px;color:#ccc;font-size:0.9rem;}
.postForm textarea{min-height:100px;resize:vertical;}
.postForm button{padding:8px 20px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;cursor:pointer;font-size:0.9rem;}
.postForm button:hover{background:rgba(255,200,50,0.25);}
.postCard{background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-bottom:10px;}
.postCard .meta{font-size:0.75rem;color:#555;display:flex;gap:10px;margin-bottom:4px;}
.postCard .title{font-size:1rem;color:#ddd;font-weight:500;margin-bottom:4px;}
.postCard .body{font-size:0.85rem;color:#777;line-height:1.5;}
</style>`, `
  <h1 style="color:#ffc832;font-size:1.5rem;margin-bottom:0.5rem;">${icon} ${title}</h1>
  <p style="color:#666;margin-bottom:1.5rem;">分享你的配装、心得和讨论</p>

  <div id="postForm" class="postForm" style="display:none;">
    <input id="postTitle" type="text" placeholder="标题">
    <select id="postCategory">
      <option value="general">杂谈</option>
      <option value="question">问答</option>
      <option value="showoff">炫耀</option>
      <option value="guide">攻略</option>
    </select>
    <textarea id="postContent" placeholder="内容..."></textarea>
    <button onclick="submitPost()">发布</button>
  </div>

  <div id="loginHint" style="text-align:center;padding:2rem;color:#555;margin-bottom:1rem;">
    登录后可以发布帖子
    <br><br>
    <button onclick="loginGitHub()" style="padding:8px 24px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;cursor:pointer;">GitHub 登录</button>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
    <h2 style="color:#ffc832;font-size:1rem;">📄 帖子列表</h2>
    <button id="fabBtn" onclick="if(localStorage.getItem('abi_token')){showForm();}else{loginGitHub();}" style="width:36px;height:36px;border-radius:50%;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);font-size:1.3rem;cursor:pointer;display:none;">+</button>
  </div>
  <div id="postList"></div>
`, `
var currentCategory='${category}';
var currentUser=localStorage.getItem('abi_user')||null;

(function init(){
  // Show form if logged in
  if(localStorage.getItem('abi_token')){
    document.getElementById('loginHint').style.display='none';
    document.getElementById('postForm').style.display='block';
    document.getElementById('fabBtn').style.display='';
  }
  loadPosts();
})();

function showForm(){
  document.getElementById('postForm').style.display='block';
  document.getElementById('postTitle').focus();
}

async function loadPosts(){
  try{
    var q='category=eq.'+currentCategory+'&order=created_at.desc&limit=30';
    var r=await db('GET','map_posts',null,q);
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    var el=document.getElementById('postList');
    if(!posts||posts.length===0){el.innerHTML='<div style="text-align:center;color:#555;padding:2rem;">暂无帖子</div>';return;}
    el.innerHTML=posts.map(function(p){
      var body=(p.content||'').substring(0,300);
      return '<div class="postCard">'+
        '<div class="meta"><span>'+esc(p.author||'匿名')+'</span><span>'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div class="title">'+esc(p.title||'无标题')+'</div>'+
        '<div class="body">'+esc(body)+(p.content&&p.content.length>300?'...':'')+'</div>'+
        '</div>';
    }).join('');
  }catch(e){
    document.getElementById('postList').innerHTML='<div style="text-align:center;color:#555;padding:2rem;">加载失败</div>';
  }
}

async function submitPost(){
  var title=document.getElementById('postTitle').value.trim();
  var content=document.getElementById('postContent').value.trim();
  if(!title||!content){alert('标题和内容不能为空');return;}
  try{
    var r=await db('POST','map_posts',{
      title:title, content:content, category:currentCategory,
      author:localStorage.getItem('abi_user')||'匿名',
      map_name:currentCategory
    });
    if(!r.ok){var t=await r.text();alert('发布失败: '+t.substring(0,100));return;}
    document.getElementById('postTitle').value='';
    document.getElementById('postContent').value='';
    loadPosts();
  }catch(e){alert('发布失败: '+e.message);}
}

function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s||''));return d.innerHTML;}
`, 'pages/'+title+'.html');
};

// Build weapon/strategy/gear pages
var weaponsHTML = postPageHTML('weapons', 'weapon', '🔧');
var strategyHTML = postPageHTML('strategy', 'chat', '💬');
var gearHTML = postPageHTML('gear', 'guide', '📖');

// 4. Search page
var searchHTML = pageHTML('搜索', '<style>.searchBox{width:100%;padding:12px;background:#12121a;border:1px solid #1e1e2a;border-radius:10px;color:#ccc;font-size:1rem;}</style>', `
  <h1 style="color:#ffc832;font-size:1.5rem;margin-bottom:0.5rem;">🔍 搜索</h1>
  <p style="color:#666;margin-bottom:1.5rem;">搜索帖子、攻略和讨论</p>
  <input id="searchInput" class="searchBox" type="text" placeholder="输入关键词搜索..." oninput="doSearch()">
  <div id="searchResults" style="margin-top:1.5rem;display:flex;flex-direction:column;gap:10px;"></div>
`, `
async function doSearch(){
  var q=document.getElementById('searchInput').value.trim();
  var el=document.getElementById('searchResults');
  if(!q){el.innerHTML='';return;}
  try{
    var r=await db('GET','map_posts',null,'title=ilike.*'+encodeURIComponent(q)+'*&order=created_at.desc&limit=20');
    if(!r.ok){el.innerHTML='<div style="text-align:center;color:#555;">搜索失败</div>';return;}
    var posts=await r.json();
    if(!posts||posts.length===0){el.innerHTML='<div style="text-align:center;color:#555;">未找到相关帖子</div>';return;}
    el.innerHTML=posts.map(function(p){
      return '<div style="background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px;">'+
        '<div style="font-size:0.8rem;color:#555;margin-bottom:4px;">'+esc(p.author||'匿名')+' · '+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</div>'+
        '<div style="color:#ddd;font-weight:500;">'+esc(p.title||'无标题')+'</div>'+
        '<div style="color:#777;font-size:0.85rem;margin-top:4px;">'+esc((p.content||'').substring(0,200))+'</div></div>';
    }).join('');
  }catch(e){el.innerHTML='<div style="text-align:center;color:#555;">搜索失败</div>';}
}
function esc(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s||''));return d.innerHTML;}
`, 'search.html');

// ==========================================
// WRITE FILES
// ==========================================

var files = {
  'index.html': indexHTML,
  'pages/maps.html': mapsHTML,
  'pages/weapons.html': weaponsHTML,
  'pages/strategy.html': strategyHTML,
  'pages/gear.html': gearHTML,
  'search.html': searchHTML,
};

Object.keys(files).forEach(function(name) {
  var fp = root + '\\' + name.replace(/\//g, '\\');
  fs.writeFileSync(fp, files[name]);
  console.log(name + ': ' + files[name].length + ' bytes');
});

// Validate all
console.log('\nValidating...');
Object.keys(files).forEach(function(name) {
  var fp = root + '\\' + name.replace(/\//g, '\\');
  var c = fs.readFileSync(fp, 'utf8');
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  if (scripts) scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { console.log(name + ': ERROR - ' + e.message.substring(0,80)); }
  });
});

console.log('\nAll done! v2 files written to: ' + root);
