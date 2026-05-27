const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

var coreJs = `
// ===== 地图核心交互 =====
var scale=1,panX=0,panY=0,isDragging=false,startX,startY,startPanX,startPanY;
var mode='browse'; // browse or place
var pins=[],mapComments=[],curPinIdx=null;
var touchStartDist=0,touchStartScale=1;

var mapNameEng = 'MAP_ENG';
var mapNameCN = 'MAP_CN';

function zoom(f){scale*=f;if(scale<0.2)scale=0.2;if(scale>8)scale=8;updateTransform();}
function zoomTo(v){v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;scale=v;updateTransform();}
function resetView(){scale=1;panX=0;panY=0;updateTransform();}
function updateTransform(){
  var el=document.getElementById('mv');
  if(!el)return;
  el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scale+')';
  var zr=document.getElementById('zr');
  var zl=document.getElementById('zl');
  if(zr)zr.value=Math.round(scale*100);
  if(zl)zl.textContent=Math.round(scale*100)+'%';
}

// 鼠标拖动
document.addEventListener('mousedown',function(e){
  var mv=document.getElementById('mv');
  if(!mv||!mv.contains(e.target))return;
  if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;
  isDragging=true;startX=e.clientX;startY=e.clientY;
  startPanX=panX;startPanY=panY;
  if(e.target===mv||e.target===document.getElementById('mapImg')){e.preventDefault();}
});
document.addEventListener('mousemove',function(e){
  if(!isDragging)return;
  panX=startPanX+(e.clientX-startX);
  panY=startPanY+(e.clientY-startY);
  updateTransform();
});
document.addEventListener('mouseup',function(){isDragging=false;});

// 鼠标滚轮缩放
document.addEventListener('wheel',function(e){
  var mv=document.getElementById('mv');
  if(!mv||!mv.contains(e.target))return;
  e.preventDefault();
  var f=e.deltaY<0?1.1:0.9;
  zoom(f);
},{passive:false});

// 触摸支持
document.addEventListener('touchstart',function(e){
  var mv=document.getElementById('mv');
  if(!mv||!mv.contains(e.target))return;
  if(e.touches.length===1){
    isDragging=true;startX=e.touches[0].clientX;startY=e.touches[0].clientY;
    startPanX=panX;startPanY=panY;
  }else if(e.touches.length===2){
    touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    touchStartScale=scale;
  }
});
document.addEventListener('touchmove',function(e){
  if(e.touches.length===1&&isDragging){
    panX=startPanX+(e.touches[0].clientX-startX);
    panY=startPanY+(e.touches[0].clientY-startY);
    updateTransform();
  }else if(e.touches.length===2){
    var dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    scale=touchStartScale*(dist/touchStartDist);
    if(scale<0.2)scale=0.2;if(scale>8)scale=8;
    updateTransform();
  }
});
document.addEventListener('touchend',function(){isDragging=false;});

// 模式切换
function toggleMode(){
  mode=mode==='browse'?'place':'browse';
  var btn=document.getElementById('mdBtn');
  if(btn)btn.textContent=mode==='place'?'📍 放置':'👁️ 浏览';
  var ch=document.getElementById('ch');
  if(ch)ch.classList.toggle('show',mode==='place');
}
document.addEventListener('click',function(e){
  if(mode!=='place')return;
  var mv=document.getElementById('mv');
  if(!mv||!mv.contains(e.target))return;
  if(e.target===document.getElementById('mdBtn'))return;
  e.preventDefault();
  var img=document.getElementById('mapImg');
  if(!img)return;
  var rect=img.getBoundingClientRect();
  var x=((e.clientX-rect.left)/rect.width*100).toFixed(2);
  var y=((e.clientY-rect.top)/rect.height*100).toFixed(2);
  document.getElementById('cv').textContent=x+'%, '+y+'%';
  document.getElementById('ab').style.display='inline-block';
  document.getElementById('ch').classList.remove('show');
});

// ===== Supabase ====
var SUPABASE_URL="https://hanrfbciinkhgcumvous.supabase.co";
var SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok";

function supabase(t,m,b,q){
  var u=SUPABASE_URL+"/rest/v1/"+t;if(q)u+="?"+q;
  var tk=localStorage.getItem("abi_token");
  var token=SUPABASE_ANON_KEY;
  if(tk){
    try{
      var p=JSON.parse(atob(tk.split(".")[1].replace(/-/g,"+").replace(/_/g,"/")));
      if(p.exp&&p.exp*1000>Date.now())token=tk;
    }catch(e){}
  }
  var o={method:m||"GET",headers:{"apikey":SUPABASE_ANON_KEY,"Authorization":"Bearer "+token,"Content-Type":"application/json"}};
  if(b&&m!=="GET")o.body=JSON.stringify(b);
  return fetch(u,o).then(function(r){
    if(!r.ok){throw new Error("HTTP "+r.status+" for "+t);}
    return r.json().catch(function(){return [];});
  });
}

var cloudPins=[],cloudComments=[];
function loadCloudPins(){
  var a=[];
  a.push(supabase("pins","GET",null,"map_name=eq."+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudPins=d;cloudPins.forEach(function(p){delete p.created_at;});}}));
  a.push(supabase("map_comments","GET",null,"map_name=eq."+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudComments=d;cloudComments.forEach(function(c){delete c.id;delete c.created_at;});}}));
  Promise.all(a).then(function(){
    pins=cloudPins.slice();
    mapComments=cloudComments.slice();
    savePins();
    renderMarkers();renderMapComments();
    jumpToFromUrl();
  }).catch(function(){
    try{var d=JSON.parse(localStorage.getItem("abi_"+mapNameEng+"_pins"));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;renderMarkers();renderMapComments();jumpToFromUrl();}}catch(e){}
  });
}

function savePins(){
  localStorage.setItem("abi_"+mapNameEng+"_pins",JSON.stringify({pins:pins,mapComments:mapComments}));
}

// ===== 标记点渲染 ====
function renderMarkers(){
  var mv=document.getElementById('mv');
  if(!mv)return;
  // Remove old markers (keep only img + pins)
  var markers=mv.querySelectorAll('.pin-marker');
  markers.forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=p.ic||'';
    if(ic){
      el.innerHTML='<img src="'+ic+'" style="width:32px;height:32px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,200,50,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.5)">';
    }else{
      el.innerHTML='<div style="width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)"></div>';
    }
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};
    mv.appendChild(el);
  });
}

// ===== 容器详情弹窗 ====
function showPinDetail(idx){
  curPinIdx=idx;
  var p=pins[idx];
  document.getElementById("pdTitle").innerHTML="<img src='"+(p.ic||"")+"' style='width:28px;height:28px;border-radius:4px;object-fit:cover'> "+p.name;
  document.getElementById("pdCoord").textContent="位置： "+p.x+"%, "+p.y+"%";
  document.getElementById("pdNote").value=p.note||"";
  renderPinImages();
  renderPinComments();
  document.getElementById("pd").classList.add("show");
}
function closePinDetail(){document.getElementById("pd").classList.remove("show");curPinIdx=null;}
function savePinNote(){
  if(curPinIdx===null)return;
  pins[curPinIdx].note=document.getElementById("pdNote").value;
  savePins();
}
function renderPinImages(){
  var grid=document.getElementById("pdImgGrid");grid.innerHTML="";
  if(curPinIdx===null)return;
  var imgs=pins[curPinIdx].images||[];
  imgs.forEach(function(src,i){
    var img=document.createElement("img");img.src=src;
    img.onclick=function(){if(confirm("删除此图片？")){pins[curPinIdx].images.splice(i,1);savePins();renderPinImages();}};
    grid.appendChild(img);
  });
  var addBtn=document.createElement("div");addBtn.className="pd-add-img";addBtn.textContent="+";
  addBtn.onclick=function(){document.getElementById("pdImgInput").click();};
  grid.appendChild(addBtn);
}
function addPinImages(files){
  if(curPinIdx===null||!files.length)return;
  var done=0,total=files.length;
  for(var i=0;i<files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        pins[curPinIdx].images.push(e.target.result);
        done++;
        if(done===total){savePins();renderPinImages();}
      };
      reader.readAsDataURL(file);
    })(files[i]);
  }
}
function deleteCurrentPin(){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  if(curPinIdx===null)return;
  var p=pins[curPinIdx];
  if(!confirm("确认提交删除申请？"))return;
  var uname=localStorage.getItem('abi_user')||'匿名';
  if(p.id){
    supabase("deletion_requests","POST",{pin_id:p.id,name:p.name,x:p.x,y:p.y,submitted_by:uname,reason:"用户提交",votes:0}).then(function(){
      alert("删除申请已提交，等待审核投票。");
    }).catch(function(){alert("提交删除申请失败。");});
  }else{
    pins.splice(curPinIdx,1);curPinIdx=null;
    savePins();renderMarkers();closePinDetail();
  }
}

// ===== 评论区 ====
function renderPinComments(){
  var list=document.getElementById("pdcList");list.innerHTML="";
  if(curPinIdx===null)return;
  var comments=pins[curPinIdx].comments||[];
  comments.forEach(function(c){
    var item=document.createElement("div");item.className="pdc-item";
    var time=document.createElement("span");time.className="pdc-time";time.textContent=c.time;
    var user=c.user_name?"<strong style='color:#ffc832'>"+c.user_name+"</strong> ":"";
    item.innerHTML=user+c.text;
    item.appendChild(time);list.appendChild(item);
  });
}
function postPinComment(){
  if(curPinIdx===null)return;
  var input=document.getElementById("pdcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  var uname=localStorage.getItem('abi_user')||'匿名';
  var p=pins[curPinIdx];
  if(p.id){supabase("map_comments","POST",{text:text,time:tz,user_name:uname});}
  if(!p.comments)p.comments=[];
  p.comments.push({text:text,time:tz,user_name:uname});
  savePins();renderPinComments();
  input.value="";
}
function renderMapComments(){
  var list=document.getElementById("mcList");list.innerHTML="";
  mapComments.forEach(function(c){
    var item=document.createElement("div");item.className="mc-item";
    var time=document.createElement("span");time.className="mc-time";time.textContent=c.time;
    var user=c.user_name?"<strong style='color:#ffc832'>"+c.user_name+"</strong> ":"";
    item.innerHTML=user+c.text;
    item.appendChild(time);list.appendChild(item);
  });
}
function postMapComment(){
  var input=document.getElementById("mcInput");
  var text=input.value.trim();
  if(!text)return;
  var now=new Date();
  var tz=now.toLocaleString("zh-CN",{hour12:false,timeZone:"Asia/Shanghai"});
  var uname=localStorage.getItem('abi_user')||'匿名';
  supabase("map_comments","POST",{text:text,time:tz,user_name:uname}).catch(function(){});
  mapComments.push({text:text,time:tz,user_name:uname});
  savePins();renderMapComments();
  input.value="";
}

// ===== URL 定位 =====
function jumpToFromUrl(){
  var s=new URLSearchParams(window.location.search);
  var x=s.get("x"),y=s.get("y"),name=s.get("name"),type=s.get("type"),ic=s.get("ic");
  if(!x||!y)return;
  var xf=parseFloat(x),yf=parseFloat(y);
  scale=8;
  var container=document.querySelector(".map-wrap");
  if(!container)return;
  var r=container.getBoundingClientRect();
  var centerX=r.width/2,centerY=r.height/2;
  var img=document.getElementById("mapImg");
  if(!img)return;
  var iw=img.clientWidth,ih=img.clientHeight;
  panX=centerX-xf/100*iw*scale;
  panY=centerY-yf/100*ih*scale;
  updateTransform();
  var zr=document.getElementById("zr");if(zr)zr.value=800;
  var zl=document.getElementById("zl");if(zl)zl.textContent="800%";
  addTempMarker(xf,yf,ic||null);
  if(name){showPinInfo(xf,yf,name,type,ic||null);return;}
  for(var i=0;i<pins.length;i++){
    if(Math.abs(pins[i].x-xf)+Math.abs(pins[i].y-yf)<3){showPinDetail(i);return;}
  }
  document.getElementById('cv').textContent=x+'%, '+y+'%';
  document.getElementById('ab').style.display='inline-block';
}
function addTempMarker(x,y,ic){
  var mv=document.getElementById('mv');
  if(!mv)return;
  var el=document.createElement('div');
  var s=1/scale;
  if(ic){
    el.style.cssText='position:absolute;left:'+x+'%;top:'+y+'%;transform:translate(-50%,-50%);width:'+(48*s)+'px;height:'+(48*s)+'px;z-index:999;pointer-events:none;background-image:url('+ic+');background-size:cover;border:'+(2*s)+'px solid #ff4444;border-radius:'+(5*s)+'px;box-shadow:0 0 '+(12*s)+'px rgba(255,0,0,.6)';
  }else{
    el.style.cssText='position:absolute;left:'+x+'%;top:'+y+'%;transform:translate(-50%,-50%);width:'+(24*s)+'px;height:'+(24*s)+'px;z-index:999;pointer-events:none;background:#ff4444;border:'+(3*s)+'px solid #fff;border-radius:50%;box-shadow:0 0 '+(12*s)+'px rgba(255,0,0,.6)';
  }
  mv.appendChild(el);
  var sty=document.getElementById('pulseStyle');
  if(!sty){sty=document.createElement('style');sty.id='pulseStyle';sty.textContent='@keyframes pulseMarker{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}';document.head.appendChild(sty);}
  el.style.animation='pulseMarker 1.5s infinite';
}
function showPinInfo(x,y,name,type,ic){
  var old=document.getElementById('pinInfoCard');if(old)old.remove();
  var card=document.createElement('div');card.id='pinInfoCard';
  card.innerHTML='<div style="background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:12px;padding:16px;width:280px;box-shadow:0 8px 24px rgba(0,0,0,.5);position:relative"><button onclick="this.parentElement.parentElement.remove()" style="position:absolute;top:8px;right:10px;color:#666;font-size:16px;cursor:pointer;background:none;border:none">X</button><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><img src="'+(ic||'')+'" style="width:36px;height:36px;border-radius:6px;object-fit:cover"><div><div style="color:#ffc832;font-weight:600;font-size:15px">'+(name||'未知')+'</div><div style="color:#999;font-size:12px">位置: '+x+'%, '+y+'%</div></div></div><div style="color:#888;font-size:12px;border-top:1px solid #1e1e2a;padding-top:8px;margin-top:4px">审核中 - 此点位尚未公开</div></div>';
  card.style.cssText='position:fixed;top:12px;right:12px;z-index:9999';
  document.body.appendChild(card);
}
`;

