var scaleM=4,panX=0,panY=0,_jumpingMarker=false,mode='browse',pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;
function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}
function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.user_metadata&&u.user_metadata.user_name||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}
(function(){normalizeUser();var t=localStorage.getItem('abi_token');var un=document.getElementById('userName');var lb=document.getElementById('loginBtn');var rb=document.getElementById('reviewBtnMM');if(t&&un){un.style.display='inline';un.textContent=getUserName();}if(t&&lb)lb.style.display='none';if(rb)rb.style.display=t?'block':'none';setTimeout(function(){normalizeUser();var t2=localStorage.getItem('abi_token');var un2=document.getElementById('userName');var lb2=document.getElementById('loginBtn');var rb2=document.getElementById('reviewBtnMM');if(t2&&un2){un2.style.display='inline';un2.textContent=getUserName();}if(t2&&lb2)lb2.style.display='none';if(rb2)rb2.style.display=t2?'block':'none';},500);})();
if((window.location.hash||'').indexOf('access_token')>=0||(window.location.search||'').indexOf('access_token')>=0){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,'');var p={};raw.split('&').forEach(function(s){var kv=s.split('=');p[kv[0]]=decodeURIComponent(kv[1]||'');});if(p.access_token){localStorage.setItem('abi_token',p.access_token);try{var b64=p.access_token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');while(b64.length%4)b64+='=';var u=JSON.parse(atob(b64));localStorage.setItem('abi_user',JSON.stringify(u));}catch(e){localStorage.setItem('abi_user','{"user_metadata":{"preferred_username":"User"}}');}history.replaceState(null,'',window.location.pathname+window.location.search);window.location.href=window.location.pathname+window.location.search;}}catch(e){console.error('Auth err',e);}}
var mapNameEng='valley',mapNameCN='山谷',cloudPins=[],cloudComments=[];
// ========== 楼层切换 ==========
var floorImages = ["../assets/maps/valley.png"];
var floorLabels = [
  '山谷全境',
  '山谷二楼'
];
var currentFloor = 0;

function filterPinsByFloor(fl){var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){var pi=parseInt(el.getAttribute('data-pin-idx'));if(!isNaN(pi)&&pins[pi]){var pf=(pins[pi].floor!==undefined&&pins[pi].floor!==null)?pins[pi].floor:0;el.style.display=pf===fl?'':'none';}});}

