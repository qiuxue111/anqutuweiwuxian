const fs = require('fs');
const { execSync } = require('child_process');

// Get base from git history
const buf = execSync('git -C "F:\\暗区突围网站" show a33a391:pages/maps.html', {encoding: 'buffer'});
let c = buf.toString('utf8');

// Fix known issues
c = c.replace('军械?<span', '军械库<span');
c = c.replace('🗺?查看', '🗺 查看');

// Remove subtitle
c = c.replace('<p>每张地图的详细点位、刷新规律、撤离条件一</p>\n', '');

// Add styles
c = c.replace('</head>', `<style>
  .map-videos { display:flex; flex-wrap:wrap; gap:0.3rem; margin-top:0.5rem; }
  .map-video-card {
    display:inline-flex; align-items:center; gap:0.4rem;
    padding:0.3rem 0.5rem; background:#1a1a22; border-radius:6px;
    text-decoration:none; color:#ccc; font-size:0.78rem; max-width:200px;
  }
  .map-video-card:hover { background:#2a2a32; }
  .map-video-card img { width:48px; height:30px; border-radius:4px; object-fit:cover; }
  .add-video-btn {
    width:28px; height:28px; border-radius:50%;
    background:#252530; color:#ffc832;
    border:1px solid #333; font-size:1.1rem;
    cursor:pointer; line-height:1; transition:0.2s;
  }
  .add-video-btn:hover { background:#333; border-color:#ffc832; }
</style>
</head>`);

// Inject video containers + buttons into each map-detail
// Each map-detail has: <div class="map-detail" id="xxx">...<h2>...</h2>\n      \n<div style="margin-top:1rem;">...查看交互地图</a>\n      </div>\n    </div>
// Insert after the inner </div> (button div close) but before the outer </div> (map-detail close)

const maps = [
  { id: 'beishan', name: '北山' },
  { id: 'valley', name: '山谷' },
  { id: 'armory', name: '军械库' },
  { id: 'farm', name: '农场' },
  { id: 'airport', name: '机场' },
  { id: 'tvstation', name: '电视台' }
];

maps.forEach(m => {
  // Find all </div> after this map-detail opening
  const openTag = '<div class="map-detail" id="' + m.id + '">';
  const startIdx = c.indexOf(openTag);
  if (startIdx < 0) { console.log(m.id + ': not found'); return; }
  
  // The inner structure is:
  // <h2>...</h2>\n      \n<div style="margin-top:1rem;">\n        <a ...>🗺 查看交互地图</a>\n      </div>\n    </div>
  // We want to insert before the LAST </div> (the map-detail close)
  
  // Find the button div close </div>
  const btnDivClose = c.indexOf('</div>', startIdx + 300);
  // Then map-detail close is right after
  const mapDetailClose = c.indexOf('</div>', btnDivClose + 6);
  
  if (mapDetailClose < 0) { console.log(m.id + ': map-detail close not found'); return; }
  
  const insertHtml = 
    '      <div class="map-videos" id="videos-' + m.id + '"></div>\n' +
    '      <div style="margin-top:0.5rem;">\n' +
    "        <button class=\"add-video-btn\" onclick=\"openVideoForm('" + m.id + "','" + m.name + "')\" title=\"\u6DFB\u52A0B\u7AD9\u89C6\u9891\">+</button>\n" +
    '      </div>\n    ';
  
  // Insert before mapDetailClose
  c = c.substring(0, mapDetailClose) + insertHtml + c.substring(mapDetailClose);
  console.log(m.id + ': inserted at', mapDetailClose);
});

// Now add: auth buttons in navbar, video panel, JS
// Navbar auth
c = c.replace('<ul class="nav-links">',
  '<button id="videoAdminBtn" onclick="toggleVideoPanel()" style="display:none;padding:0.2rem 0.5rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">管理视频</button>\n' +
  '<button id="loginBtn" onclick="loginGitHub()" style="padding:0.2rem 0.5rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">登录</button>\n' +
  '<ul class="nav-links">');

