
// ===== 归一化坐标辅助函数 =====
function getImgSize2(){var img$$1=document.getElementById('mapImg');if(!img$$1)return{w:0,h:0};return{w:img$$1.naturalWidth||img$$1.width||0,h:img$$1.naturalHeight||img$$1.height||0};}
function pctToPx(pctX,pctY,imgW,imgH){if(!imgW){var s=getImgSize2();imgW=s.w;imgH=s.h;}if(!imgW||!imgH)return{px:0,py:0};return{px:Math.round(pctX/100*imgW),py:Math.round(pctY/100*imgH)};}
function pxToPct(px,py,imgW,imgH){if(!imgW){var s=getImgSize2();imgW=s.w;imgH=s.h;}if(!imgW||!imgH)return{x:0,y:0};return{x:px/imgW*100,y:py/imgH*100};}
function ensurePxPy(p){if(p.px===void 0||p.py===void 0){if(p.x!==void 0&&p.y!==void 0){var img=getImgSize2();var c=pctToPx(p.x,p.y,img.w,img.h);p.px=c.px;p.py=c.py;}p.px=p.px||0;p.py=p.py||0;}return p;}

/* mobile redirect */
(function(){
  var isMobile = false;
try { isMobile = ('ontouchstart' in window && window.innerWidth < 600 && !navigator.userAgent.match(/Windows|Macintosh/)); } catch(e){}
  if(!isMobile) return;
  var m = window.location.pathname.match(/map-(\w+)\.html/);
  if(m) window.location.href = 'map-mobile.html?map=' + m[1];
})();

// ===== 归一化坐标辅助函数 (由 map-common 注入) =====
function getImgSize2(){var img$$1=document.getElementById('mapImg');if(!img$$1)return{w:0,h:0};return{w:img$$1.naturalWidth||img$$1.width||0,h:img$$1.naturalHeight||img$$1.height||0};}
function pctToPx(pctX,pctY,imgW,imgH){if(!imgW){var s=getImgSize2();imgW=s.w;imgH=s.h;}if(!imgW||!imgH)return{px:0,py:0};return{px:Math.round(pctX/100*imgW),py:Math.round(pctY/100*imgH)};}
function pxToPct(px,py,imgW,imgH){if(!imgW){var s=getImgSize2();imgW=s.w;imgH=s.h;}if(!imgW||!imgH)return{x:0,y:0};return{x:px/imgW*100,y:py/imgH*100};}
function ensurePxPy(p){if(p.px===void 0||p.py===void 0){if(p.x!==void 0&&p.y!==void 0){var img=getImgSize2();var c=pctToPx(p.x,p.y,img.w,img.h);p.px=c.px;p.py=c.py;}p.px=p.px||0;p.py=p.py||0;}return p;}
/**
 * 把所有注入JS写到这个文件，final_all_in_one.cjs 读取它
 */
var selectedLayers = window.selectedLayers || {};
(function(){ orders.forEach(function(layer){ var items=layerData[layer]; if(items) items.forEach(function(it){ selectedLayers[it]=true; }); }); })();

(function(){ var fb=document.getElementById('floorBar'); var fw=document.getElementById("__floorFixed__"); if(fb&&fw){ while(fb.firstChild) fw.appendChild(fb.firstChild); fb.style.display='none'; } })();

(function syncUI(){
  function s(){
    var l2=document.getElementById('loginBtn2'),ol=document.getElementById('loginBtn');
    if(l2&&ol) l2.style.display=ol.style.display;
    var u2=document.getElementById('userName2'),u0=document.getElementById('userName');
    if(u2&&u0){ u2.textContent=u0.textContent; u2.style.display=u0.style.display; }
    if(u2&&typeof user!=='undefined'&&user&&user.user_metadata){ var nm=user.user_metadata.full_name||user.user_metadata.user_name||''; if(nm&&!u2.textContent) u2.textContent=nm; if(nm){ u2.style.display=''; if(l2) l2.style.display='none'; } }
    var r2=document.getElementById('reviewBtn2'),r0=document.getElementById('reviewBtnMM');
    if(r2&&r0) r2.style.display=r0.style.display;
    var z2=document.getElementById('zl2'),z0=document.getElementById('zl');
    if(z2&&z0) z2.textContent=z0.textContent;
  }
  s(); setInterval(s, 500);
})();

function toggleFullscreen(){ if(!document.fullscreenElement){ document.documentElement.requestFullscreen(); } else { document.exitFullscreen(); } }