function switchFloor(idx) {
  if (idx === currentFloor) return;
  currentFloor = idx;
  var img = document.getElementById('mapImg');
  if (!img) return;
  img.src = floorImages[idx];
  document.querySelectorAll('.floor-btn').forEach(function(btn, i) {
    btn.classList.toggle('active', i === idx);
  });
  resetView();
  // 过滤标记 — 只显示当前楼层
  var mv=document.getElementById('mv');
  if(mv){mv.querySelectorAll('.pin-marker').forEach(function(el){var pi=parseInt(el.getAttribute('data-pin-idx'));if(!isNaN(pi)&&pins[pi]){var pf=pins[pi].floor||0;el.style.display=pf===idx?'':'none';}});}
  // 非0层隐藏容器选择弹窗的位置指示
  if(idx>0 && typeof hideAreaSelect==='function'){hideAreaSelect();}
  console.log('Switch to floor', idx, floorLabels[idx]);
}
function checkReviewBtn(){var rb=document.getElementById('reviewBtnMM');if(!rb)return;if(localStorage.getItem('abi_token')){rb.style.display='block';}else{rb.style.display='none';}}
var iconUrls={"保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%BF%9D%E9%99%A9.png","滴滴保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%BB%B4%E6%BB%B4%E4%BF%9D%E9%99%A9.png","电子保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%94%B5%E5%AD%90%E4%BF%9D%E9%99%A9.png","收银机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%94%B6%E9%93%B6%E6%9C%BA.png","家用机箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AE%B6%E7%94%A8%E6%9C%BA%E7%AE%B1.png","军用主机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%86%9B%E7%94%A8%E4%B8%BB%E6%9C%BA.png","普通物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%BD%AE%E7%89%A9%E7%AE%B1.png","高级物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%BB%91%E7%BD%AE%E7%89%A9%E7%AE%B1.png","子弹箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AD%90%E5%BC%B9%E7%AE%B1.png","手雷箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%89%8B%E9%9B%B7%E7%AE%B1.png","医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E7%BA%A7%E5%8C%BB%E7%96%97.png","小型医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E5%8C%BB%E7%96%97.png","大型医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E5%9E%8B%E5%8C%BB%E7%96%97%E7%AE%B1.png","高级医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%8C%BB%E7%96%97.png","工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B7%A5%E5%85%B7%E7%AE%B1.png","高级工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E7%AE%B1.png","文件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%96%87%E4%BB%B6%E7%AE%B1.png","大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E8%A1%A3.png","蓝色大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%93%9D%E9%A2%86.png","衣服":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E8%A1%A3%E6%9C%8D.png","抽屉":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%8A%BD%E5%B1%89.png","刮刮乐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%88%AE%E5%88%AE%E4%B9%90.png","运动包":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%BF%90%E5%8A%A8%E5%8C%85.png","旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png","白色旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%99%BD%E6%97%85.png","商务旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png","大型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png","中型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png","木质武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%9C%A8%E8%B4%A8%E6%AD%A6%E5%99%A8%E7%AE%B1.png","武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%AD%A6%E5%99%A8%E7%AE%B1.png","高级武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E6%AD%A6%E5%99%A8%E7%AE%B1.png","配件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%85%8D%E4%BB%B6%E7%AE%B1.png","三色灯":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%89%E8%89%B2%E7%81%AF.png","共鸣球":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%85%B1%E9%B8%A3%E7%90%83.png","奉献雕像":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A5%89%E7%8C%AE%E9%9B%95%E5%83%8F.png","小保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E4%BF%9D%E9%99%A9.png","空调罐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%A9%BA%E8%B0%83%E7%BD%90.png","长条武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%95%BF%E6%9D%A1%E6%AD%A6%E5%99%A8%E7%AE%B1.png","三色灯":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%89%E8%89%B2%E7%81%AF.png","共鸣球":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%85%B1%E9%B8%A3%E7%90%83.png","奉献雕像":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A5%89%E7%8C%AE%E9%9B%95%E5%83%8F.png","小保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E4%BF%9D%E9%99%A9.png","空调罐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%A9%BA%E8%B0%83%E7%BD%90.png","长条武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%95%BF%E6%9D%A1%E6%AD%A6%E5%99%A8%E7%AE%B1.png","BOSS":"💀","清道夫":"🤖","黑金人机":"🖤🤼","白狼人机":"🐺🤼","军用保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%86%9B%E7%94%A8%E4%BF%9D%E9%99%A9%E7%AE%B1.png","后备箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%90%8E%E5%A4%87%E7%AE%B1.png","垃圾箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%9E%83%E5%9C%BE%E7%AE%B1.png","饼干盒":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%A5%BC%E5%B9%B2%E7%9B%92.png"};
function getIconUrl(n){var u=iconUrls[n]||'';return u;}
var SUPABASE_URL='https://hanrfbciinkhgcumvous.supabase.co';var SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';
function supabase(t,m,b,f){var u='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+t;var o={method:m||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};if(b){o.body=JSON.stringify(b);o.headers['Authorization']='Bearer '+'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok';}if(f)u+='?'+f;return fetch(u,o).then(function(r){if(r.status>=400)throw new Error(r.status);return r.text().then(function(t){if(!t)return{};return JSON.parse(t);});});}
function loginGitHub(){var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var isMap=i>=0;var cb=window.location.origin+(isMap?p.substring(0,i+1):p.replace(/index.html$/,''))+'index.html';window.location.href='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);}
function logout(){localStorage.removeItem('abi_token');localStorage.removeItem('abi_user');window.location.reload();}
function ut(){var el=document.getElementById('mv');if(!el)return;el.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';try{renderMarkers();}catch(e){}}
function zoom(f,cx,cy){if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10;ut();return;}var prev=scaleM;scaleM*=f;if(scaleM<0.1)scaleM=0.1;if(scaleM>10)scaleM=10;var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;panX=mx-imgX*scaleM;panY=my-imgY*scaleM;ut();}
function zoomTo(v,cx,cy){v=v/100;if(v<0.1)v=0.1;if(v>10)v=10;if(cx!==void 0&&cy!==void 0){var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/scaleM,imgY=(my-panY)/scaleM;panX=mx-imgX*v;panY=my-imgY*v;}scaleM=v;ut();}
function resetView(){scaleM=1;panX=0;panY=0;var e=document.getElementById('mv');if(e)e.style.transform='translate(0px,0px) scale(1)';var zr=document.getElementById('zr');if(zr)zr.value=100;var zl=document.getElementById('zl');if(zl)zl.textContent='100%';}
window.onerror=function(m,s,l,c,err){console.error('JS err',m,l,c);alert('Err: '+m);return true;};
function toggleMode(){mode=(mode==='browse')?'place':'browse';var btn=document.getElementById('mdBtn');if(btn)btn.textContent=(mode==='place')?'[P] 放置':'[B] 浏览';document.getElementById('ch').classList.toggle('show',mode==='place');document.getElementById('cv').textContent='-';document.getElementById('ab').style.display='none';}
document.body.addEventListener('mousedown',function(e){if(mode==='place')return;var btn=e.button;var mv=document.getElementById('mv');if(!mv||e.target.closest('.pin-marker')||e.target.closest('.pd-overlay')||e.target.closest('.controls')||e.target.closest('#fp'))return;var sx=e.clientX,sy=e.clientY,px=panX,py=panY;var moved=false;function mm(ev){if(mode==='place'){document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);return;}var dx=ev.clientX-sx,dy=ev.clientY-sy;if(Math.abs(dx)>3||Math.abs(dy)>3)moved=true;panX=px+dx;panY=py+dy;ut();}function mu(ev){document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);if(!moved&&btn===0){var ch=document.getElementById('ch');if(mode==='place'){ch.style.left=ev.clientX+'px';ch.style.top=ev.clientY+'px';ch.classList.add('show');extractPos(ev);}}else if(moved&&btn===0){document.getElementById('ch').classList.remove('show');}}document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});
document.body.addEventListener('mousemove',function(e){if(mode==='place'){var ch=document.getElementById('ch');ch.style.left=e.clientX+'px';ch.style.top=e.clientY+'px';}});
document.getElementById('mv').addEventListener('click',function(e){if(mode==='place'&&!e.target.closest('.pin-marker')){extractPos(e);showPicker();}});
function extractPos(e){var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=e.clientX-wr.left,my=e.clientY-wr.top;var img=document.getElementById('mapImg');var ix=mx/scaleM-panX/scaleM,iy=my/scaleM-panY/scaleM;var pctX=Math.round(ix/img.clientWidth*10000)/100;var pctY=Math.round(iy/img.clientHeight*10000)/100;var px__=Math.round(pctX/100*(img.naturalWidth||img.width||0));var py__=Math.round(pctY/100*(img.naturalHeight||img.height||0));var cv=document.getElementById('cv');if(cv)cv.textContent=pctX+', '+pctY;}
document.getElementById('mv').addEventListener('wheel',function(e){e.preventDefault();var f=e.deltaY>0?0.9:1.1;zoom(f,e.clientX,e.clientY);},{passive:false});
document.getElementById('mv').addEventListener('touchstart',function(e){if(e.touches.length===2){touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);touchStartScale=scaleM;}},{passive:true});
document.getElementById('mv').addEventListener('touchmove',function(e){if(e.touches.length===2){e.preventDefault();var dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);var ns=touchStartScale*dist/touchStartDist;zoomTo(Math.round(ns*100));}},{passive:false});
var sb=document.getElementById('sb');if(sb)sb.onclick=function(){showPicker();mode='browse';document.getElementById('ch').classList.remove('show');var btn=document.getElementById('mdBtn');if(btn)btn.textContent='[B] 浏览';};
var lb=document.getElementById('lbb');if(lb){var lp=document.getElementById('lp');if(lp){lb.onclick=function(e){e.stopPropagation();lp.classList.toggle('show');if(lp.classList.contains('show')){renderLayers();}};document.addEventListener('click',function(ev){if(lp&&!lp.contains(ev.target)&&ev.target!==document.getElementById('lbb'))lp.classList.remove('show');});}}
if(typeof renderMarkers==='function')renderMarkers();
function toggleMenu(){var m=document.getElementById('sideMenu');if(m){m.style.display=(m.style.display==='none'||!m.style.display)?'block':'none';}}
var us=new URLSearchParams(window.location.search);setTimeout(function(){if(us.get('x')&&us.get('y')){jumpToFromUrl();}else{loadCloudPins();}checkReviewBtn();if(typeof currentFloor==='number'){filterPinsByFloor(currentFloor);}},300);
var layerData={'贵重':['保险箱','滴滴保险','电子保险','小保险','军用保险箱'],'电子':['收银机','家用机箱','军用主机'],'物资':['普通物资箱','高级物资箱','空调罐','垃圾箱','饼干盒'],'弹药':['子弹箱','手雷箱'],'医疗':['大型医疗箱','医疗箱','高级医疗箱','小型医疗箱'],'工具':['工具箱','高级工具箱'],'衣物':['大衣','蓝色大衣','衣服'],'家具':['抽屉','刮刮乐'],'容器':['文件箱','运动包','旅行箱','白色旅行箱','商务旅行箱','后备箱'],'武器':['大型武器箱','中型武器箱','木质武器箱','武器箱','高级武器箱','长条武器箱'],'其他':['三色灯','共鸣球','奉献雕像'],'人机':['BOSS','清道夫','黑金人机','白狼人机'],'配件':['配件箱']};
var orders=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件','其他','人机'];
function showPicker(){var old=document.getElementById('cpMenu');if(old)old.remove();var menu=document.createElement('div');menu.id='cpMenu';menu.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a24;border:1px solid #333;border-radius:12px;padding:16px;max-height:80vh;overflow-y:auto;z-index:9999;min-width:320px;max-width:420px';var title=document.createElement('div');title.style.cssText='font-size:15px;color:#ffc832;font-weight:600;margin-bottom:12px;text-align:center';title.textContent='Select Container';menu.appendChild(title);orders.forEach(function(layer){var items=layerData[layer];if(!items||items.length===0)return;var group=document.createElement('div');group.style.cssText='margin-bottom:12px';var label=document.createElement('div');label.style.cssText='font-size:12px;color:#888;margin-bottom:6px;font-weight:600';label.textContent='['+layer+']';group.appendChild(label);var grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(2,1fr);gap:8px';items.forEach(function(item){var btn=document.createElement('button');btn.style.cssText='padding:8px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#ddd;cursor:pointer;font-size:12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px';var ic=getIconUrl(item);if(ic){var img=document.createElement('img');img.src=ic;img.style.cssText='width:48px;height:48px;border-radius:6px;object-fit:cover';img.onerror=function(){this.style.display='none';};btn.appendChild(img);}var span=document.createElement('span');span.textContent=item;btn.appendChild(span);btn.onclick=function(t){return function(){placePin(t);menu.remove();};}(item);grid.appendChild(btn);});group.appendChild(grid);menu.appendChild(group);});var cb=document.createElement('button');cb.textContent='Cancel';cb.style.cssText='margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%';cb.onclick=function(){menu.remove();};menu.appendChild(cb);document.body.appendChild(menu);}
function placePin(tp){if(!localStorage.getItem('abi_token')){alert('Login required to submit');loginGitHub();return;}var cv=document.getElementById('cv');if(!cv||cv.textContent==='-'){alert('Click map first');return;}var parts=cv.textContent.split(',');var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert('Invalid pos');return;}var uj=localStorage.getItem('abi_user');var uname='Anon';try{if(uj){var uo=JSON.parse(uj);if(uo&&uo.user_metadata&&uo.user_metadata.user_name)uname=uo.user_metadata.user_name;else if(uo&&uo.email)uname=uo.email.split('@')[0];}}catch(e){}var cf=typeof currentFloor==='number'?currentFloor:0;var p={name:tp,x:x,y:y,note:'',images:[],comments:[],};pins.push(p);renderMarkers();cv.textContent='-';document.getElementById('ab').style.display='none';var btn=document.getElementById('mdBtn');if(btn)btn.textContent='[B] 浏览';var type='other';for(var cat in layerData){if(layerData[cat].indexOf(tp)>=0){type=cat;break;}}supabase('pending_pins','POST',{name:tp,x:x,y:y,px:px__,py:py__,map_name:mapNameCN,type:type,ic:'',note:'',images:[],floor:cf,submitted_by:uname}).then(function(r){alert('\u5df2\u63d0\u4ea4\u5ba1\u6838');var ov=document.createElement('div');ov.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;border:1px solid #ffc832;border-radius:10px;padding:12px 20px;z-index:99999;max-width:90vw;text-align:center';var u=window.location.origin+window.location.pathname.replace(/\/[^\/]+$/,'/map-valley.html')+'?x='+x+'&y='+y+'&floor='+cf;ov.innerHTML='<div style="color:#ffc832;font-size:14px;font-weight:600;margin-bottom:8px">\u5df2\u63d0\u4ea4\u5ba1\u6838<\/div><div style="color:#888;font-size:12px;margin-bottom:10px">\u7b49\u5f85\u7ba1\u7406\u5458\u5ba1\u6838\u540e\u5c06\u663e\u793a\u5728\u5730\u56fe\u4e0a<\/div><a href="'+u+'" style="color:#88aaff;font-size:12px;text-decoration:underline">\ud83d\udccd \u5728\u5730\u56fe\u4e0a\u67e5\u770b\u4f4d\u7f6e<\/a><br><button onclick="this.parentElement.remove()" style="margin-top:10px;padding:4px 16px;background:#333;border:none;border-radius:6px;color:#888;cursor:pointer">\u5173\u95ed<\/button>';document.body.appendChild(ov);})['catch'](function(e){alert('Upload failed: '+e.message);});localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));}
function renderMarkers(){var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});pins.forEach(function(p,i){var el=document.createElement('div');el.className='pin-marker';el.setAttribute('data-pin-idx',i);var imgW__=img?img.naturalWidth||img.width||0:0,imgH__=img?img.naturalHeight||img.height||0:0;var lp__=p.px!==void 0&&p.py!==void 0&&imgW__>0?(p.px/imgW__*100)+'%':p.x+'%';var tp__=p.px!==void 0&&p.py!==void 0&&imgH__>0?(p.py/imgH__*100)+'%':p.y+'%';el.style.cssText='position:absolute;left:'+lp__+';top:'+tp__+';transform:translate(-50%,-50%);cursor:pointer;z-index:100;';var ic=getIconUrl(p.name);if(ic&&ic.indexOf('http')===0){var img=document.createElement('img');img.src=ic;var s=Math.min(100,60/Math.pow(scaleM,1.176));img.style.cssText='width:'+s+'px;height:'+s+'px;border-radius:'+Math.min(10,4/Math.pow(scaleM,1.176))+'px;object-fit:cover;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';img.onerror=function(){this.style.display='none';};el.appendChild(img);var dot=document.createElement('div');var ds=Math.min(60,36/Math.pow(scaleM,1.176));dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5);display:none';el.appendChild(dot);}else if(ic){var sp=document.createElement('span');sp.textContent=ic;var fs=Math.min(36,20/Math.pow(scaleM,1.176));sp.style.cssText='font-size:'+fs+'px;line-height:1;text-align:center;display:block';el.appendChild(sp);var dot=document.createElement('div');var ds=Math.min(60,36/Math.pow(scaleM,1.176));dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5);display:none';el.appendChild(dot);}else{var dot=document.createElement('div');var ds=Math.min(60,36/Math.pow(scaleM,1.176));dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';el.appendChild(dot);}el.onclick=function(e){e.stopPropagation();showPinDetail(i);};if(p.note) el.title=p.note;var pf=(p.floor!==undefined&&p.floor!==null)?p.floor:0;el.style.display=pf===currentFloor?"":"none";mv.appendChild(el);});setTimeout(dispatchLayerCheck,100);}
function showPinDetail(idx){curPinIdx=idx;var p=pins[idx];var ic=getIconUrl(p.name);var title=document.getElementById('pdTitle');if(title){title.innerHTML='';if(ic){var img=document.createElement('img');img.src=ic;img.style.cssText='width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px';title.appendChild(img);}title.appendChild(document.createTextNode(' '+(p.name||p.type||'?')));}var ps=document.getElementById('pdSubmit');if(ps){  ps.textContent=(p.submitted_by?'贡献者: '+p.submitted_by:'');}var pc=document.getElementById('pdCoord');if(pc)pc.textContent=Math.round(p.x)+'%, '+Math.round(p.y)+'%';var note=document.getElementById('pdNote');if(note)note.value=p.note||'';// renderPinImages removed
var pd=document.getElementById('pd');if(pd)pd.classList.add('show');loadPinComments(idx);}
async function loadPinComments(pinIdx){
  if(pinIdx===undefined||pinIdx===null)return;
  var p=pins[pinIdx];
  if(!p||!p.id){
    document.getElementById('pdCommentList').innerHTML='<div style="color:#666;font-size:10px;padding:4px">暂未提交，无评论</div>';
    return;
  }
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?pin_id=eq.'+p.id+'&order=created_at.asc',{
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}
    });
    if(r.ok){
      var data=await r.json();
      var list=document.getElementById('pdCommentList');
      if(!list)return;
      list.innerHTML='';
      var esc=function(s){var d=document.createElement('div');d.appendChild(document.createTextNode(s));return d.innerHTML;};
      data.forEach(function(c){
        var html='';
        html+='<div class="c-item" style="margin-bottom:4px;padding:4px;border-bottom:1px solid rgba(255,255,255,0.04);position:relative;font-size:11px">';
        html+='<div class="c-user" style="color:#888;font-size:10px;margin-bottom:2px">'+esc(c.user_name||'匿名')+'</div>';
        html+='<div class="c-text">'+esc(c.text)+'</div>';
        if(getUserName())html+='<button class="c-del" onclick="deletePinComment('+c.id+','+pinIdx+')" style="position:absolute;top:2px;right:2px;background:none;border:none;color:#ff4444;font-size:9px;cursor:pointer">删除</button>';
        html+='</div>';
        list.innerHTML+=html;
      });
      if(data.length===0)list.innerHTML='<div style="color:#666;font-size:10px;padding:4px">暂无评论</div>';
    }
  }catch(e){}
}
function closePinDetail(){document.getElementById('pd').classList.remove('show');curPinIdx=null;}
// removed savePinNote

