const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find the script tags
const scriptStart = c.indexOf('<script>');
const scriptEnd = c.lastIndexOf('</script>');
const before = c.substring(0, scriptStart);
const after = c.substring(scriptEnd);

// Replace entire script content
const newScript = `<script>
var currentUser=null,currentToken=null,selectedMapId=null;

function initAuth(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.slice(1));
    var t=p.get('access_token');
    if(t){
      localStorage.setItem('abi_token',t);
      localStorage.setItem('abi_user',p.get('email')||'');
      window.location.hash='';
      location.reload();
    }
  }
  var t=localStorage.getItem('abi_token');
  currentToken=t;
  var u=localStorage.getItem('abi_user');
  if(u) currentUser=u;
  if(currentToken){
    var b=document.getElementById('videoAdminBtn');
    if(b) b.style.display='';
    var l=document.getElementById('loginBtn');
    if(l) l.style.display='none';
  }
  loadAllVideos();
}

function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}

function toggleVideoPanel(){
  var p=document.getElementById('videoPanel');
  p.style.display=(p.style.display==='none'?'block':'none');
  if(p.style.display==='block') renderVideoAdmin();
}

function openVideoForm(id,nm){
  selectedMapId=id;
  document.getElementById('selectedMapName').textContent='添加视频到：'+nm;
  document.getElementById('selectedMapName').style.display='';
  document.getElementById('videoForm').style.display='block';
  document.getElementById('videoUrlInput').value='';
  document.getElementById('videoPreview').style.display='none';
}

function closeVideoForm(){
  document.getElementById('videoForm').style.display='none';
  document.getElementById('selectedMapName').style.display='none';
}

function extractBVID(url){
  var m=url.match(/(?:bilibili\\.com\\/video\\/)?(BV[a-zA-Z0-9]+)/i);
  return m?m[1]:null;
}

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
    inp.dataset.bvid=bvid;
    inp.dataset.cover=v.pic;
    inp.dataset.title=v.title;
  }catch(e){alert('获取失败');}
}

function supabase(method, table, body, q){
  var key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
  return fetch('https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+table+(q?'?'+q:''),{
    method:method,
    headers:{'Authorization':'Bearer '+key,'apiKey':key,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}

async function saveVideo(){
  if(!selectedMapId){alert('请选择地图');return;}
  var inp=document.getElementById('videoUrlInput');
  var url=inp.value.trim();
  var bvid=inp.dataset.bvid;
  var title=inp.dataset.title;
  var cover=inp.dataset.cover;
  if(!bvid||!title){alert('请先预览获取信息');return;}
  try{
    var r=await supabase('POST','map_videos',{
      map_name:selectedMapId,
      bvid:bvid,
      url:url,
      title:title,
      cover:cover
    });
    if(r.ok||r.status===201){
      alert('已添加');
      closeVideoForm();
      loadAllVideos();
      if(document.getElementById('videoPanel').style.display==='block') renderVideoAdmin();
    }else{
      var t=await r.text();
      alert('保存失败: '+t);
    }
  }catch(e){alert('保存失败');}
}

async function deleteVideo(id){
  if(!confirm('确定删除该视频？')) return;
  try{
    var r=await supabase('DELETE','map_videos',null,'id=eq.'+id);
    if(r.ok||r.status===204){
      loadAllVideos();
      if(document.getElementById('videoPanel').style.display==='block') renderVideoAdmin();
    }else{
      var t=await r.text();
      alert('删除失败: '+t);
    }
  }catch(e){alert('删除失败');}
}

async function loadAllVideos(){
  try{
    var r=await supabase('GET','map_videos',null,'order=created_at.desc');
    if(!r.ok) return;
    var videos=await r.json();
    if(!Array.isArray(videos)) return;
    var ids=['beishan','valley','armory','farm','airport','tvstation'];
    var group={};
    ids.forEach(function(k){group[k]=[];});
    videos.forEach(function(v){
      var mk=v.map_name||'farm';
      if(group[mk]) group[mk].push(v);
    });
    ids.forEach(function(mid){
      var list=group[mid];
      var ct=document.getElementById('videos-'+mid);
      if(!ct) return;
      var html='';
      list.forEach(function(v){
        html+='<a href="'+v.url+'" target="_blank" class="map-video-card">';
        if(v.cover){
          html+='<img src="'+v.cover+'" style="width:48px;height:30px;border-radius:4px;object-fit:cover;" onerror="this.style.display=\\'none\\'">';
        }
        html+='<span>'+(v.title||'B站视频')+'</span></a>';
      });
      ct.innerHTML=html;
    });
  }catch(e){}
}

async function renderVideoAdmin(){
  try{
    var r=await supabase('GET','map_videos',null,'order=created_at.desc');
    if(!r.ok){
      document.getElementById('videoListContainer').innerHTML='<p style="color:#888;">加载失败</p>';
      return;
    }
    var videos=await r.json();
    if(!Array.isArray(videos)) return;
    var nm={beishan:'北山',valley:'山谷',armory:'军械库',farm:'农场',airport:'机场',tvstation:'电视台'};
    var group={};
    Object.keys(nm).forEach(function(k){group[k]=[];});
    videos.forEach(function(v){
      var mk=v.map_name||'farm';
      if(group[mk]) group[mk].push(v);
    });
    var btns='';
    Object.entries(nm).forEach(function(e){
      btns+='<button onclick="openVideoForm(\\''+e[0]+'\\',\\''+e[1]+'\\')" style="padding:0.3rem 0.8rem;background:#1a1a22;color:#ffc832;border:1px solid #333;border-radius:6px;cursor:pointer;">+'+e[1]+'</button>';
    });
    document.getElementById('videoMapBtns').innerHTML=btns;
    var listHtml='';
    Object.entries(group).forEach(function(e){
      var mid=e[0];
      var list=e[1];
      if(!list.length) return;
      listHtml+='<div style="margin-bottom:0.8rem;">';
      listHtml+='<p style="color:#ffc832;font-size:0.85rem;margin-bottom:0.3rem;">'+nm[mid]+'</p>';
      list.forEach(function(v){
        listHtml+='<div style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0.5rem;background:#1a1a22;border-radius:6px;margin-bottom:0.3rem;">';
        if(v.cover){
          listHtml+='<img src="'+v.cover+'" style="width:64px;height:40px;border-radius:4px;object-fit:cover;">';
        }
        listHtml+='<span style="flex:1;color:#ccc;font-size:0.8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+v.title+'</span>';
        listHtml+='<button onclick="deleteVideo('+v.id+')" style="flex-shrink:0;padding:0.15rem 0.5rem;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.75rem;">删除</button>';
        listHtml+='</div>';
      });
      listHtml+='</div>';
    });
    document.getElementById('videoListContainer').innerHTML=listHtml||'<p style="color:#666;font-size:0.85rem;">暂无视频</p>';
  }catch(e){}
}

document.addEventListener('DOMContentLoaded',initAuth);
</script>`;

c = before + newScript + after;

// Fix: The onclick in renderVideoAdmin needs proper escaping in the generated HTML
// The \\' sequences in the template literal are fine for the inline onclick
// But actually we need to use single quotes in the generated HTML properly
// The issue is that when the template literal generates the onclick='openVideoForm(...)'
// it contains the escaped quotes which will be HTML-decoded correctly

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Replaced entire script. Validating...');

// Validate
const scriptMatch = c.match(/<script>\n([\s\S]*?)<\/script>/);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log('Script validates OK');
  } catch(e) {
    console.log('Error:', e.message);
    const lines = scriptMatch[1].split('\n');
    const m = e.message.match(/(\d+)/);
    if (m) {
      const ln = parseInt(m[1]);
      console.log('Near line', ln + ':', lines.slice(Math.max(0,ln-3), ln+2).join('\n'));
    }
  }
}