function selectAllMat(v){
  orders.forEach(function(layer){ var items=layerData[layer]; if(items) items.forEach(function(it){ selectedLayers[it]=v; }); });
  if(typeof renderMarkers==='function') renderMarkers();
  syncMatPins();
}
function syncMatPins(){
  document.querySelectorAll('.mat-item').forEach(function(x){ var v=x.getAttribute('data-item'); if(v) x.classList.toggle('active',!!selectedLayers[v]); });
}
function toggleMat(){
  var btn=document.getElementById('matBtn'),mc=document.getElementById('matContent');
  if(!mc) return;
  if(mc.classList.contains('show')){ mc.classList.remove('show'); btn.classList.remove('active'); btn.innerHTML='📦 物资'; return; }
  btn.classList.add('active'); btn.innerHTML='📦 物资 ▲'; mc.classList.add('show'); mc.innerHTML='';
  var ctrl=document.createElement('div'); ctrl.className='mat-ctrl';
  var allBtn=document.createElement('button'); allBtn.className='mat-ctrl-btn'; allBtn.textContent='☑ 全选'; allBtn.onclick=function(){ selectAllMat(true); };
  var noneBtn=document.createElement('button'); noneBtn.className='mat-ctrl-btn'; noneBtn.textContent='☐ 取消'; noneBtn.onclick=function(){ selectAllMat(false); };
  ctrl.appendChild(allBtn); ctrl.appendChild(noneBtn); mc.appendChild(ctrl);
  orders.forEach(function(layer){
    var items=layerData[layer]; if(!items||items.length===0) return;
    var cat=document.createElement('div'); cat.className='mat-cat'; cat.textContent='['+layer+']'; mc.appendChild(cat);
    var row=document.createElement('div'); row.className='mat-items';
    items.forEach(function(it){
      var el=document.createElement('div'); el.className='mat-item'; el.setAttribute('data-item',it);
      var ic=(typeof getIconUrl==='function')?getIconUrl(it):'';
      if(ic&&ic.indexOf('http')===0){ var img=document.createElement('img'); img.src=ic; img.onerror=function(){ this.style.display='none'; }; el.appendChild(img); } else { var em=document.createElement('div'); em.textContent='📦'; el.appendChild(em); }
      var nm=document.createElement('div'); nm.className='mi-name'; nm.textContent=it; el.appendChild(nm);
      el.onclick=(function(itm){ return function(){ selectedLayers[itm]=!selectedLayers[itm]; if(typeof renderMarkers==='function') renderMarkers(); syncMatPins(); }; })(it);
      if(selectedLayers[it]) el.classList.add('active'); row.appendChild(el);
    });
    mc.appendChild(row);
  });
}

renderMarkers = function(){
  var mv=document.getElementById('mv'); if(!mv) return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){ el.remove(); });
  pins.forEach(function(p,i){
    if(typeof selectedLayers!=='undefined' && selectedLayers[p.name]===false) return;
    var pf=(p.floor!==undefined&&p.floor!==null)?p.floor:0;
    if(typeof currentFloor!=='undefined' && pf!==currentFloor) return;
    var el=document.createElement('div'); el.className='pin-marker'; el.setAttribute('data-pin-idx',i);
    var imgW__=img?img.naturalWidth||img.width||0:0,imgH__=img?img.naturalHeight||img.height||0:0;var lp__=p.px!==void 0&&p.py!==void 0&&imgW__>0?(p.px/imgW__*100)+'%':p.x+'%';var tp__=p.px!==void 0&&p.py!==void 0&&imgH__>0?(p.py/imgH__*100)+'%':p.y+'%';el.style.cssText='position:absolute;left:'+lp__+';top:'+tp__+';transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=getIconUrl(p.name);
    if(ic&&ic.indexOf('http')===0){
      var img=document.createElement('img'); img.src=ic;
      var s=Math.min(100,60/Math.pow(scaleM,1.176));
      img.style.cssText='width:'+s+'px;height:'+s+'px;border-radius:'+Math.min(10,4/Math.pow(scaleM,1.176))+'px;object-fit:cover;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';
      img.onerror=function(){ this.style.display='none'; }; el.appendChild(img);
    } else if(ic){
      var sp=document.createElement('span'); sp.textContent=ic;
      var fs=Math.min(36,20/Math.pow(scaleM,1.176));
      sp.style.cssText='font-size:'+fs+'px;line-height:1;text-align:center;display:block'; el.appendChild(sp);
    } else {
      var dot=document.createElement('div');
      var ds=Math.min(60,36/Math.pow(scaleM,1.176));
      dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';
      el.appendChild(dot);
    }
    if(p.note) el.setAttribute('title',p.note);
    el.onclick=(function(idx){ return function(e){ e.stopPropagation(); if(typeof showPinDetail==='function') showPinDetail(idx); }; })(i);
    mv.appendChild(el);
  });
};

switchFloor = function(idx){
  if(idx===currentFloor) return;
  currentFloor=idx;
  var img=document.getElementById('mapImg'); if(!img) return;
  if(floorImages[idx]) img.src=floorImages[idx];
  document.querySelectorAll('.floor-btn').forEach(function(btn,i){ btn.classList.toggle('active',i===idx); });
  resetView();
  if(typeof renderMarkers==='function') renderMarkers();
};
filterPinsByFloor = function(fl){ if(typeof renderMarkers==='function') renderMarkers(); };


