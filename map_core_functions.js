window.onerror=function(m,s,l,c,err){var t='JS error: '+m+' line '+l+' col '+c;console.error(t);alert(t);return true;};

﻿// ===== 鍥炬爣鍏滃簳 =====
function supabase(table,method,body,filter){
  var url='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+table;
  var opt={method:method||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};
  if(body)opt.body=JSON.stringify(body);
  if(filter)url+='?'+filter;
  if(localStorage.getItem('abi_token'))opt.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');
  return fetch(url,opt).then(function(r){if(r.status===204)return{id:null};if(r.status>=400)throw new Error(r.status);return r.json();});
}

function getIconUrl(name) {
  var url = iconM[name] || '';
  if (url) return url;
  return '';
}

// ===== 鏍稿績鍑芥暟 =====


function loginGitHub(){
  var redirect = window.location.origin + window.location.pathname;
  var url = 'https://github.com/login/oauth/authorize?client_id=Ov23liI8CLAtMEYL2fOc&redirect_uri=' + encodeURIComponent(redirect) + '&scope=read:user';
  window.location.href = url;
}

function zoom(f,cx,cy){
  if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();return;}
  var prev=scaleM;scaleM*=f;
  if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;
  var wrap=document.querySelector('.map-wrap');if(!wrap)return;
  var wr=wrap.getBoundingClientRect();
  var mx=cx-wr.left,my=cy-wr.top;
  var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;
  panX=mx-imgX*scaleM;panY=my-imgY*scaleM;ut();
}

function zoomTo(v,cx,cy){
  v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;
  if(cx!==void 0&&cy!==void 0){
    var wrap=document.querySelector('.map-wrap');if(!wrap)return;
    var wr=wrap.getBoundingClientRect();
    var mx=cx-wr.left,my=cy-wr.top;
    var imgX=(mx-panX)/scaleM,imgY=(my-panY)/scaleM;
    panX=mx-imgX*v;panY=my-imgY*v;
  }
  scaleM=v;ut();
}

function resetView(){
  scaleM=1;panX=0;panY=0;
  var e=document.getElementById('mv');if(e)e.style.transform='translate(0px,0px) scale(1)';
  var zr=document.getElementById('zr');if(zr)zr.value=100;
  var zl=document.getElementById('zl');if(zl)zl.textContent='100%';
}

function ut(){
  var el=document.getElementById('mv');if(!el)return;
  el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';
  var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);
  var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
if(typeof renderMarkers==='function'){try{renderMarkers();}catch(e){}}}

// === init ===
(function(){
  var _d=false,_sx,_sy,_spx,_spy;
  document.addEventListener('mousedown',function(e){
    if(mode==='place')return; // place 模式下不拖拽
    var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target)||e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;
    _d=true;_sx=e.clientX;_sy=e.clientY;_spx=panX;_spy=panY;
    if(e.target===mv||e.target===document.getElementById('mapImg'))e.preventDefault();
  });
  document.addEventListener('mousemove',function(e){
    if(mode==='place')return; // place 模式不拖拽，由另一个 mousemove 处理准星
    if(_d){panX=_spx+e.clientX-_sx;panY=_spy+e.clientY-_sy;ut();}
  });
  document.addEventListener('mouseup',function(){_d=false;});
})();

document.addEventListener('wheel',function(e){
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;e.preventDefault();
  zoom(e.deltaY<0?1.1:0.9,e.clientX,e.clientY);
},{passive:false});

['touchstart','touchmove','touchend'].forEach(function(ev){
  document.addEventListener(ev,function(e){
    var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
    if(ev==='touchstart'&&e.touches.length===1){_d=true;_sx=e.touches[0].clientX;_sy=e.touches[0].clientY;_spx=panX;_spy=panY;}
    else if(ev==='touchmove'&&e.touches.length===1&&_d){panX=_spx+e.touches[0].clientX-_sx;panY=_spy+e.touches[0].clientY-_sy;ut();}
    else if(ev==='touchstart'&&e.touches.length===2){touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);touchStartScale=scaleM;}
    else if(ev==='touchmove'&&e.touches.length===2){scaleM=touchStartScale*(Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/touchStartDist);if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();}
    else if(ev==='touchend'){_d=false;}
  });
});

// === init ===
function toggleMode(){
  mode=(mode==='browse')?'place':'browse';
  var btn=document.getElementById('mdBtn');
  if(btn)btn.textContent=(mode==='place')?'馃搶 鏀剧疆':'馃憗锔?娴忚';
  var ch=document.getElementById('ch');if(ch)ch.classList.toggle('show',mode==='place');
  document.getElementById('cv').textContent='鏈€夋嫨';
  document.getElementById('ab').style.display='none';
}