// Video panel before footer
const footerIdx = c.lastIndexOf('<footer>');
c = c.substring(0, footerIdx) + `
<div id="videoPanel" style="display:none;margin-top:2rem;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">
  <h3 style="color:#ffc832;margin-bottom:1rem;">管理地图视频</h3>
  <div id="videoMapBtns" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;"></div>
  <div id="videoForm" style="display:none;">
    <p style="color:#ccc;margin-bottom:0.5rem;">粘贴B站视频链接：</p>
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
  <p id="selectedMapName" style="display:none;color:#888;font-size:0.85rem;margin-bottom:0.5rem;"></p>
  <div id="videoListContainer"></div>
</div>

` + c.substring(footerIdx);

// Add JS
c = c.replace('</body>', `<script src="../supabase.js"></script>
<script>
var currentUser=null,currentToken=null,selectedMapId=null;

function initAuth(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.slice(1));
    var t=p.get('access_token');
    if(t){localStorage.setItem('abi_token',t);localStorage.setItem('abi_user',p.get('email')||'');window.location.hash='';location.reload();}}
  var t=localStorage.getItem('abi_token');currentToken=t;
  var u=localStorage.getItem('abi_user');if(u)currentUser=u;
  if(currentToken){
    var b=document.getElementById('videoAdminBtn');if(b)b.style.display='';
    var l=document.getElementById('loginBtn');if(l)l.style.display='none';}
  loadAllVideos();}

function loginGitHub(){
  var s=supabasejs.createClient('https://hanrfbciinkhgcumvous.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok');
  s.auth.signInWithOAuth({provider:'github'});}

function toggleVideoPanel(){
  var p=document.getElementById('videoPanel');
  p.style.display=p.style.display==='none'?'block':'none';
  if(p.style.display==='block')renderVideoAdmin();}

function openVideoForm(id,nm){
  selectedMapId=id;
  var p=document.getElementById('selectedMapName');p.textContent='添加视频到：'+nm;p.style.display='';
  document.getElementById('videoForm').style.display='block';
  document.getElementById('videoUrlInput').value='';
  document.getElementById('videoPreview').style.display='none';}

function closeVideoForm(){
  document.getElementById('videoForm').style.display='none';
  document.getElementById('selectedMapName').style.display='none';}

function extractBVID(url){
  var m=url.match(/(?:bilibili\\\\.com\\\\/video\\\\/)?(BV[a-zA-Z0-9]+)/i);
  return m?m[1]:null;}

async function fetchBilibiliInfo(){
  var url=document.getElementById('videoUrlInput').value.trim();
  if(!url){alert('请输入B站视频链接');return;}
  var bvid=extractBVID(url);
  if(!bvid){alert('无法识别BV号');return;}
  document.getElementById('videoPreview').style.display='none';
  try{
    var r=await fetch('https://api.bilibili.com/x/web-interface/view?bvid='+bvid);
    var d=await r.json();
    if(d.code!==0){alert('获取失败: '+d.message);return;}
    var v=d.data;
    document.getElementById('previewCover').src=v.pic;
    document.getElementById('previewTitle').textContent=v.title;
    document.getElementById('videoPreview').style.display='block';
    var inp=document.getElementById('videoUrlInput');
    inp.dataset.bvid=bvid;inp.dataset.cover=v.pic;inp.dataset.title=v.title;
  }catch(e){alert('获取失败');}}

function supa(method,table,body,q){
  var token=localStorage.getItem('abi_token');
  var anonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
  var bearer=anonKey;
  if(token){try{var p=JSON.parse(atob(token.split('.')[1]));if(p.exp&&p.exp*1000>Date.now())bearer=token;}catch(e){}}
  return fetch('https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+table+(q?'?'+q:''),{
    method:method,headers:{'Authorization':'Bearer '+bearer,'apiKey':anonKey,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null});}

async function saveVideo(){
  if(!selectedMapId){alert('请选择地图');return;}
  var inp=document.getElementById('videoUrlInput');
  var bvid=inp.dataset.bvid,title=inp.dataset.title,cover=inp.dataset.cover;
  if(!bvid||!title){alert('请先预览获取信息');return;}
  try{
    var r=await supa('POST','map_videos',{map_name:selectedMapId,bvid:bvid,url:inp.value.trim(),title:title,cover:cover});
    if(r.ok||r.status===201){alert('已添加');closeVideoForm();loadAllVideos();
      if(document.getElementById('videoPanel').style.display==='block')renderVideoAdmin();}
    else{var t=await r.text();alert('保存失败: '+t);}
  }catch(e){alert('保存失败');}}

async function deleteVideo(id){
  if(!confirm('确定删除该视频？'))return;
  try{var r=await supa('DELETE','map_videos',null,'id=eq.'+id);
    if(r.ok||r.status===204){loadAllVideos();if(document.getElementById('videoPanel').style.display==='block')renderVideoAdmin();}
    else{var t=await r.text();alert('删除失败: '+t);}
  }catch(e){alert('删除失败');}}

async function loadAllVideos(){
  try{
    var r=await supa('GET','map_videos',null,'order=created_at.desc');
    if(!r.ok)return;var videos=await r.json();if(!Array.isArray(videos))return;
    var g={};['beishan','valley','armory','farm','airport','tvstation'].forEach(function(k){g[k]=[];});
    videos.forEach(function(v){var mk=v.map_name||'farm';if(g[mk])g[mk].push(v);});
    Object.entries(g).forEach(function(e){
      var list=e[1],mid=e[0];
      var ct=document.getElementById('videos-'+mid);
      if(!ct)return;
      ct.innerHTML=list.map(function(v){return '<a href="'+v.url+'" target="_blank" class="map-video-card">'+
        (v.cover?'<img src="'+v.cover+'" onerror="this.style.display=\'none\'">':'')+
        '<span>'+(v.title||'B站视频')+'</span></a>';}).join('');});
  }catch(e){}}

async function renderVideoAdmin(){
  try{
    var r=await supa('GET','map_videos',null,'order=created_at.desc');
    if(!r.ok){document.getElementById('videoListContainer').innerHTML='<p style="color:#888;">加载失败</p>';return;}
    var videos=await r.json();
    if(!Array.isArray(videos))return;
    var nm={beishan:'北山',valley:'山谷',armory:'军械库',farm:'农场',airport:'机场',tvstation:'电视台'};
    var g={};Object.keys(nm).forEach(function(k){g[k]=[];});
    videos.forEach(function(v){var mk=v.map_name||'farm';if(g[mk])g[mk].push(v);});
    document.getElementById('videoMapBtns').innerHTML=Object.entries(nm).map(function(e){
      return '<button onclick="openVideoForm(\\''+e[0]+'\\',\\''+e[1]+'\\')" style="padding:0.3rem 0.8rem;background:#1a1a22;color:#ffc832;border:1px solid #333;border-radius:6px;cursor:pointer;">+'+e[1]+'</button>';}).join('');
    document.getElementById('videoListContainer').innerHTML=Object.entries(g).map(function(e){
      var mid=e[0],list=e[1];
      if(!list.length)return '';
      return '<div style="margin-bottom:0.8rem;"><p style="color:#ffc832;font-size:0.85rem;margin-bottom:0.3rem;">'+nm[mid]+'</p>'+
        list.map(function(v){return '<div style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.5rem;background:#1a1a22;border-radius:6px;margin-bottom:0.3rem;">'+
          (v.cover?'<img src="'+v.cover+'" style="width:64px;height:40px;border-radius:4px;object-fit:cover;">':'')+
          '<span style="flex:1;color:#ccc;font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+v.title+'</span>'+
          '<button onclick="deleteVideo('+v.id+')" style="flex-shrink:0;padding:0.15rem 0.5rem;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem;">删除</button></div>';}).join('')+'</div>';}).join('');
    document.getElementById('videoListContainer').innerHTML=document.getElementById('videoListContainer').innerHTML||'<p style="color:#666;font-size:0.85rem;">暂无视频</p>';
  }catch(e){}}

document.addEventListener('DOMContentLoaded',initAuth);
</script>
</body>`);

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done. Size:', c.length);
maps.forEach(function(m) {
  var ok=c.includes('openVideoForm(\\''+m.id+'\\'')||c.includes('openVideoForm(\''+m.id+'\'');
  console.log('  '+m.id+': btn='+ok+', videos='+c.includes('id="videos-'+m.id+'"'));
});
console.log('Login btns:', c.split('id="loginBtn"').length-1);
console.log('军械库:', c.includes('军械库<span'));