function placePin(tp,noteText){
  if(!localStorage.getItem('abi_token')){ alert('Login required to submit'); loginGitHub(); return; }
  var cv=document.getElementById('cv'); if(!cv||cv.textContent==='-'){ alert('Click map first'); return; }
  var parts=cv.textContent.split(','); var x=parseFloat(parts[0]),y=parseFloat(parts[1]);
  if(isNaN(x)||isNaN(y)){ alert('Invalid pos'); return; }
  var uj=localStorage.getItem('abi_user');var uname='Anon';try{if(uj){var uo=JSON.parse(uj);uname=uo.user_metadata&&(uo.user_metadata.user_name||uo.user_metadata.preferred_username)||uo.email&&uo.email.split('@')[0]||'Anon';}}catch(e){}
  var cf=typeof currentFloor==='number'?currentFloor:0;
  var p={name:tp,x:x,y:y,note:noteText||'',images:[],comments:[]}; pins.push(p); renderMarkers();
  cv.textContent='-'; document.getElementById('ab').style.display='none';
  var btn=document.getElementById('mdBtn'); if(btn) btn.textContent='[B] 浏览';
  var type='other'; for(var cat in layerData){ if(layerData[cat].indexOf(tp)>=0){ type=cat; break; } }
  supabase('pending_pins','POST',{name:tp,x:x,y:y,px:px__,py:py__,map_name:mapNameCN,type:type,ic:'',note:noteText||'',images:[],floor:cf,submitted_by:uname})
  .then(function(r){
    alert('已提交审核');
    var ov=document.createElement('div'); ov.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;border:1px solid #ffc832;border-radius:10px;padding:12px 20px;z-index:99999;max-width:90vw;text-align:center';
    var u=window.location.origin+window.location.pathname.replace(/\/[^\/]+$/,'/map-valley.html')+'?x='+x+'&y='+y+'&floor='+cf;
    ov.innerHTML='<div style="color:#ffc832;font-size:14px;font-weight:600;margin-bottom:8px">已提交审核</div><div style="color:#888;font-size:12px;margin-bottom:10px">等待管理员审核后将显示在地图上</div><a href="'+u+'" style="color:#88aaff;font-size:12px;text-decoration:underline">📍 在地图上查看位置</a><br><button onclick="this.parentElement.remove()" style="margin-top:10px;padding:4px 16px;background:#333;border:none;border-radius:6px;color:#888;cursor:pointer">关闭</button>';
    document.body.appendChild(ov);
  })['catch'](function(e){ alert('Upload failed: '+e.message); });
  localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));
}

function showPinDetail(idx){
  curPinIdx=idx; var p=pins[idx]; var ic=getIconUrl(p.name);
  var title=document.getElementById('pdTitle');
  if(title){ title.innerHTML=''; if(ic){ var img=document.createElement('img'); img.src=ic; img.style.cssText='width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px'; title.appendChild(img); } title.appendChild(document.createTextNode(' '+(p.name||p.type||'?'))); }
  var ps=document.getElementById('pdSubmit'); if(ps) ps.textContent=(p.submitted_by?'贡献者: '+p.submitted_by:'');
  var pc=document.getElementById('pdCoord'); if(pc) pc.textContent=Math.round(p.x)+'%, '+Math.round(p.y)+'%';
  var note=document.getElementById('pdNote'); if(note){ note.value=p.note||''; saveNote(idx,note); }
  var pd=document.getElementById('pd'); if(pd) pd.classList.add('show'); loadPinComments(idx);
}

function saveNote(idx,el){
  if(!el) el=document.getElementById('pdNote'); if(!el||idx===undefined) return;
  var handler=function(){ if(pins[idx]){ pins[idx].note=this.value; var marker=document.querySelector('.pin-marker[data-pin-idx="'+idx+'"]'); if(marker){ if(this.value) marker.setAttribute('title',this.value); else marker.removeAttribute('title'); } } };
  el.oninput=handler;
  if(pins[idx]&&pins[idx].note) el.value=pins[idx].note;
}


function submitPinNote(){
  var idx = curPinIdx;
  if(idx===null||idx===undefined) return;
  var input = document.getElementById('pdNote');
  if(!input) return;
  var val = input.value.trim();
  if(pins[idx]){
    pins[idx].note = val;
    var marker = document.querySelector('.pin-marker[data-pin-idx="'+idx+'"]');
    if(marker){ if(val) marker.setAttribute('title',val); else marker.removeAttribute('title'); }
    var nd = document.getElementById('pdNoteDisplay');
    if(nd){ if(val){ nd.textContent='\u2709 '+val; nd.style.display='block'; } else nd.style.display='none'; }
    if(pins[idx].id){
      supabase('pins','PATCH',{note:val},'id=eq.'+pins[idx].id).then(function(){
        input.placeholder='\u5df2\u4fdd\u5b58';
      }).catch(function(e){
        console.error('note save fail',e);
      });
    }
  }
}