document.addEventListener('mousemove',function(e){
  if(mode!=='place')return;
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target))return;
  var wrap=document.querySelector('.map-wrap');if(!wrap)return;
  var wr=wrap.getBoundingClientRect();
  var x=((e.clientX-wr.left)/wr.width*100).toFixed(2);
  var y=((e.clientY-wr.top)/wr.height*100).toFixed(2);
  var ch=document.getElementById('ch');if(ch){ch.style.left=e.clientX+'px';ch.style.top=e.clientY+'px';}
  document.getElementById('cv').textContent=x+'%, '+y+'%';
  document.getElementById('ab').style.display='inline-block';
});

document.addEventListener('click',function(e){
  if(mode!=='place')return;
  var mv=document.getElementById('mv');if(!mv||!mv.contains(e.target)||e.target===document.getElementById('mdBtn'))return;
  var wrap=document.querySelector('.map-wrap');if(!wrap)return;
  var wr=wrap.getBoundingClientRect();
  var x=((e.clientX-wr.left)/wr.width*100).toFixed(2);
  var y=((e.clientY-wr.top)/wr.height*100).toFixed(2);
  document.getElementById('cv').textContent=x+'%, '+y+'%';
  document.getElementById('ab').style.display='inline-block';
  document.getElementById('ch').classList.remove('show');
});

// === 浜戞暟鎹姞杞?===
function loadCloudPins(){
  var a=[];
  a.push(supabase('pins','GET',null,'map_name=eq.'+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudPins=d;cloudPins.forEach(function(p){delete p.created_at;});}}));
  a.push(supabase('map_comments','GET',null,'map_name=eq.'+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudComments=d;cloudComments.forEach(function(c){delete c.id;delete c.created_at;});}}));
  Promise.all(a).then(function(){pins=cloudPins.slice();mapComments=cloudComments.slice();localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();renderMapComments();jumpToFromUrl();}).catch(function(){try{var d=JSON.parse(localStorage.getItem('abi_'+mapNameEng+'_pins'));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;renderMarkers();renderMapComments();jumpToFromUrl();}}catch(e){}});
}

// === 鏍囪鐐规覆鏌?===

function renderMarkers(){
  var mv=document.getElementById('mv');if(!mv)return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=getIconUrl(p.name);
    if(ic){
      el.innerHTML='<img src="'+ic+'" style="width:'+Math.max(12,24/scaleM)+'px;height:'+Math.max(12,24/scaleM)+'px;border-radius:'+Math.max(3,6/scaleM)+'px;object-fit:cover;border:'+Math.max(1,2/scaleM)+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+Math.max(4,8/scaleM)+'px rgba(0,0,0,0.5)" onerror="this.style.display=\"none\""><div style="width:'+Math.max(8,12/scaleM)+'px;height:'+Math.max(8,12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+Math.max(1,2/scaleM)+'px solid #fff;box-shadow:0 0 '+Math.max(3,6/scaleM)+'px rgba(0,0,0,0.5);display:none"></div>';
    } else {
      el.innerHTML='<div style="width:'+Math.max(8,12/scaleM)+'px;height:'+Math.max(8,12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+Math.max(1,2/scaleM)+'px solid #fff;box-shadow:0 0 '+Math.max(3,6/scaleM)+'px rgba(0,0,0,0.5)"></div>';
    }
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);
  });
}
function showPinDetail(idx){curPinIdx=idx;var p=pins[idx];var ic=getIconUrl(p.name);document.getElementById('pdTitle').innerHTML=(ic?'<img src="'+ic+'" style="width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px"> ':'')+p.name;document.getElementById('pdCoord').textContent='位置: '+p.x+'%, '+p.y+'%';document.getElementById('pdNote').value=p.note||'';renderPinImages();renderPinComments();document.getElementById('pd').classList.add('show');}
function closePinDetail(){document.getElementById('pd').classList.remove('show');curPinIdx=null;}
function savePinNote(){if(curPinIdx===null)return;pins[curPinIdx].note=document.getElementById('pdNote').value;localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));}
function renderPinImages(){var grid=document.getElementById('pdImgGrid');grid.innerHTML='';if(curPinIdx===null)return;var imgs=pins[curPinIdx].images||[];imgs.forEach(function(src,i){var img=document.createElement('img');img.src=src;img.onclick=function(){if(confirm('OK')){pins[curPinIdx].images.splice(i,1);localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderPinImages();}};grid.appendChild(img);});var ab=document.createElement('div');ab.className='pd-add-img';ab.textContent='+';ab.onclick=function(){document.getElementById('pdImgInput').click();};grid.appendChild(ab);}
function addPinImages(files){if(curPinIdx===null||!files.length)return;var done=0,total=files.length;for(var i=0;i<files.length;i++){(function(f){var r=new FileReader();r.onload=function(e){pins[curPinIdx].images.push(e.target.result);done++;if(done===total){localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderPinImages();}};r.readAsDataURL(f);})(files[i]);}}
function deleteCurrentPin(){if(!localStorage.getItem('abi_token')){loginGitHub();return;}if(curPinIdx===null)return;var p=pins[curPinIdx];if(!confirm('OK'))return;var uname=localStorage.getItem('abi_user')||'匿名';if(p.id){supabase('deletion_requests','POST',{pin_id:p.id,name:p.name,x:p.x,y:p.y,submitted_by:uname,reason:'用户提交',votes:0,voters:[]}).then(function(){alert('OK');}).catch(function(){pins.splice(curPinIdx,1);curPinIdx=null;localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();closePinDetail();alert('OK');});}else{pins.splice(curPinIdx,1);curPinIdx=null;localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();closePinDetail();}}

