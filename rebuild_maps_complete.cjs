const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

// Read the full JS from farm (has extraCode already) and add zoom/core before it
var farmContent = fs.readFileSync(root + '\\pages\\map-farm.html', 'utf8');
var scriptMatch = farmContent.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.log('ERROR: no script found'); process.exit(1); }

var existingScript = scriptMatch[1];

// Extract auth code (loginGitHub, hash handler, logout, toggleMenu, showUserCenter, supabase)
var authPart = '';
var supabasePart = '';
var extraPart = '';

// Find supabase function
var supIdx = existingScript.indexOf('function supabase(');
if (supIdx >= 0) {
  authPart = existingScript.substring(0, supIdx);
  // Find the end of supabase function - look for function renderMarkers or next function
  var nextFunc = existingScript.indexOf('\nfunction ', supIdx + 20);
  if (nextFunc < 0) nextFunc = existingScript.indexOf('\n// =====', supIdx);
  if (nextFunc < 0) nextFunc = existingScript.length;
  supabasePart = existingScript.substring(supIdx, nextFunc);
  extraPart = existingScript.substring(nextFunc);
} else {
  // No supabase found, everything is auth
  authPart = existingScript;
  supabasePart = '';
  extraPart = '';
}

// Also find the duplicate initAuth and remove
var dupIdx = authPart.indexOf('function initAuth');
if (dupIdx >= 0) {
  var dupEnd = authPart.indexOf('})();', dupIdx) + 5;
  if (dupEnd > dupIdx) {
    authPart = authPart.substring(0, dupIdx) + authPart.substring(dupEnd);
  }
}
dupIdx = authPart.indexOf('// ========== GLOBAL AUTH & NAV ==========');
if (dupIdx >= 0) {
  var dupEnd = authPart.indexOf('// =====', dupIdx);
  if (dupEnd < 0) dupEnd = authPart.indexOf('var SUPABASE_URL', dupIdx);
  if (dupEnd > dupIdx) {
    authPart = authPart.substring(0, dupIdx) + '\n' + authPart.substring(dupEnd);
  }
}

// Clean up extraPart - remove duplicate renderMarkers, showPinDetail, etc from extraCode
// Keep only: showPicker, placePin, renderLayers, toggleAllLayers, toggleLayer, filterPins, 
// pinTypes, iconMap, iconUrls, layerData, window.onload, updateAuthUI