// === 汉堡导航 ===
var navGroups = [
  { label: '🏠 首页', url: '../index.html' },
  { label: '🗺 地图选图', sub: true,
    items: [
    {
        "label": "电视台",
        "url": "map-tvstation.html"
    },
    {
        "label": "农场",
        "url": "map-farm.html"
    },
    {
        "label": "北山",
        "url": "map-beishan.html"
    },
    {
        "label": "山谷",
        "url": "map-valley.html"
    },
    {
        "label": "军械库",
        "url": "map-armory.html"
    },
    {
        "label": "机场",
        "url": "map-airport.html"
    }
]},
  { label: '🔧 改枪', url: '../gunsmith.html' },
  { label: '💬 聊天', url: '../chat.html' },
  { label: '📖 攻略', url: '../guides.html' },
  { label: '🔍 搜索', url: '../search.html' },
  { label: '✅ 审核中心', url: 'review.html?from=map-valley' },
  { label: '👤 用户中心', url: '../profile.html' },
  { sep: true },
  { label: '🚪 退出登录', action: 'logout' }
];

function toggleHamburger(){
  var m=document.getElementById('hamburgerMenu');
  if(!m) return;
  if(m.classList.contains('show')){ m.classList.remove('show'); return; }
  m.classList.add('show'); m.innerHTML='';
  var curPath=window.location.pathname;
  var curFile=curPath.substring(curPath.lastIndexOf('/')+1)||'index.html';
  navGroups.forEach(function(g){
    if(g.sep){ m.appendChild(document.createElement('div')).className='hm-sep'; return; }
    if(g.sub){
      var wrap=document.createElement('div'); wrap.className='hm-group-wrap';
      var gl=document.createElement('div'); gl.className='hm-group-label';
      gl.textContent=g.label;
      wrap.appendChild(gl);
      var sub=document.createElement('div'); sub.className='hm-sub';
      g.items.forEach(function(it){
        var item=document.createElement('div'); item.className='hm-item';
        if(it.url&&it.url.indexOf(curFile)>=0) item.classList.add('active');
        item.textContent=it.label;
        (function(u){ item.onclick=function(){ window.location.href=u; }; })(it.url);
        sub.appendChild(item);
      });
      wrap.appendChild(sub);
      gl.style.cursor='pointer';
      gl.onclick=function(e){
        e.stopPropagation();
        this.parentNode.querySelector('.hm-sub').classList.toggle('open');
      };
      m.appendChild(wrap);
      return;
    }
    var gl=document.createElement('div'); gl.className='hm-group-label';
    gl.textContent=g.label;
    if(g.url&&g.url.indexOf(curFile)>=0) gl.classList.add('active');
    (function(u,a){ gl.onclick=function(){
      if(a==='logout'){ if(typeof logout==='function')logout(); else alert('未登录'); return; }
      if(u) window.location.href=u;
    };})(g.url,g.action);
    gl.style.cursor='pointer';
    m.appendChild(gl);
  });
}

document.addEventListener('click', function(e){
  if(!e.target.closest('#hamburger')&&!e.target.closest('#hamburgerMenu')){
    var m=document.getElementById('hamburgerMenu'); if(m) m.classList.remove('show');
  }
});

// === 所有浮动按钮可拖拽 ===