function renderPinComments(){var list=document.getElementById('pdcList');list.innerHTML='';if(curPinIdx===null)return;(pins[curPinIdx].comments||[]).forEach(function(c){var item=document.createElement('div');item.className='pdc-item';var time=document.createElement('span');time.className='pdc-time';time.textContent=c.time;item.innerHTML=(c.user_name?'<strong style="color:#ffc832">'+c.user_name+'</strong> ':'')+c.text;item.appendChild(time);list.appendChild(item);});}
function postPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'鍖垮悕';var p=pins[curPinIdx];if(p.id)supabase('map_comments','POST',{text:text,time:tz,user_name:uname}).catch(function(){});if(!p.comments)p.comments=[];p.comments.push({text:text,time:tz,user_name:uname});localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderPinComments();input.value='';}
function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.className='mc-item';var time=document.createElement('span');time.className='mc-time';time.textContent=c.time;item.innerHTML=(c.user_name?'<strong style="color:#ffc832">'+c.user_name+'</strong> ':'')+c.text;item.appendChild(time);list.appendChild(item);});}
function postMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var tz=new Date().toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'});var uname=localStorage.getItem('abi_user')||'鍖垮悕';supabase('map_comments','POST',{text:text,time:tz,user_name:uname}).catch(function(){});mapComments.push({text:text,time:tz,user_name:uname});localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));renderMapComments();input.value='';}

// === 瀹瑰櫒閫夋嫨鍣?===
function showPicker(){
  var op=document.getElementById('pinTypeMenu');if(op){op.remove();return;}
  var menu=document.createElement('div');menu.id='pinTypeMenu';
  menu.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.97);border:1px solid #1e1e2a;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;z-index:99999;min-width:380px;box-shadow:0 8px 40px rgba(0,0,0,.7)';
  var ti=document.createElement('div');ti.style.cssText='color:#ffc832;font-size:18px;font-weight:600;margin-bottom:12px;border-bottom:1px solid rgba(255,200,50,.15);padding-bottom:8px';ti.textContent='閫夋嫨瀹瑰櫒绫诲瀷';menu.appendChild(ti);
  var cats={};pinTypes.forEach(function(t){if(!cats[t.c])cats[t.c]=[];cats[t.c].push(t);});
  var order=['鐗╄祫','寮硅嵂','鍖荤枟','宸ュ叿','鏂囨。','琛ｇ墿','瀹跺叿','璐甸噸','瀹瑰櫒','鍐涘','姝﹀櫒','閰嶄欢','閽ュ寵','瀵嗗','鏁屼汉','BOSS','鍏朵粬'];
  order.forEach(function(cat){
    if(!cats[cat])return;
    var s=document.createElement('div');s.style.cssText='margin-bottom:10px';
    var h=document.createElement('div');h.style.cssText='color:#888;font-size:12px;margin-bottom:4px;padding:0 4px';h.textContent=cat;s.appendChild(h);
    var g=document.createElement('div');g.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:6px';
    cats[cat].forEach(function(t){
      var b=document.createElement('button');b.style.cssText='padding:6px 4px;background:rgba(255,200,50,.08);border:1px solid rgba(255,200,50,.12);border-radius:8px;color:#ddd;cursor:pointer;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:4px';
      var img=document.createElement('img');img.src=getIconUrl(t.n);img.style.cssText='width:32px;height:32px;border-radius:4px;object-fit:cover';img.onerror=function(){this.style.display='none';};b.appendChild(img);
      var span=document.createElement('span');span.textContent=t.n;b.appendChild(span);
      b.onmouseenter=function(){this.style.background='rgba(255,200,50,.2)';};
      b.onmouseleave=function(){this.style.background='rgba(255,200,50,.08)';};
      b.onclick=function(){placePin(t);menu.remove();};g.appendChild(b);
    });
    s.appendChild(g);menu.appendChild(s);
  });
  var cb=document.createElement('button');cb.textContent='鍙栨秷';cb.style.cssText='margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%';cb.onclick=function(){menu.remove();};menu.appendChild(cb);
  document.body.appendChild(menu);
}