// Build the complete script
var completeScript = authPart + '\n\n' + supabasePart + '\n\n' + `// ===== 地图核心交互 =====
var scale=1,panX=0,panY=0,isDragging=false,startX,startY,startPanX,startPanY;
var mode='browse',pins=[],mapComments=[],curPinIdx=null;
var touchStartDist=0,touchStartScale=1;
var mapNameEng='MAP_ENG';
var mapNameCN='MAP_CN';
var cloudPins=[],cloudComments=[];

function zoom(f,cx,cy){
  if(cx===undefined||cy===undefined){scale*=f;}
  else{scale*=f;var ix=(cx-panX)/f*scale;var iy=(cy-panY)/f*scale;panX=cx-ix;panY=cy-iy;}
  if(scale<0.2)scale=0.2;if(scale>8)scale=8;updateTransform();
}
function zoomTo(v,cx,cy){
  v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;
  if(cx!==undefined&&cy!==undefined){var ratio=v/scale;panX=cx-(cx-panX)/ratio;panY=cy-(cy-panY)/ratio;}
  scale=v;updateTransform();
}
function resetView(){scale=1;panX=0;panY=0;var mv=document.getElementById('mv');if(mv){mv.style.transform='translate(0px,0px) scale(1)';}var zr=document.getElementById('zr');if(zr)zr.value=100;var zl=document.getElementById('zl');if(zl)zl.textContent='100%';}
function updateTransform(){
  var el=document.getElementById('mv');if(!el)return;
  el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scale+')';
  var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scale*100);
  var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scale*100)+'%';
}
document.addEventListener('mousedown',function(e){
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
  if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;
  isDragging=true;startX=e.clientX;startY=e.clientY;startPanX=panX;startPanY=panY;
  if(e.target===mv||e.target===document.getElementById('mapImg'))e.preventDefault();
});
document.addEventListener('mousemove',function(e){if(!isDragging)return;panX=startPanX+(e.clientX-startX);panY=startPanY+(e.clientY-startY);updateTransform();});
document.addEventListener('mouseup',function(){isDragging=false;});
document.addEventListener('wheel',function(e){
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
  e.preventDefault();var r=mv.getBoundingClientRect();
  zoom(e.deltaY<0?1.1:0.9,e.clientX-r.left,e.clientY-r.top);
},{passive:false});
document.addEventListener('touchstart',function(e){
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
  if(e.touches.length===1){isDragging=true;startX=e.touches[0].clientX;startY=e.touches[0].clientY;startPanX=panX;startPanY=panY;}
  else if(e.touches.length===2){(touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY));touchStartScale=scale;}
});
document.addEventListener('touchmove',function(e){
  if(e.touches.length===1&&isDragging){panX=startPanX+(e.touches[0].clientX-startX);panY=startPanY+(e.touches[0].clientY-startY);updateTransform();}
  else if(e.touches.length===2){scale=touchStartScale*(Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/touchStartDist);if(scale<0.2)scale=0.2;if(scale>8)scale=8;updateTransform();}
});
document.addEventListener('touchend',function(){isDragging=false;});
function toggleMode(){
  mode=mode==='browse'?'place':'browse';
  var btn=document.getElementById('mdBtn');
  if(btn)btn.textContent=mode==='place'?'\\uD83D\\uDCCD \\u653E\\u7F6E':'\\uD83D\\uDC41\\uFE0F \\u6D4F\\u89C8';
  var ch=document.getElementById('ch');if(ch)ch.classList.toggle('show',mode==='place');
}
document.addEventListener('click',function(e){
  if(mode!=='place')return;
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
  if(e.target===document.getElementById('mdBtn'))return;
  var img=document.getElementById('mapImg');if(!img)return;
  var rect=img.getBoundingClientRect();
  var x=((e.clientX-rect.left)/rect.width*100).toFixed(2);
  var y=((e.clientY-rect.top)/rect.height*100).toFixed(2);
  document.getElementById('cv').textContent=x+'%, '+y+'%';
  document.getElementById('ab').style.display='inline-block';
  document.getElementById('ch').classList.remove('show');
});

// ===== 标记点渲染 =====
function renderMarkers(){
  var mv=document.getElementById('mv');if(!mv)return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=p.ic||'';if(ic)el.innerHTML='<img src=\"'+ic+'\" style=\"width:32px;height:32px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,200,50,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.5)\">';
    else el.innerHTML='<div style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"></div>';
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);
  });
}

// ===== 容器详情 =====
function showPinDetail(idx){
  curPinIdx=idx;var p=pins[idx];
  document.getElementById('pdTitle').innerHTML='<img src=\"'+(p.ic||'')+'\" style=\"width:28px;height:28px;border-radius:4px;object-fit:cover\"> '+p.name;
  document.getElementById('pdCoord').textContent='位置： '+p.x+'%, '+p.y+'%';
  document.getElementById('pdNote').value=p.note||'';renderPinImages();renderPinComments();document.getElementById('pd').classList.add('show');
}
function closePinDetail(){document.getElementById('pd').classList.remove('show');curPinIdx=null;}
function savePinNote(){if(curPinIdx===null)return;pins[curPinIdx].note=document.getElementById('pdNote').value;savePins();}
function renderPinImages(){
  var grid=document.getElementById('pdImgGrid');grid.innerHTML='';if(curPinIdx===null)return;
  var imgs=pins[curPinIdx].images||[];
  imgs.forEach(function(src,i){var img=document.createElement('img');img.src=src;img.onclick=function(){if(confirm('删除此图片？')){pins[curPinIdx].images.splice(i,1);savePins();renderPinImages();}};grid.appendChild(img);});
  var ab=document.createElement('div');ab.className='pd-add-img';ab.textContent='+';ab.onclick=function(){document.getElementById('pdImgInput').click();};grid.appendChild(ab);
}
function addPinImages(files){
  if(curPinIdx===null||!files.length)return;var done=0,total=files.length;
  for(var i=0;i<files.length;i++){(function(f){var r=new FileReader();r.onload=function(e){pins[curPinIdx].images.push(e.target.result);done++;if(done===total){savePins();renderPinImages();}};r.readAsDataURL(f);})(files[i]);}
}

// ===== 评论区 =====
function renderPinComments(){
  var list=document.getElementById('pdcList');list.innerHTML='';if(curPinIdx===null)return;
  var comments=pins[curPinIdx].comments||[];
  comments.forEach(function(c){var item=document.createElement('div');item.className='pdc-item';var time=document.createElement('span');time.className='pdc-time';time.textContent=c.time;var user=c.user_name?'<strong style=\"color:#ffc832\">'+c.user_name+'</strong> ':'';item.innerHTML=user+c.text;item.appendChild(time);list.appendChild(item);});
}
function postPinComment(){
  if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;
  var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'匿名';
  var p=pins[curPinIdx];if(p.id){supabase('map_comments','POST',{text:text,time:tz,user_name:uname});}
  if(!p.comments)p.comments=[];p.comments.push({text:text,time:tz,user_name:uname});savePins();renderPinComments();input.value='';
}
function renderMapComments(){
  var list=document.getElementById('mcList');list.innerHTML='';
  mapComments.forEach(function(c){var item=document.createElement('div');item.className='mc-item';var time=document.createElement('span');time.className='mc-time';time.textContent=c.time;var user=c.user_name?'<strong style=\"color:#ffc832\">'+c.user_name+'</strong> ':'';item.innerHTML=user+c.text;item.appendChild(time);list.appendChild(item);});
}
function postMapComment(){
  var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;
  var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'匿名';
  supabase('map_comments','POST',{text:text,time:tz,user_name:uname}).catch(function(){});
  mapComments.push({text:text,time:tz,user_name:uname});savePins();renderMapComments();input.value='';
}

// ===== 容器类型选择器 =====
var pinTypes=[
  {name:'普通物资箱',cat:'物资'},{name:'高级物资箱',cat:'物资'},{name:'子弹箱',cat:'弹药'},{name:'医疗箱',cat:'医疗'},
  {name:'工具箱',cat:'工具'},{name:'文件柜',cat:'文档'},{name:'大衣',cat:'衣物'},{name:'抽屉',cat:'家具'},
  {name:'保险箱',cat:'贵重'},{name:'旅行箱',cat:'容器'},{name:'运动包',cat:'容器'},{name:'专业军备箱',cat:'军备'},
  {name:'大型武器箱',cat:'武器'},{name:'手雷箱',cat:'弹药'},{name:'战术配件箱',cat:'配件'},{name:'通用钥匙',cat:'钥匙'},
  {name:'密码门',cat:'密室'},{name:'密室',cat:'密室'},{name:'普通敌人',cat:'敌人'},{name:'精英敌人',cat:'敌人'},
  {name:'游荡者',cat:'敌人'},{name:'首领',cat:'BOSS'},{name:'其他',cat:'其他'}
];
var BI='https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/';
var iconMap={
  '普通物资箱':BI+'container.png','高级物资箱':BI+'rare.png','工具箱':BI+'toolbox.png','文件柜':BI+'cabinet.png',
  '大衣':BI+'coat.png','保险箱':BI+'safe.png','运动包':BI+'bag.png','旅行箱':BI+'suitcase.png',
  '手雷箱':BI+'grenade.png','子弹箱':BI+'ammo.png','医疗箱':BI+'medkit.png','大型武器箱':BI+'weaponcase.png',
  '专业军备箱':BI+'equipment.png','战术配件箱':BI+'accessory.png','抽屉':BI+'drawer.png',
  '通用钥匙':BI+'key.png','密码门':BI+'door.png','密室':BI+'secretroom.png',
  '普通敌人':BI+'enemy.png','精英敌人':BI+'elite.png','游荡者':BI+'roamer.png','首领':BI+'boss.png','其他':BI+'other.png'
};
function showPicker(){
  var op=document.getElementById('pinTypeMenu');if(op){op.remove();return;}
  var menu=document.createElement('div');menu.id='pinTypeMenu';
  menu.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.97);border:1px solid #1e1e2a;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;z-index:99999;min-width:320px;box-shadow:0 8px 40px rgba(0,0,0,.7)';
  var ti=document.createElement('div');ti.style.cssText='color:#ffc832;font-size:18px;font-weight:600;margin-bottom:12px;border-bottom:1px solid rgba(255,200,50,.15);padding-bottom:8px';ti.textContent='选择容器类型';menu.appendChild(ti);
  var cats={};pinTypes.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t);});
  var order=['物资','弹药','医疗','工具','文档','衣物','家具','贵重','容器','军备','武器','配件','钥匙','密室','敌人','BOSS','其他'];
  order.forEach(function(cat){
    if(!cats[cat])return;
    var s=document.createElement('div');s.style.cssText='margin-bottom:10px';
    var h=document.createElement('div');h.style.cssText='color:#888;font-size:12px;margin-bottom:4px;padding:0 4px';h.textContent=cat;s.appendChild(h);
    var g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px';
    cats[cat].forEach(function(t){
      var b=document.createElement('button');b.style.cssText='padding:8px 4px;background:rgba(255,200,50,.08);border:1px solid rgba(255,200,50,.12);border-radius:8px;color:#ddd;cursor:pointer;font-size:13px;';
      b.textContent=t.name;
      b.onmouseenter=function(){this.style.background='rgba(255,200,50,.2)';};
      b.onmouseleave=function(){this.style.background='rgba(255,200,50,.08)';};
      b.onclick=function(){placePin(t);menu.remove();};
      g.appendChild(b);
    });
    s.appendChild(g);menu.appendChild(s);
  });
  var cb=document.createElement('button');cb.textContent='取消';cb.style.cssText='margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%';cb.onclick=function(){menu.remove();};menu.appendChild(cb);
  document.body.appendChild(menu);
}
function placePin(type){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  var cv=document.getElementById('cv');if(!cv||cv.textContent==='未选择'){alert('请先在地图上点击选择位置');return;}
  var parts=cv.textContent.split(',');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);
  if(isNaN(x)||isNaN(y)){alert('位置无效');return;}
  var ic=iconMap[type.name]||'';
  var pin={name:type.name,type:type.name,x:x,y:y,ic:ic,note:'',images:[],comments:[],map_name:mapNameCN};
  var uname=localStorage.getItem('abi_user')||'匿名';
  supabase('pins','POST',pin).then(function(data){if(data&&data.id)pin.id=data.id;pins.push(pin);savePins();renderMarkers();cv.textContent='未选择';document.getElementById('ab').style.display='none';alert('投稿成功！');}).catch(function(){pins.push(pin);savePins();renderMarkers();cv.textContent='未选择';document.getElementById('ab').style.display='none';alert('本地保存成功');});
}

// ===== 删除申请 =====
function deleteCurrentPin(){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  if(curPinIdx===null)return;var p=pins[curPinIdx];
  if(!confirm('确认提交删除申请？'))return;
  var uname=localStorage.getItem('abi_user')||'匿名';
  if(p.id){supabase('deletion_requests','POST',{pin_id:p.id,name:p.name,x:p.x,y:p.y,submitted_by:uname,reason:'用户提交',votes:0,voters:[]}).then(function(){alert('删除申请已提交。');}).catch(function(){pins.splice(curPinIdx,1);curPinIdx=null;savePins();renderMarkers();closePinDetail();alert('本地删除成功');});}
  else{pins.splice(curPinIdx,1);curPinIdx=null;savePins();renderMarkers();closePinDetail();}
}

// ===== 图层 =====
var layerData={};
function renderLayers(){
  var lp=document.getElementById('lp');if(!lp)return;
  var keys=Object.keys(layerData);if(keys.length===0){lp.innerHTML='<div style="color:#888;padding:20px;text-align:center;font-size:14px">暂无层级数据</div>';return;}
  var html='<label class="all-label"><input type="checkbox" checked onchange="toggleAllLayers(this.checked)"> 全部显示</label>';
  keys.forEach(function(k){html+='<div class="ly-card"><div class="ly-card-hdr"><input type="checkbox" checked onchange="toggleLayer(\\''+k.replace(/'/g,"\\\\'")+'\\',this.checked)"> '+k+'</div>'+(layerData[k]||[]).map(function(item){return '<label><input type="checkbox" checked data-layer="'+k+'" data-name="'+item.replace(/"/g,'&quot;')+'" onchange="filterPins()"> 📍 '+item+'</label>';}).join('')+'</div>';});
  lp.innerHTML=html;
}
function toggleAllLayers(c){if(!lp)var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});filterPins();}
function toggleLayer(n,c){if(!lp)var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-layer="'+n.replace(/'/g,"\\\\'")+'"]').forEach(function(cb){cb.checked=c;});filterPins();}
function filterPins(){}
(function(){var lbb=document.getElementById('lbb');var lp2=document.getElementById('lp');if(lbb&&lp2){lbb.onclick=function(e){e.stopPropagation();lp2.classList.toggle('show');renderLayers();};document.addEventListener('click',function(e){if(!lp2.contains(e.target)&&e.target!==lbb)lp2.classList.remove('show');});}})();

// ===== URL 定位 =====
function jumpToFromUrl(){
  var s=new URLSearchParams(window.location.search);var x=s.get('x'),y=s.get('y'),name=s.get('name'),type=s.get('type'),ic=s.get('ic');
  if(!x||!y)return;var xf=parseFloat(x),yf=parseFloat(y);
  scale=8;var container=document.querySelector('.map-wrap');if(!container)return;
  var r=container.getBoundingClientRect();var cx=r.width/2,cy=r.height/2;
  var img=document.getElementById('mapImg');if(!img)return;
  panX=cx-xf/100*img.clientWidth*scale;panY=cy-yf/100*img.clientHeight*scale;
  updateTransform();var zr=document.getElementById('zr');if(zr)zr.value=800;var zl=document.getElementById('zl');if(zl)zl.textContent='800%';
  addTempMarker(xf,yf,ic||null);
  if(name){showPinInfo(xf,yf,name,type,ic||null);return;}
  for(var i=0;i<pins.length;i++){if(Math.abs(pins[i].x-xf)+Math.abs(pins[i].y-yf)<3){showPinDetail(i);return;}}
  document.getElementById('cv').textContent=x+'%, '+y+'%';document.getElementById('ab').style.display='inline-block';
}
function addTempMarker(x,y,ic){
  var mv=document.getElementById('mv');if(!mv)return;
  var el=document.createElement('div');var s=1/scale;
  if(ic){el.style.cssText='position:absolute;left:'+x+'%;top:'+y+'%;transform:translate(-50%,-50%);width:'+(48*s)+'px;height:'+(48*s)+'px;z-index:999;pointer-events:none;background-image:url('+ic+');background-size:cover;border:'+(2*s)+'px solid #ff4444;border-radius:'+(5*s)+'px;box-shadow:0 0 '+(12*s)+'px rgba(255,0,0,.6)';}
  else{el.style.cssText='position:absolute;left:'+x+'%;top:'+y+'%;transform:translate(-50%,-50%);width:'+(24*s)+'px;height:'+(24*s)+'px;z-index:999;pointer-events:none;background:#ff4444;border:'+(3*s)+'px solid #fff;border-radius:50%;box-shadow:0 0 '+(12*s)+'px rgba(255,0,0,.6)';}
  mv.appendChild(el);var sty=document.getElementById('pulseStyle');
  if(!sty){sty=document.createElement('style');sty.id='pulseStyle';sty.textContent='@keyframes pulseMarker{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}';document.head.appendChild(sty);}
  el.style.animation='pulseMarker 1.5s infinite';
}
function showPinInfo(x,y,name,type,ic){
  var old=document.getElementById('pinInfoCard');if(old)old.remove();
  var card=document.createElement('div');card.id='pinInfoCard';
  card.innerHTML='<div style=\"background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:12px;padding:16px;width:280px;box-shadow:0 8px 24px rgba(0,0,0,.5);position:relative\"><button onclick=\"this.parentElement.parentElement.remove()\" style=\"position:absolute;top:8px;right:10px;color:#666;font-size:16px;cursor:pointer;background:none;border:none\">X</button><div style=\"display:flex;align-items:center;gap:10px;margin-bottom:8px\"><img src=\"'+(ic||'')+'\" style=\"width:36px;height:36px;border-radius:6px;object-fit:cover\"><div><div style=\"color:#ffc832;font-weight:600;font-size:15px\">'+(name||'未知')+'</div><div style=\"color:#999;font-size:12px\">位置: '+x+'%, '+y+'%</div></div></div><div style=\"color:#888;font-size:12px;border-top:1px solid #1e1e2a;padding-top:8px;margin-top:4px\">审核中 - 此点位尚未公开</div></div>';
  card.style.cssText='position:fixed;top:12px;right:12px;z-index:9999';
  document.body.appendChild(card);
}
`;

// Remove function savePins from supabasePart if it exists in core part
// Actually, supabasePart already has savePins, and we'll have duplicates. 
// Remove savePins from supabasePart if not needed, but simpler: just don't include it

// Build final script
var finalScript = authPart + '\n\n// ===== Supabase =====\n' + supabasePart + '\n\n' + completeScript;

// Now inject into each map file
maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) { console.log(name + ': not found'); return; }
  var c = fs.readFileSync(fp, 'utf8');
  
  // Replace existing script content with finalScript (with map name replaced)
  var re = /<script>([\s\S]*?)<\/script>/;
  var newScript = '<script>\n' + finalScript
    .replace(/mapNameEng='farm'/g, "mapNameEng='" + mapEng[i] + "'")
    .replace(/mapNameCN='农场'/g, "mapNameCN='" + mapNames[i] + "'") + '\n</script>';
  
  c = c.replace(re, newScript);
  fs.writeFileSync(fp, c);
  console.log(name + ': complete rebuild');
});

console.log('All done');