// 初始化拖拽
(function(){ var h=document.getElementById('hamburger'); if(h) {} })();
(function(){ var ab=document.getElementById('actionBar'); if(ab) {} })();
(function(){ var zw=document.getElementById('zoomWrap'); if(zw) {} })();
(function(){ var tb=document.getElementById("__disabled__"); if(tb){ tb.style.cursor='grab'; try{var saved=localStorage.getItem("__disabled__");if(saved){var p=JSON.parse(saved);tb.style.left=p.l;tb.style.top=p.t;}}catch(e){} var ox,oy,mx,my,drag=false,hd=false; tb.addEventListener('mousedown',function(e){if(e.target.tagName==='BUTTON'||e.target.tagName==='A')return; e.stopPropagation(); drag=true;hd=false; ox=e.clientX;oy=e.clientY; mx=parseInt(tb.style.left)||0; my=parseInt(tb.style.top)||8; }); document.addEventListener('mousemove',function(e){if(!drag)return;e.preventDefault();var dx=e.clientX-ox,dy=e.clientY-oy;if(Math.abs(dx)>5||Math.abs(dy)>5)hd=true;tb.style.left=(mx+dx)+'px';tb.style.top=(my+dy)+'px';}); document.addEventListener('mouseup',function(){if(drag){drag=false;if(hd)try{localStorage.setItem("__disabled__",JSON.stringify({l:tb.style.left,t:tb.style.top}));}catch(e){}}}); } })();
(function(){ var fw=document.getElementById("__floorFixed__"); if(fw){ fw.style.cursor='grab'; try{var saved=localStorage.getItem('fw_pos');if(saved){var p=JSON.parse(saved);fw.style.left=p.l;fw.style.top=p.t;}}catch(e){} var ox,oy,mx,my,drag=false,hd=false; fw.addEventListener('mousedown',function(e){if(e.target.tagName==='BUTTON')return; e.stopPropagation(); drag=true;hd=false; ox=e.clientX;oy=e.clientY; mx=parseInt(fw.style.left)||0; my=parseInt(fw.style.top)||0; }); document.addEventListener('mousemove',function(e){if(!drag)return;e.preventDefault();var dx=e.clientX-ox,dy=e.clientY-oy;if(Math.abs(dx)>5||Math.abs(dy)>5)hd=true;fw.style.left=(mx+dx)+'px';fw.style.top=(my+dy)+'px';}); document.addEventListener('mouseup',function(){if(drag){drag=false;if(hd)try{localStorage.setItem('fw_pos',JSON.stringify({l:fw.style.left,t:fw.style.top}));}catch(e){}}}); } })();
(function(){ var mp=document.getElementById('matPanel'); if(mp){ mp.style.cursor='grab'; try{var saved=localStorage.getItem('mp_pos');if(saved){var p=JSON.parse(saved);mp.style.left=p.l;mp.style.top=p.t;}}catch(e){} var ox,oy,mx,my,drag=false,hd=false; mp.addEventListener('mousedown',function(e){if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT'||e.target.tagName==='IMG')return; e.stopPropagation(); drag=true;hd=false; ox=e.clientX;oy=e.clientY; mx=parseInt(mp.style.left)||8; my=parseInt(mp.style.top)||95; }); document.addEventListener('mousemove',function(e){if(!drag)return;e.preventDefault();var dx=e.clientX-ox,dy=e.clientY-oy;if(Math.abs(dx)>5||Math.abs(dy)>5)hd=true;mp.style.left=(mx+dx)+'px';mp.style.top=(my+dy)+'px';}); document.addEventListener('mouseup',function(){if(drag){drag=false;if(hd)try{localStorage.setItem('mp_pos',JSON.stringify({l:mp.style.left,t:mp.style.top}));}catch(e){}}}); } })();
(function(){ var lp=document.getElementById('lp'); if(lp){ lp.style.cursor='grab'; try{var saved=localStorage.getItem('lp_pos');if(saved){var p=JSON.parse(saved);lp.style.left=p.l;lp.style.top=p.t;}}catch(e){} var ox,oy,mx,my,drag=false,hd=false; lp.addEventListener('mousedown',function(e){if(e.target.tagName==='INPUT'||e.target.tagName==='LABEL')return; e.stopPropagation(); drag=true;hd=false; ox=e.clientX;oy=e.clientY; mx=parseInt(lp.style.left)||186; my=parseInt(lp.style.top)||95; }); document.addEventListener('mousemove',function(e){if(!drag)return;e.preventDefault();var dx=e.clientX-ox,dy=e.clientY-oy;if(Math.abs(dx)>5||Math.abs(dy)>5)hd=true;lp.style.left=(mx+dx)+'px';lp.style.top=(my+dy)+'px';}); document.addEventListener('mouseup',function(){if(drag){drag=false;if(hd)try{localStorage.setItem('lp_pos',JSON.stringify({l:lp.style.left,t:lp.style.top}));}catch(e){}}}); } })();
(function(){
  // === 修复所有拖拽：stopPropagation + 拖拽>5px后阻止click ===
  var draggableIds = ['hamburger','matPanel','lp',"__floorFixed__","__disabled__",'actionBar','zoomWrap'];
  draggableIds.forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.style.cursor = 'grab';
    var ox,oy,mx,my,drag=false,moved=false;
    // 防止已有的拖拽冲突，移除旧监听再重新绑定
    el._moved = false;
    el.addEventListener('mousedown',function(e){
      el._moved = false;
      e.stopPropagation();
      ox=e.clientX; oy=e.clientY;
      mx=el.style.left?parseInt(el.style.left):0;
      my=el.style.top?parseInt(el.style.top):0;
      drag=true;
    });
    document.addEventListener('mousemove',function(e){
      if(!el._moved && drag && (Math.abs(e.clientX-ox)>5||Math.abs(e.clientY-oy)>5)){
        el._moved = true;
      }
      if(drag && el._moved){
        e.preventDefault();
        el.style.left=(mx+e.clientX-ox)+'px';
        el.style.top=(my+e.clientY-oy)+'px';
      }
    });
    document.addEventListener('mouseup',function(){
      drag=false;
    });
    // 捕获阶段拦截 click — 只有拖拽过的才阻止
    el.addEventListener('click',function(e){
      if(this._moved){
        this._moved = false;
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    },true);
    // 确保 _moved 在 mouseup 后延迟重置（防止后续 click 被错误拦截）
    document.addEventListener('mouseup',function(){
      setTimeout(function(){ if(el) el._moved = false; }, 100);
    });
  });
})();
// 阻止浏览器缩放（Ctrl+滚轮 / Ctrl+加号减号）
document.addEventListener('wheel',function(e){
  if(e.ctrlKey || e.metaKey){
    e.preventDefault();
    // 改为地图缩放
    if(typeof setScale === 'function'){
      var dir = e.deltaY > 0 ? -1 : 1;
      var newScale = scaleM + dir * 0.1 * scaleM;
      newScale = Math.max(0.3, Math.min(5, newScale));
      setScale(newScale);
    }
  }
},{passive:false});
function resetPositions(){
  var items = [
    ['hamburger','hb_pos','12px','12px'],
    ['matPanel','mp_pos','8px','95px'],
    ['lp','lp_pos','186px','95px'],
    ["__floorFixed__",'fw_pos','',''],
    ["__disabled__","__disabled__",'','8px'],
    ['actionBar','ab_pos','',''],
    ['zoomWrap','zw_pos','','']
  ];
  items.forEach(function(it){
    var el = document.getElementById(it[0]);
    if(!el) return;
    el.style.left='';
    el.style.top='';
    try{ localStorage.removeItem(it[1]); }catch(e){}
    if(it[2]) el.style.left=it[2];
    if(it[3]) el.style.top=it[3];
  });
}
(function(){
  // Ctrl+滚轮缩放保护
  document.addEventListener('wheel',function(e){if(e.ctrlKey||e.metaKey){e.preventDefault();}},{passive:false});

  // 复位功能
  function resetPositions(){
    var items=[
      ['hamburger','hb_pos'],
      ['matPanel','mp_pos'],
      ['lp','lp_pos'],
      ["__floorFixed__",'fw_pos'],
      ["__disabled__","__disabled__"],
      ['actionBar','ab_pos'],
      ['zoomWrap','zw_pos'],
      ['commentPanel','cp_pos']
    ];
    items.forEach(function(it){
      var el=document.getElementById(it[0]);
      if(!el) return;
      el.style.left='';
      el.style.top='';
    });
    var cp=document.getElementById('commentPanel');
    if(cp){ cp.style.transform='translateY(-50%)'; cp.style.right='10px'; }
  }
  window.resetPositions = resetPositions;

  // 所有面板可拖拽（不保存位置）
  var draggableIds=['hamburger','matPanel','lp',"__floorFixed__","__disabled__",'actionBar','zoomWrap','commentPanel'];
  draggableIds.forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    el.style.cursor='grab';
    el._moved=false;
    var ox,oy,startRect,drag=false;
    el.addEventListener('mousedown',function(e){
      el._moved=false;
      e.stopPropagation();
      ox=e.clientX; oy=e.clientY;
      startRect=el.getBoundingClientRect();
      drag=true;
    });
    document.addEventListener('mousemove',function(e){
      if(!drag) return;
      if(Math.abs(e.clientX-ox)>5||Math.abs(e.clientY-oy)>5){
        el._moved=true;
        e.preventDefault();
        if(id==='commentPanel'){
          el.style.top=(startRect.top+e.clientY-oy)+'px';
          el.style.right='10px';
        } else {
          el.style.left=(startRect.left+e.clientX-ox)+'px';
          el.style.top=(startRect.top+e.clientY-oy)+'px';
        }
        if(el.style.position!=='fixed') el.style.position='fixed';
      }
    });
    document.addEventListener('mouseup',function(){ drag=false; });
    el.addEventListener('click',function(e){
      if(this._moved){ this._moved=false; e.stopPropagation(); e.preventDefault(); return false; }
    },true);
  });

  // 顶部加复位按钮
  var tb=document.getElementById("__disabled__");
  if(tb){
    var rp=document.createElement('button');
    rp.textContent='\u21ba \u5f52\u4f4d';
    rp.style.cssText='padding:3px 6px;background:rgba(255,200,50,0.12);border:1px solid rgba(255,200,50,0.25);border-radius:5px;color:#ffc832;cursor:pointer;font-size:12px;white-space:nowrap';
    rp.onclick=function(e){ e.stopPropagation(); resetPositions(); };
    tb.appendChild(rp);
  }
})();

// === showPicker（投稿弹窗） ===
function showPicker(){
  var old=document.getElementById('cpMenu');
  if(old)old.remove();
  var menu=document.createElement('div');
  menu.id='cpMenu';
  menu.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:99999';
  var box=document.createElement('div');
  box.style.cssText='background:#12121a;border:1px solid #1e1e2a;border-radius:14px;padding:16px 20px;min-width:360px;max-width:440px;max-height:85vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.6);display:flex;flex-direction:column;gap:10px';
  // 标题栏
  var header=document.createElement('div');
  header.style.cssText='display:flex;justify-content:space-between;align-items:center';
  var title=document.createElement('div');
  title.style.cssText='font-size:15px;color:#ffc832;font-weight:600';
  title.textContent='\u9009\u62e9\u5bb9\u5668';
  header.appendChild(title);
  var closeBtn=document.createElement('button');
  closeBtn.textContent='\u2715';
  closeBtn.style.cssText='background:none;border:none;color:#555;font-size:12px;cursor:pointer;padding:0';
  closeBtn.onclick=function(){menu.remove();};
  header.appendChild(closeBtn);
  box.appendChild(header);
  // 坐标+楼层
  var info=document.createElement('div');
  info.style.cssText='font-size:12px;color:#888;display:flex;gap:8px;padding:3px 6px;background:rgba(255,255,255,0.02);border-radius:4px';
  var cv=document.getElementById('cv');
  info.innerHTML='<span>\ud83d\udccd '+(cv?cv.textContent:'')+'</span><span style="color:#444">|</span><span>\ud83c\udfd7 '+(typeof currentFloor==='number'?'\u7b2c'+currentFloor+'\u5c42':'')+'</span>';
  box.appendChild(info);
  // 分类标签
  var tabBar=document.createElement('div');
  tabBar.style.cssText='display:flex;gap:3px;flex-wrap:wrap';
  var layers=['\u5168\u90e8'].concat(orders);
  var tabBtns=[];
  layers.forEach(function(layer,i){
    var tab=document.createElement('button');
    tab.textContent=layer;
    tab.style.cssText='padding:2px 8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.04);border-radius:10px;color:#888;cursor:pointer;font-size:10px';
    if(layer==='\u5168\u90e8'){tab.style.background='rgba(255,200,50,0.12)';tab.style.color='#ffc832';tab.style.borderColor='#ffc832';}
    tab.onclick=function(){
      tabBtns.forEach(function(bt){bt.style.background='rgba(255,255,255,0.03)';bt.style.color='#888';bt.style.borderColor='rgba(255,255,255,0.04)';});
      tab.style.background='rgba(255,200,50,0.12)';tab.style.color='#ffc832';tab.style.borderColor='#ffc832';
      gridContainer.querySelectorAll('.cp-group').forEach(function(g){g.style.display=(layer==='\u5168\u90e8'||g.getAttribute('data-layer')===layer)?'':'none';});
    };
    tabBtns.push(tab);
    tabBar.appendChild(tab);
  });
  box.appendChild(tabBar);
  // 容器网格
  var gridWrap=document.createElement('div');
  gridWrap.style.cssText='max-height:300px;overflow-y:auto;scrollbar-width:thin';
  var gridContainer=document.createElement('div');
  gridContainer.style.cssText='display:flex;flex-direction:column;gap:6px';
  orders.forEach(function(layer){
    var items=layerData[layer];
    if(!items||items.length===0)return;
    var group=document.createElement('div');
    group.className='cp-group';
    group.setAttribute('data-layer',layer);
    var label=document.createElement('div');
    label.style.cssText='font-size:10px;color:#777;margin-bottom:2px;font-weight:600';
    label.textContent=layer;
    group.appendChild(label);
    var grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:4px';
    items.forEach(function(item){
      var btn=document.createElement('button');
      btn.style.cssText='padding:4px 2px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,0.03);border-radius:6px;color:#aaa;cursor:pointer;font-size:9px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px';
      btn.onmouseover=function(){this.style.background='rgba(255,200,50,0.05)';this.style.borderColor='rgba(255,200,50,0.15)';this.style.color='#ffc832';};
      btn.onmouseout=function(){this.style.background='rgba(255,255,255,.02)';this.style.borderColor='rgba(255,255,255,0.03)';this.style.color='#aaa';};
      var ic=getIconUrl(item);
      if(ic&&ic.indexOf('http')===0){
        var img=document.createElement('img');img.src=ic;img.style.cssText='width:28px;height:28px;border-radius:3px;object-fit:cover';
        img.onerror=function(){this.style.display='none';};
        btn.appendChild(img);
      } else {
        var emoji=document.createElement('span');emoji.textContent='\ud83d\udce6';emoji.style.fontSize='18px';
        btn.appendChild(emoji);
      }
      var name=document.createElement('span');name.textContent=item;name.style.cssText='font-size:8px;color:inherit;line-height:1.1';
      btn.appendChild(name);
      btn.onclick=(function(t){return function(){placePin(t);menu.remove();};})(item);
      grid.appendChild(btn);
    });
    group.appendChild(grid);
    gridContainer.appendChild(group);
  });
  gridWrap.appendChild(gridContainer);
  box.appendChild(gridWrap);
  // 底部备注
  var footer=document.createElement('div');
  footer.style.cssText='margin-top:4px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.04)';
  var noteLabel=document.createElement('div');
  noteLabel.style.cssText='font-size:10px;color:#777;margin-bottom:4px';
  noteLabel.textContent='\ud83d\udcac \u5907\u6ce8\uff08\u975e\u5fc5\u586b\uff09';
  footer.appendChild(noteLabel);
  var noteRow=document.createElement('div');
  noteRow.style.cssText='display:flex;gap:6px;align-items:center';
  var noteInput=document.createElement('input');
  noteInput.type='text';
  noteInput.id='pdNote';
  noteInput.placeholder='\u5728\u8fd9\u6761\u70b9\u4f4d\u4e0b\u6dfb\u52a0\u5907\u6ce8...';
  noteInput.style.cssText='flex:1;padding:6px 8px;background:#0a0a10;border:1px solid #1e1e2a;border-radius:5px;color:#ccc;font-size:12px;outline:none';
  noteRow.appendChild(noteInput);
  var submitBtn=document.createElement('button');
  submitBtn.textContent='\u2705 \u63d0\u4ea4';
  submitBtn.style.cssText='padding:6px 14px;background:#ffc832;color:#0a0a0f;border:none;border-radius:5px;font-weight:600;cursor:pointer;font-size:12px;white-space:nowrap';
  submitBtn.onclick=function(){alert('\u8bf7\u5728\u7f51\u683c\u4e2d\u9009\u62e9\u5bb9\u5668\u7c7b\u578b');};
  noteRow.appendChild(submitBtn);
  footer.appendChild(noteRow);
  box.appendChild(footer);
  menu.appendChild(box);
  document.body.appendChild(menu);
}

// === 备注显示 ===
(function(){
  // 详情弹窗加备注显示
  var pdn = document.getElementById('pdNoteDisplay');
  if(!pdn){
    // 等DOM加载
    var ti = setInterval(function(){
      var nd = document.getElementById('pdNoteDisplay');
      if(nd){ clearInterval(ti); }
    }, 100);
  }
  // 覆盖 showPinDetail 加备注
  var origSD = window.showPinDetail;
  if(typeof origSD === 'function'){
    window.showPinDetail = function(idx){
      origSD(idx);
      var p = pins[idx];
      var nd = document.getElementById('pdNoteDisplay');
      if(nd){
        if(p && p.note){ nd.textContent='\ud83d\udcac \u5907\u6ce8: '+p.note; nd.style.display=''; }
        else { nd.style.display='none'; }
      }
    };
  }
})();
(function(){
  function up(){
    var ls=document.getElementById("loginStatus");
    if(!ls){setTimeout(up,200);return}
    try{
      var u=localStorage.getItem("abi_user");
      if(u){
        var p=JSON.parse(u);
        var un=p&&p.user_metadata?p.user_metadata.full_name||p.user_metadata.user_name||"User":p.email?p.email.split("@")[0]:"User";
        ls.innerHTML='<a href="#" onclick="logout();return false" style="color:#ffc832;text-decoration:none">'+un+'</a>';
        var rb=document.getElementById("reviewBtn2");if(rb)rb.style.display="";
      } else {
        ls.innerHTML='<a href="#" onclick="loginGitHub();return false" style="color:#aaa;text-decoration:none">登录</a>';
        var rb=document.getElementById("reviewBtn2");if(rb)rb.style.display="none";
      }
    }catch(e){
      ls.innerHTML='<a href="#" onclick="loginGitHub();return false" style="color:#aaa;text-decoration:none">登录</a>';
    }
  }
  if(document.readyState==="complete")up();else window.addEventListener("load",up);
})();
(function(){
  function centerMap(){
    var mv=document.getElementById("mv");
    var img=document.getElementById("mapImg");
    if(!mv||!img||!img.complete){setTimeout(centerMap,100);return}
    panX=(window.innerWidth-img.naturalWidth*scaleM)/2;
    panY=(window.innerHeight-img.naturalHeight*scaleM)/2;
    mv.style.transform="translate("+panX+"px,"+panY+"px) scale("+scaleM+")";
    ["zr","zl","zl2"].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.id==="zr"?el.value=400:(el.textContent="400%");
    });
  }
  if(document.readyState==="complete")centerMap();else if(!window.location.search.includes("x="))window.addEventListener("load",centerMap);
})();
// Shift+Click: 在鼠标位置投稿容器
document.addEventListener('click', function(e) {
  if (!e.shiftKey) return;
  e.preventDefault();
  e.stopPropagation();
  var wrap = document.querySelector('.map-wrap');
  if (!wrap) return;
  var wr = wrap.getBoundingClientRect();
  var mx = e.clientX - wr.left, my = e.clientY - wr.top;
  var img = document.getElementById('mapImg');
  if (!img) return;
  var ix = mx / scaleM - panX / scaleM, iy = my / scaleM - panY / scaleM;
  var pctX = Math.round(ix / img.clientWidth * 10000) / 100;
  var pctY = Math.round(iy / img.clientHeight * 10000) / 100;
  if (pctX < 0 || pctX > 100 || pctY < 0 || pctY > 100) return;
  // Set position
  var cv = document.getElementById('cv');
  if (cv) cv.textContent = pctX + ', ' + pctY;
  var ab = document.getElementById('ab');
  if (ab) ab.style.display = 'block';
  // Show picker
  if (typeof showPicker === 'function') {
    showPicker();
  } else {
    alert('Shift+Click: 请先点击地图上的📦按钮进入投稿模式');
  }
});
// Shift+Click: 在鼠标位置投稿容器
document.addEventListener('click', function(e) {
  if (!e.shiftKey) return;
  e.preventDefault();
  e.stopPropagation();
  var wrap = document.querySelector('.map-wrap');
  if (!wrap) return;
  var wr = wrap.getBoundingClientRect();
  var mx = e.clientX - wr.left, my = e.clientY - wr.top;
  var img = document.getElementById('mapImg');
  if (!img) return;
  var ix = mx / scaleM - panX / scaleM, iy = my / scaleM - panY / scaleM;
  var pctX = Math.round(ix / img.clientWidth * 10000) / 100;
  var pctY = Math.round(iy / img.clientHeight * 10000) / 100;
  if (pctX < 0 || pctX > 100 || pctY < 0 || pctY > 100) return;
  var cv = document.getElementById('cv');
  if (cv) cv.textContent = pctX + ', ' + pctY;
  var ab = document.getElementById('ab');
  if (ab) ab.style.display = 'block';
  if (typeof showPicker === 'function') {
    showPicker();
  } else {
    alert('Shift+Click: 请先点击地图上的📦按钮进入投稿模式');
  }
});
