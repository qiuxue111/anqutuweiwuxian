const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

var inject = `// ===== 地图核心交互 v2 =====
var scaleM=1,panX=0,panY=0,isDragging=false,startX,startY,startPanX,startPanY;
var mode='browse',pins=[],mapComments=[],curPinIdx=null;
var touchStartDist=0,touchStartScale=1;
var mapNameEng='ENG';
var mapNameCN='CN';
var cloudPins=[],cloudComments=[];
var BI='https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/';
var pinTypes=[
  {n:'普通物资箱',c:'物资'},{n:'高级物资箱',c:'物资'},{n:'子弹箱',c:'弹药'},{n:'医疗箱',c:'医疗'},
  {n:'工具箱',c:'工具'},{n:'文件柜',c:'文档'},{n:'大衣',c:'衣物'},{n:'抽屉',c:'家具'},{n:'保险箱',c:'贵重'},
  {n:'旅行箱',c:'容器'},{n:'运动包',c:'容器'},{n:'专业军备箱',c:'军备'},{n:'大型武器箱',c:'武器'},
  {n:'手雷箱',c:'弹药'},{n:'战术配件箱',c:'配件'},{n:'通用钥匙',c:'钥匙'},{n:'密码门',c:'密室'},
  {n:'密室',c:'密室'},{n:'普通敌人',c:'敌人'},{n:'精英敌人',c:'敌人'},{n:'游荡者',c:'敌人'},
  {n:'首领',c:'BOSS'},{n:'其他',c:'其他'}
];
var iconM={'普通物资箱':BI+'container.png','高级物资箱':BI+'rare.png','工具箱':BI+'toolbox.png','文件柜':BI+'cabinet.png',
  '大衣':BI+'coat.png','保险箱':BI+'safe.png','运动包':BI+'bag.png','旅行箱':BI+'suitcase.png',
  '手雷箱':BI+'grenade.png','子弹箱':BI+'ammo.png','医疗箱':BI+'medkit.png','大型武器箱':BI+'weaponcase.png',
  '专业军备箱':BI+'equipment.png','战术配件箱':BI+'accessory.png','抽屉':BI+'drawer.png',
  '通用钥匙':BI+'key.png','密码门':BI+'door.png','密室':BI+'secretroom.png',
  '普通敌人':BI+'enemy.png','精英敌人':BI+'elite.png','游荡者':BI+'roamer.png','首领':BI+'boss.png','其他':BI+'other.png'
};
var layerData={};

function zoom(f,cx,cy){
  if(cx===void 0||cy===void 0){scaleM*=f;}
  else{var prev=scaleM;scaleM*=f;panX=cx-(cx-panX)*scaleM/prev;panY=cy-(cy-panY)*scaleM/prev;}
  if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();
}
function zoomTo(v,cx,cy){
  v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;
  if(cx!==void 0&&cy!==void 0){var r=v/scaleM;panX=cx-(cx-panX)/r;panY=cy-(cy-panY)/r;}
  scaleM=v;ut();
}
function resetView(){scaleM=1;panX=0;panY=0;var e=document.getElementById('mv');if(e)e.style.transform='translate(0px,0px) scale(1)';var zr=document.getElementById('zr');if(zr)zr.value=100;var zl=document.getElementById('zl');if(zl)zl.textContent='100%';}
function ut(){var el=document.getElementById('mv');if(!el)return;el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';}
document.addEventListener('mousedown',function(e){var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target)||e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;isDragging=true;startX=e.clientX;startY=e.clientY;startPanX=panX;startPanY=panY;if(e.target===mv||e.target===document.getElementById('mapImg'))e.preventDefault();});
document.addEventListener('mousemove',function(e){if(isDragging){panX=startPanX+e.clientX-startX;panY=startPanY+e.clientY-startY;ut();}});
document.addEventListener('mouseup',function(){isDragging=false;});
document.addEventListener('wheel',function(e){var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;e.preventDefault();var r=mv.getBoundingClientRect();zoom(e.deltaY<0?1.1:0.9,e.clientX-r.left,e.clientY-r.top);},{passive:false});
['touchstart','touchmove','touchend'].forEach(function(ev){document.addEventListener(ev,function(e){var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;if(ev==='touchstart'&&e.touches.length===1){isDragging=true;startX=e.touches[0].clientX;startY=e.touches[0].clientY;startPanX=panX;startPanY=panY;}else if(ev==='touchmove'&&e.touches.length===1&&isDragging){panX=startPanX+e.touches[0].clientX-startX;panY=startPanY+e.touches[0].clientY-startY;ut();}else if(ev==='touchstart'&&e.touches.length===2){touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);touchStartScale=scaleM;}else if(ev==='touchmove'&&e.touches.length===2){scaleM=touchStartScale*(Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/touchStartDist);if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();}else if(ev==='touchend'){isDragging=false;}});});
function toggleMode(){mode=mode==='browse'?'place':'browse';var btn=document.getElementById('mdBtn');if(btn)btn.textContent=mode==='place'?'📍 放置':'👁️ 浏览';var ch=document.getElementById('ch');if(ch)ch.classList.toggle('show',mode==='place');}
document.addEventListener('click',function(e){if(mode!=='place')return;var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target)||e.target===document.getElementById('mdBtn'))return;var img=document.getElementById('mapImg');if(!img)return;var r=img.getBoundingClientRect();var x=((e.clientX-r.left)/r.width*100).toFixed(2);var y=((e.clientY-r.top)/r.height*100).toFixed(2);document.getElementById('cv').textContent=x+'%, '+y+'%';document.getElementById('ab').style.display='inline-block';document.getElementById('ch').classList.remove('show');});

function loadCloudPins(){
  var a=[];
  a.push(supabase('pins','GET',null,'map_name=eq.'+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudPins=d;cloudPins.forEach(function(p){delete p.created_at;});}}));
  a.push(supabase('map_comments','GET',null,'map_name=eq.'+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudComments=d;cloudComments.forEach(function(c){delete c.id;delete c.created_at;});}}));
  Promise.all(a).then(function(){pins=cloudPins.slice();mapComments=cloudComments.slice();savePins();renderMarkers();renderMapComments();jumpToFromUrl();}).catch(function(){try{var d=JSON.parse(localStorage.getItem('abi_'+mapNameEng+'_pins'));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;renderMarkers();renderMapComments();jumpToFromUrl();}}catch(e){}});
}
function savePins(){localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));}
function renderMarkers(){
  var mv=document.getElementById('mv');if(!mv)return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=p.ic||'';
    if(ic)el.innerHTML='<img src=\"'+ic+'\" style=\"width:32px;height:32px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,200,50,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.5)\">';
    else el.innerHTML='<div style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"></div>';
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);
  });
}
function showPinDetail(idx){curPinIdx=idx;var p=pins[idx];document.getElementById('pdTitle').innerHTML='<img src=\"'+(p.ic||'')+'\" style=\"width:28px;height:28px;border-radius:4px;object-fit:cover\"> '+p.name;document.getElementById('pdCoord').textContent='位置： '+p.x+'%, '+p.y+'%';document.getElementById('pdNote').value=p.note||'';renderPinImages();renderPinComments();document.getElementById('pd').classList.add('show');}
function closePinDetail(){document.getElementById('pd').classList.remove('show');curPinIdx=null;}
function savePinNote(){if(curPinIdx===null)return;pins[curPinIdx].note=document.getElementById('pdNote').value;savePins();}
function renderPinImages(){var grid=document.getElementById('pdImgGrid');grid.innerHTML='';if(curPinIdx===null)return;var imgs=pins[curPinIdx].images||[];imgs.forEach(function(src,i){var img=document.createElement('img');img.src=src;img.onclick=function(){if(confirm('删除此图片？')){pins[curPinIdx].images.splice(i,1);savePins();renderPinImages();}};grid.appendChild(img);});var ab=document.createElement('div');ab.className='pd-add-img';ab.textContent='+';ab.onclick=function(){document.getElementById('pdImgInput').click();};grid.appendChild(ab);}
function addPinImages(files){if(curPinIdx===null||!files.length)return;var done=0,total=files.length;for(var i=0;i<files.length;i++){(function(f){var r=new FileReader();r.onload=function(e){pins[curPinIdx].images.push(e.target.result);done++;if(done===total){savePins();renderPinImages();}};r.readAsDataURL(f);})(files[i]);}}
function deleteCurrentPin(){if(!localStorage.getItem('abi_token')){loginGitHub();return;}if(curPinIdx===null)return;var p=pins[curPinIdx];if(!confirm('确认提交删除申请？'))return;var uname=localStorage.getItem('abi_user')||'匿名';if(p.id){supabase('deletion_requests','POST',{pin_id:p.id,name:p.name,x:p.x,y:p.y,submitted_by:uname,reason:'用户提交',votes:0,voters:[]}).then(function(){alert('删除申请已提交。');}).catch(function(){pins.splice(curPinIdx,1);curPinIdx=null;savePins();renderMarkers();closePinDetail();alert('本地删除成功');});}else{pins.splice(curPinIdx,1);curPinIdx=null;savePins();renderMarkers();closePinDetail();}}
function renderPinComments(){var list=document.getElementById('pdcList');list.innerHTML='';if(curPinIdx===null)return;(pins[curPinIdx].comments||[]).forEach(function(c){var item=document.createElement('div');item.className='pdc-item';var time=document.createElement('span');time.className='pdc-time';time.textContent=c.time;item.innerHTML=(c.user_name?'<strong style=\"color:#ffc832\">'+c.user_name+'</strong> ':'')+c.text;item.appendChild(time);list.appendChild(item);});}
function postPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'匿名';var p=pins[curPinIdx];if(p.id)supabase('map_comments','POST',{text:text,time:tz,user_name:uname}).catch(function(){});if(!p.comments)p.comments=[];p.comments.push({text:text,time:tz,user_name:uname});savePins();renderPinComments();input.value='';}
function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.className='mc-item';var time=document.createElement('span');time.className='mc-time';time.textContent=c.time;item.innerHTML=(c.user_name?'<strong style=\"color:#ffc832\">'+c.user_name+'</strong> ':'')+c.text;item.appendChild(time);list.appendChild(item);});}
function postMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'匿名';supabase('map_comments','POST',{text:text,time:tz,user_name:uname}).catch(function(){});mapComments.push({text:text,time:tz,user_name:uname});savePins();renderMapComments();input.value='';}

function showPicker(){
  var op=document.getElementById('pinTypeMenu');if(op){op.remove();return;}
  var menu=document.createElement('div');menu.id='pinTypeMenu';
  menu.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.97);border:1px solid #1e1e2a;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;z-index:99999;min-width:320px;box-shadow:0 8px 40px rgba(0,0,0,.7)';
  var ti=document.createElement('div');ti.style.cssText='color:#ffc832;font-size:18px;font-weight:600;margin-bottom:12px;border-bottom:1px solid rgba(255,200,50,.15);padding-bottom:8px';ti.textContent='选择容器类型';menu.appendChild(ti);
  var cats={};pinTypes.forEach(function(t){if(!cats[t.c])cats[t.c]=[];cats[t.c].push(t);});
  var order=['物资','弹药','医疗','工具','文档','衣物','家具','贵重','容器','军备','武器','配件','钥匙','密室','敌人','BOSS','其他'];
  order.forEach(function(cat){if(!cats[cat])return;var s=document.createElement('div');s.style.cssText='margin-bottom:10px';var h=document.createElement('div');h.style.cssText='color:#888;font-size:12px;margin-bottom:4px;padding:0 4px';h.textContent=cat;s.appendChild(h);var g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px';cats[cat].forEach(function(t){var b=document.createElement('button');b.style.cssText='padding:8px 4px;background:rgba(255,200,50,.08);border:1px solid rgba(255,200,50,.12);border-radius:8px;color:#ddd;cursor:pointer;font-size:13px;';b.textContent=t.n;b.onmouseenter=function(){this.style.background='rgba(255,200,50,.2)';};b.onmouseleave=function(){this.style.background='rgba(255,200,50,.08)';};b.onclick=function(){placePin(t);menu.remove();};g.appendChild(b);});s.appendChild(g);menu.appendChild(s);});
  var cb=document.createElement('button');cb.textContent='取消';cb.style.cssText='margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%';cb.onclick=function(){menu.remove();};menu.appendChild(cb);
  document.body.appendChild(menu);
}
function placePin(tp){if(!localStorage.getItem('abi_token')){loginGitHub();return;}var cv=document.getElementById('cv');if(!cv||cv.textContent==='未选择'){alert('请先在地图上点击选择位置');return;}var parts=cv.textContent.split(',');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert('位置无效');return;}var ic=iconM[tp.n]||'';var pin={name:tp.n,type:tp.n,x:x,y:y,ic:ic,note:'',images:[],comments:[],map_name:mapNameCN};supabase('pins','POST',pin).then(function(data){if(data&&data.id)pin.id=data.id;pins.push(pin);savePins();renderMarkers();cv.textContent='未选择';document.getElementById('ab').style.display='none';alert('投稿成功！');}).catch(function(){pins.push(pin);savePins();renderMarkers();cv.textContent='未选择';document.getElementById('ab').style.display='none';alert('本地保存成功');});}

function renderLayers(){var lp=document.getElementById('lp');if(!lp)return;var keys=Object.keys(layerData);if(keys.length===0){lp.innerHTML='<div style=\"color:#888;padding:20px;text-align:center;font-size:14px\">暂无层级数据</div>';return;}var html='<label class=\"all-label\"><input type=\"checkbox\" checked onchange=\"toggleAllLayers(this.checked)\"> 全部显示</label>';keys.forEach(function(k){html+='<div class=\"ly-card\"><div class=\"ly-card-hdr\"><input type=\"checkbox\" checked onchange=\"toggleLayer(\"'+k.replace(/'/g,"\\\\'")+'\\',this.checked)\"> '+k+'</div>'+(layerData[k]||[]).map(function(item){return '<label><input type=\"checkbox\" checked data-layer=\"'+k+'\"> 📍 '+item+'</label>';}).join('')+'</div>';});lp.innerHTML=html;}
function toggleAllLayers(c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});}
function toggleLayer(n,c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-layer="'+n+'"]').forEach(function(cb){cb.checked=c;});}
function filterPins(){}
(function initLayerBtn(){var b=document.getElementById('lbb');var lp=document.getElementById('lp');if(b&&lp){b.onclick=function(e){e.stopPropagation();lp.classList.toggle('show');renderLayers();};document.addEventListener('click',function(e){if(lp&&!lp.contains(e.target)&&e.target!==b)lp.classList.remove('show');});}})();

function jumpToFromUrl(){var s=new URLSearchParams(window.location.search);var x=s.get('x'),y=s.get('y'),name=s.get('name'),type=s.get('type'),ic=s.get('ic');if(!x||!y)return;var xf=parseFloat(x),yf=parseFloat(y);scaleM=8;var container=document.querySelector('.map-wrap');if(!container)return;var r=container.getBoundingClientRect();var cx=r.width/2,cy=r.height/2;var img=document.getElementById('mapImg');if(!img)return;panX=cx-xf/100*img.clientWidth*scaleM;panY=cy-yf/100*img.clientHeight*scaleM;ut();var zr=document.getElementById('zr');if(zr)zr.value=800;var zl=document.getElementById('zl');if(zl)zl.textContent='800%';var mv=document.getElementById('mv');if(!mv)return;var el=document.createElement('div');el.style.cssText='position:absolute;left:'+xf+'%;top:'+yf+'%;transform:translate(-50%,-50%);width:'+(24/scaleM)+'px;height:'+(24/scaleM)+'px;z-index:999;pointer-events:none;background:#ff4444;border:'+(3/scaleM)+'px solid #fff;border-radius:50%;box-shadow:0 0 '+(12/scaleM)+'px rgba(255,0,0,.6)';mv.appendChild(el);if(name){var card=document.createElement('div');card.id='pinInfoCard';card.innerHTML='<div style=\"background:rgba(18,18,26,.96);border:1px solid #1e1e2a;border-radius:12px;padding:16px;width:280px;box-shadow:0 8px 24px rgba(0,0,0,.5);position:relative\"><button onclick=\"this.parentElement.parentElement.remove()\" style=\"position:absolute;top:8px;right:10px;color:#666;font-size:16px;cursor:pointer;background:none;border:none\">X</button><div style=\"display:flex;align-items:center;gap:10px;margin-bottom:8px\"><img src=\"'+(ic||'')+'\" style=\"width:36px;height:36px;border-radius:6px;object-fit:cover\"><div><div style=\"color:#ffc832;font-weight:600;font-size:15px\">'+(name||'未知')+'</div><div style=\"color:#999;font-size:12px\">位置: '+xf+'%, '+yf+'%</div></div></div><div style=\"color:#888;font-size:12px;border-top:1px solid #1e1e2a;padding-top:8px;margin-top:4px\">审核中 - 此点位尚未公开</div></div>';card.style.cssText='position:fixed;top:12px;right:12px;z-index:9999';document.body.appendChild(card);return;}
  for(var i=0;i<pins.length;i++){if(Math.abs(pins[i].x-xf)+Math.abs(pins[i].y-yf)<3){showPinDetail(i);return;}}
  document.getElementById('cv').textContent=x+'%, '+y+'%';document.getElementById('ab').style.display='inline-block';}

window.onload2=function(){console.log('ONLOAD');loadCloudPins();};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',window.onload2);
else setTimeout(window.onload2,100);
`;

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) { console.log(name + ': not found'); return; }
  var c = fs.readFileSync(fp, 'utf8');
  
  var replaced = inject
    .replace(/mapNameEng='ENG'/g, "mapNameEng='" + mapEng[i] + "'")
    .replace(/mapNameCN='CN'/g, "mapNameCN='" + mapNames[i] + "'");
  
  // Insert before </script>
  var scriptEnd = c.lastIndexOf('</script>');
  if (scriptEnd < 0) { console.log(name + ': no script'); return; }
  
  // Get the last line before </script> and add our code
  c = c.substring(0, scriptEnd) + '\n' + replaced + '\n' + c.substring(scriptEnd);
  
  fs.writeFileSync(fp, c);
  console.log(name + ': injected (' + replaced.length + ' chars)');
});

console.log('All done');