function placePin(tp){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  var cv=document.getElementById('cv');if(!cv||cv.textContent==='鏈€夋嫨'){alert('OK');return;}
  var parts=cv.textContent.split(',');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert('OK');return;}
  var ic=getIconUrl(tp.n);
  var pin={name:tp.n,type:tp.n,x:x,y:y,ic:ic,note:'',images:[],comments:[],map_name:mapNameCN};
  supabase('pins','POST',pin).then(function(data){
    if(data&&data.id)pin.id=data.id;pins.push(pin);
    localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));
    renderMarkers();cv.textContent='鏈€夋嫨';document.getElementById('ab').style.display='none';alert('OK').style.display='none';alert('OK');
  });
}

// === init ===
function renderLayers(){
  var lp=document.getElementById('lp');if(!lp)return;
  var keys=Object.keys(layerData);
  if(keys.length===0){lp.innerHTML='<div style="color:#888;padding:20px;text-align:center;font-size:14px">鏆傛棤灞傜骇鏁版嵁</div>';return;}
  var html='<label class="all-label"><input type="checkbox" checked onchange="toggleAllLayers(this.checked)"> 鍏ㄩ儴鏄剧ず</label>';
  keys.forEach(function(k){
    html+='<div class="ly-card"><div class="ly-card-hdr"><input type="checkbox" checked onchange="toggleLayer(\''+k+'\',this.checked)"> '+k+'</div>';
    html+=(layerData[k]||[]).map(function(item){
      var ic=getIconUrl(item);
      if(ic) return '<label><input type="checkbox" checked data-layer="'+k+'"><img src="'+ic+'" style="width:20px;height:20px;border-radius:3px;object-fit:cover;vertical-align:middle;margin-right:4px;display:inline" onerror="this.style.display=\'none\'">'+item+'</label>';
      return '<label><input type="checkbox" checked data-layer="'+k+'"> <span style="display:inline-block;width:20px;height:20px;border-radius:3px;background:#333;vertical-align:middle;margin-right:4px;text-align:center;line-height:20px;color:#aaa;font-size:12px">?</span> '+item+'</label>';
    }).join('');
    html+='</div>';
  });
  lp.innerHTML=html;
}
function toggleAllLayers(c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});}
function toggleLayer(n,c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-layer="'+n+'"]').forEach(function(cb){cb.checked=c;});}

// === init ===
function jumpToFromUrl(){
  var s=new URLSearchParams(window.location.search);
  var x=s.get('x'),y=s.get('y');
  if(!x||!y)return;
  var xf=parseFloat(x),yf=parseFloat(y);scaleM=8;
  var wrap=document.querySelector('.map-wrap');if(!wrap)return;
  panX=(wrap.clientWidth/2)-xf/100*document.getElementById('mapImg').clientWidth*scaleM;
  panY=(wrap.clientHeight/2)-yf/100*document.getElementById('mapImg').clientHeight*scaleM;
  ut();document.getElementById('zr').value=800;document.getElementById('zl').textContent='800%';
  var mv=document.getElementById('mv');if(!mv)return;
  var el=document.createElement('div');el.style.cssText='position:absolute;left:'+xf+'%;top:'+yf+'%;transform:translate(-50%,-50%);width:'+(24/scaleM)+'px;height:'+(24/scaleM)+'px;z-index:999;pointer-events:none;background:#ff4444;border:'+(3/scaleM)+'px solid #fff;border-radius:50%;box-shadow:0 0 '+(12/scaleM)+'px rgba(255,0,0,.6)';mv.appendChild(el);
  for(var i=0;i<pins.length;i++){if(Math.abs(pins[i].x-xf)+Math.abs(pins[i].y-yf)<3){showPinDetail(i);return;}}
  document.getElementById('cv').textContent=x+'%, '+y+'%';document.getElementById('ab').style.display='inline-block';
}

// === 鍒濆鍖?===
(function init(){
  // mdBtn onclick set in HTML
  var b=document.getElementById('lbb');var lp=document.getElementById('lp');
  if(b&&lp){
    b.onclick=function(e){e.stopPropagation();lp.classList.toggle('show');if(lp.classList.contains('show'))renderLayers();};
    document.addEventListener('click',function(e){if(lp&&!lp.contains(e.target)&&e.target!==b)lp.classList.remove('show');});
  }
  var sb=document.getElementById('ab');if(sb&&!sb.onclick)sb.onclick=function(){showPicker();};
 if(pins&&pins.length){try{renderMarkers();}catch(e){}}setTimeout(loadCloudPins,300);
})();