// Fix the onload function
var onloadFix = `
window.onload=function(){
  console.log("ONLOAD");
  loadCloudPins();
};
`;

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // 1) Fix SUPABASE_ANON_KEY -> SUPABASE_KEY (c is already correct since we restore it in inject)
  // Replace SUPABASE_ANON_KEY with SUPABASE_KEY in supabase function
  c = c.replace(/SUPABASE_ANON_KEY/g, 'SUPABASE_KEY');
  
  // 2) Remove old duplicate auth IIFE block (the one from 34bb679 era)
  var dupStart = c.indexOf('// ========== GLOBAL AUTH & NAV ==========');
  if (dupStart >= 0) {
    var dupEnd = c.indexOf('var SUPABASE_URL', dupStart);
    if (dupEnd < 0) dupEnd = c.lastIndexOf('})();', dupStart) + 5;
    if (dupEnd > dupStart) {
      c = c.substring(0, dupStart) + c.substring(dupEnd);
    }
  }
  
  // 3) Remove any stray duplicate auth code
  // Find '' around old initAuth
  var strayStart = c.indexOf("(function initAuth(){");
  if (strayStart >= 0) {
    var strayEnd = c.indexOf("})();", strayStart) + 5;
    if (strayEnd > strayStart) {
      c = c.substring(0, strayStart) + c.substring(strayEnd);
    }
  }

  // 4) Remove the old safety setTimeout and auth IFFE block from last script
  c = c.replace('// ===== GLOBAL AUTH & NAV =====', '');
  
  // 5) Insert core JS - replace the supabase() + loadCloudPins section with new version
  // First find the existing supabase/loadCloudPins section and remove it
  var supStart = c.indexOf('function supabase(');
  if (supStart > 0) {
    // Find end - go to the end of jumpToFromUrl + showPinInfo or to onload
    var endMarker = c.indexOf("// Safety: force check login state after 500ms");
    if (endMarker < 0) endMarker = c.indexOf("setTimeout(function(){\n    var token=localStorage.getItem", supStart);
    if (endMarker < 0) endMarker = c.lastIndexOf('</script>');
    
    if (endMarker > supStart) {
      c = c.substring(0, supStart - 200) + c.substring(endMarker);
    }
  }
  
  // 6) Insert core JS right before onload fix
  var onloadIdx = c.indexOf("window.onload=function");
  if (onloadIdx < 0) onloadIdx = c.lastIndexOf('</script>');
  
  if (onloadIdx >= 0) {
    var myCore = coreJs.replace(/MAP_ENG/g, mapEng[i]).replace(/MAP_CN/g, mapNames[i]);
    c = c.substring(0, onloadIdx) + myCore + onloadFix + c.substring(onloadIdx);
  }
  
  // 7) Remove stray empty lines from duplicate removal
  c = c.replace(/\n{4,}/g, '\n\n');
  
  fs.writeFileSync(fp, c);
  console.log(name + ': fixed');
});

console.log('All done');