// removed renderPinImages

// removed addPinImages

function deleteCurrentPin(){if(curPinIdx===null)return;var p=pins[curPinIdx];if(!confirm('确定删除该容器?'))return;var ustr=localStorage.getItem('abi_user');var uname='Anon';try{var uj=JSON.parse(ustr);uname=uj.user_metadata&&uj.user_metadata.preferred_username||uj.user_metadata&&uj.user_metadata.user_name||'Anon';}catch(e){}if(p.id){supabase('deletion_requests','POST',{pin_id:p.id,name:p.name,x:Number(p.x),y:Number(p.y),submitted_by:uname,reason:p.note||'',floor:Number(p.floor)||0,map_name:mapNameCN||''}).then(function(){alert('已提交删除审核');pins.splice(curPinIdx,1);closePinDetail();renderMarkers();})}else{pins.splice(curPinIdx,1);closePinDetail();renderMarkers();}
}

function renderPinComments(){
  var list=document.getElementById('pdcList');
  if(!list)return;
  if(curPinIdx===null||!pins[curPinIdx])return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  var cs=pins[curPinIdx].comments||[];
  if(cs.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">暂无评论</div>';
    return;
  }
  var html='';
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    var un=c.user_name||'匿名';
    var txt=c.text||'';
    var time=c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    html+='<div class="c-item"><div class="c-hdr"><span class="c-author">'+un+'</span><span class="c-time">'+time+'</span></div><div class="c-body">'+txt+'</div>';
    if(c.images){
      var imgs=typeof c.images==='string'?JSON.parse(c.images):c.images;
      if(imgs&&imgs.length){
        html+='<div style="display:flex;gap:4px;flex-wrap:wrap;padding:4px 0;">';
        for(var j=0;j<imgs.length;j++){
          html+='<img src="'+imgs[j]+'" style="max-width:400px;max-height:60px;border-radius:4px;object-fit:cover;cursor:pointer;" onclick="window.open(this.src)">';
        }
        html+='</div>';
      }
    }
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deletePinComment('+c.id+','+curPinIdx+')">删除</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}

async function loadMapComments(){
  try{
    var enc=encodeURIComponent(mapNameCN);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&order=created_at.asc',{
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    mapComments=data||[];
    renderMapComments();
  }catch(e){console.error('loadMapComments err',e);}
}

function esc(s){
  if(!s)return'';
  var d=document.createElement('div');
  d.appendChild(document.createTextNode(s||''));
  return d.innerHTML;
}

function renderMapComments(){
  var list=document.getElementById('mcList');
  if(!list)return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  if(!mapComments||mapComments.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\u6682\u65e0\u8bc4\u8bba</div>';
    return;
  }
  var html='';
  for(var i=0;i<mapComments.length;i++){
    var c=mapComments[i];
    var un=c.user_name||'\u533f\u540d';
    var txt=c.text||'';
    var time=c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    html+='<div class="c-item"><div class="c-hdr"><span class="c-author">'+un+'</span><span class="c-time">'+time+'</span></div><div class="c-body">'+txt+'</div>';
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deleteMapComment('+c.id+')">\u5220\u9664</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}
function showNextCommentInput(){var inp=document.getElementById('pdcInput');var btn=document.getElementById('pdcBtn');if(inp)inp.style.display='block';if(btn)btn.style.display='none';}
function previewPinCommentFiles(input){
  var preview=document.getElementById('pdcFilePreview');
  var count=document.getElementById('pdcFileCount');
  if(!preview||!input)return;
  preview.innerHTML='';
  if(!input.files||input.files.length===0){
    if(count)count.textContent='\u672a\u9009\u62e9\u56fe\u7247';
    return;
  }
  if(count)count.textContent='\u5df2\u9009\u62e9 '+input.files.length+' \u5f20\u56fe\u7247';
  for(var i=0;i<input.files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        var img=document.createElement('img');
        img.src=e.target.result;
        img.style.cssText='width:50px;height:50px;object-fit:cover;border-radius:4px;';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
}

async function submitPinComment(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  if(curPinIdx===null)return;
  var input=document.getElementById('pdcInput');
  var content=input.value.trim();
  var fileInput=document.getElementById('pdcFileInput');
  var images=[];
  if(content==''&&(!fileInput||fileInput.files.length===0)){alert('请输入评论内容');return;}
  if(fileInput&&fileInput.files.length>0){
    for(var i=0;i<fileInput.files.length;i++){
      var f=fileInput.files[i];
      if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
      if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
      var imgName=Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/map_comment_images/'+imgName,{
          method:'POST',
          headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/map_comment_images/'+imgName);
        }
      }catch(e){console.error('Upload failed',e);}
    }
  }
  var user_name=getUserName()||'匿名';
  var body={map_name:mapNameCN,text:content,user_name:user_name,pin_id:pins[curPinIdx].id};
  if(images.length)body.images=JSON.stringify(images);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    if(r.ok||r.status===204||r.status===201){
      input.value='';
      if(fileInput){fileInput.value='';}
      var preview=document.getElementById('pdcFilePreview');
      if(preview)preview.innerHTML='';
      loadPinComments(curPinIdx);
    }else{
      alert('评论失败');
    }
  }catch(e){
    alert('评论失败: '+e.message);
  }
}
async function submitMapComment(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\u8bf7\u5148\u767b\u5f55');return;}
  var input=document.getElementById('mcInput');
  var content=input.value.trim();
  if(!content){alert('\u8bf7\u8f93\u5165\u8bc4\u8bba\u5185\u5bb9');return;}
  var user_name=getUserName()||'\u533f\u540d';
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({map_name:mapNameCN,text:content,user_name:user_name,pin_id:pins[curPinIdx].id})
    });
    if(r.ok||r.status===204||r.status===201){
      input.value='';
      loadMapComments();
    }else{
      alert('\u8bc4\u8bba\u5931\u8d25');
    }
  }catch(e){
    alert('\u8bc4\u8bba\u5931\u8d25: '+e.message);
  }
}
async function deletePinComment(commentId,pinIdx){
  var t=localStorage.getItem('abi_token');
  if(!t){alert('请先登录');return;}
  if(!confirm('确定删除评论？'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?id=eq.'+commentId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}
    });
    if(r.ok||r.status===204){
      loadPinComments(pinIdx);
    }
  }catch(e){alert(e.message)}
}
function dispatchLayerCheck(){var hiddenTypes={};var hiddenNames={};var lp=document.getElementById('lp');if(!lp)return;lp.querySelectorAll('input[data-layer]').forEach(function(cb){if(!cb.checked){var t=cb.getAttribute('data-layer');if(!hiddenTypes[t])hiddenTypes[t]=true;}});lp.querySelectorAll('input[data-name]').forEach(function(cb){if(!cb.checked){hiddenNames[cb.getAttribute('data-name')]=true;}});var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){var idx=parseInt(el.getAttribute('data-pin-idx'));if(isNaN(idx)||!pins[idx])return;var p=pins[idx];var hide=false;if(hiddenNames[p.name]){hide=true;}if(!hide){for(var ht in hiddenTypes){if(layerData[ht]&&layerData[ht].indexOf(p.name)>=0){hide=true;break;}}}el.style.display=hide?'none':(pins[idx]?(function(){var pf=(pins[idx].floor!==undefined&&pins[idx].floor!==null)?pins[idx].floor:0;return pf===currentFloor?'':'none';})():'');});}
function renderLayers(){
  var lp=document.getElementById('lp');if(!lp)return;
  lp.innerHTML='';
  var allLabel=document.createElement('label');
  allLabel.style.cssText='display:block;padding:8px;border-bottom:1px solid #222;font-size:14px;color:#ffc832;font-weight:600';
  var allCb=document.createElement('input');allCb.type='checkbox';allCb.checked=true;
  allCb.style.marginRight='8px';
  allCb.onchange=function(){toggleAllLayers(this.checked);};
  allLabel.appendChild(allCb);
  allLabel.appendChild(document.createTextNode(' All'));
  lp.appendChild(allLabel);
  orders.forEach(function(k){
    var items=layerData[k];if(!items||items.length===0)return;
    var card=document.createElement('div');
    card.style.cssText='margin:6px 8px;border-bottom:1px solid #1a1a24;padding-bottom:6px';
    var hdr=document.createElement('div');
    hdr.style.cssText='font-size:18px;color:#888;margin-bottom:8px;font-weight:600';
    var hdrCb=document.createElement('input');hdrCb.type='checkbox';hdrCb.checked=true;
    hdrCb.style.marginRight='6px';
    hdrCb.onchange=function(ln){return function(c){toggleLayer(ln,c);};}(k);
    hdr.appendChild(hdrCb);
    hdr.appendChild(document.createTextNode(' '+k));
    card.appendChild(hdr);
    var grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:1fr;gap:8px';
    items.forEach(function(item){
      var lbl=document.createElement('label');
      lbl.style.cssText='display:flex;align-items:center;gap:12px;font-size:12px;color:#aaa;cursor:pointer;padding:3px 6px;border-radius:8px';
      var cb=document.createElement('input');cb.type='checkbox';cb.checked=true;
      cb.setAttribute('data-name',item);
      cb.onchange=function(){dispatchLayerCheck();};
      lbl.appendChild(cb);
      var ic=getIconUrl(item);
      if(ic){
        var img=document.createElement('img');img.src=ic;
        img.style.cssText='width:72px;height:72px;border-radius:8px;object-fit:cover;display:inline';
        img.onerror=function(){this.style.display='none';};
        lbl.appendChild(img);
      }else{
        var ph=document.createElement('span');
        ph.style.cssText='display:inline-block;width:72px;height:72px;border-radius:8px;background:#333;text-align:center;line-height:72px;color:#888;font-size:12px';
        ph.textContent='?';
        lbl.appendChild(ph);
      }
      lbl.appendChild(document.createTextNode(item));
      grid.appendChild(lbl);
    });
    card.appendChild(grid);
    lp.appendChild(card);
  });
  var closeBtn=document.createElement('button');
  closeBtn.textContent='Close';
  closeBtn.style.cssText='margin-top:8px;padding:6px 12px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:6px;color:#888;cursor:pointer;font-size:12px;width:100%';
  closeBtn.onclick=function(){lp.classList.remove('show');};
  lp.appendChild(closeBtn);
}
function toggleAllLayers(c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=c;});dispatchLayerCheck();}
function toggleLayer(n,c){var lp=document.getElementById('lp');if(lp)lp.querySelectorAll('input[data-name]').forEach(function(cb){var t=cb.getAttribute('data-name');if(layerData[n]&&layerData[n].indexOf(t)>=0)cb.checked=c;});dispatchLayerCheck();}
function loadCloudPins(){supabase('pins?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d){if(d&&d.length){cloudPins=d;}loadCloudMarkers();loadMapComments();filterPinsByFloor(currentFloor);})['catch'](function(){loadCloudMarkers();filterPinsByFloor(currentFloor);});}
function loadCloudMarkers(){try{if(cloudPins.length){cloudPins.forEach(function(cp){if(cp.x!==void 0){ensurePxPy(cp); pins.push({name:cp.name,x:cp.x,y:cp.y,px:cp.px,py:cp.py,id:cp.id,note:cp.note||'',images:cp.images||[],comments:cp.comments||[],floor:cp.floor||0,map_name:cp.map_name||''});}});}if(cloudComments.length){cloudComments.forEach(function(cc){mapComments.push(cc);});}renderMarkers();renderMapComments();}catch(e){}}
function loadFromLocal(){try{var d=JSON.parse(localStorage.getItem('abi_'+mapNameEng+'_pins'));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;}}catch(e){}}
function jumpToFromUrl(){var s=new URLSearchParams(window.location.search);var x=s.get('x'),y=s.get('y'),fl=s.get('floor');if(!x||!y)return;_jumpingMarker=true;var xf=parseFloat(x),yf=parseFloat(y),targetFloor=-1;if(fl&&typeof switchFloor==='function'){var fi=parseInt(fl);if(!isNaN(fi)&&fi>0&&fi<floorImages.length){targetFloor=fi;}}var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var img=document.getElementById('mapImg');if(!img||!img.complete||img.naturalWidth===0){setTimeout(jumpToFromUrl,200);return;}if(targetFloor>=0){switchFloor(targetFloor);targetFloor=-1;setTimeout(jumpToFromUrl,500);return;}scaleM=8;panX=(wr.width/2)-xf/100*img.clientWidth*scaleM;panY=(wr.height/2)-yf/100*img.clientHeight*scaleM;ut();document.getElementById('zr').value=800;document.getElementById('zl').textContent='800%';var mv=document.getElementById('mv');if(!mv)return;var name=s.get('name')||'';setTimeout(function(){var div=document.createElement('div');div.style.cssText='position:absolute;left:'+xf+'%;top:'+yf+'%;transform:translate(-50%,-50%);z-index:998;text-align:center;pointer-events:none;width:14px;height:14px;border:2px solid #ff3333;border-radius:50%;background:rgba(255,50,50,.08);animation:blinkBorder 1.2s ease-in-out infinite';var inner=document.createElement('div');inner.style.cssText='width:100%;height:100%;display:flex;align-items:center;justify-content:center';var ic=getIconUrl(name);if(ic){var imgE=document.createElement('img');imgE.src=ic;imgE.style.cssText='width:6px;height:6px;border-radius:1px;object-fit:cover';imgE.onerror=function(){var d=document.createElement('div');d.style.cssText='width:6px;height:6px;background:#ff4444;border-radius:50%';this.parentElement.replaceChild(d,this);};inner.appendChild(imgE);}else{var dot=document.createElement('div');dot.style.cssText='width:6px;height:6px;background:#ff4444;border-radius:50%';inner.appendChild(dot);}div.appendChild(inner);mv.appendChild(div);setTimeout(loadCloudPins,500);},100);var style=document.createElement('style');style.textContent='@keyframes blinkBorder{0%,100%{border-color:#ff3333;box-shadow:0 0 4px rgba(255,50,50,.5)}50%{border-color:#ff8888;box-shadow:0 0 10px rgba(255,50,50,.9)}}';document.head.appendChild(style);}

async function deleteMapComment(commentId){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\u8bf7\u5148\u767b\u5f55');return;}
  if(!confirm('\u786e\u5b9a\u5220\u9664\u8bc4\u8bba\uff1f'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_map_comment',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({comment_id:commentId})
    });
    if(r.ok){
      loadMapComments();
    }else{
      alert('\u5220\u9664\u5931\u8d25');
    }
  }catch(e){
    alert('\u5220\u9664\u5931\u8d25: '+e.message);
  }
}