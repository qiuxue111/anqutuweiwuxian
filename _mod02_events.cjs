var fs=require('fs');
// 模块2: 事件绑定 (拖拽、放置、缩放、触摸)
var code = [
  "window.onerror=function(m,s,l,c,err){console.error('JS err',m,l,c);alert('Err: '+m);return true;};",
  "function toggleMode(){mode=(mode==='browse')?'place':'browse';var btn=document.getElementById('mdBtn');if(btn)btn.textContent=(mode==='place')?'[P] 放置':'[B] 浏览';document.getElementById('ch').classList.toggle('show',mode==='place');document.getElementById('cv').textContent='-';document.getElementById('ab').style.display='none';}",
  "document.body.addEventListener('mousedown',function(e){if(mode==='place')return;var btn=e.button;var mv=document.getElementById('mv');if(!mv||e.target.closest('.pin-marker')||e.target.closest('.pd-overlay')||e.target.closest('.controls')||e.target.closest('#fp'))return;var sx=e.clientX,sy=e.clientY,px=panX,py=panY;var moved=false;function mm(ev){if(mode==='place'){document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);return;}var dx=ev.clientX-sx,dy=ev.clientY-sy;if(Math.abs(dx)>3||Math.abs(dy)>3)moved=true;panX=px+dx;panY=py+dy;ut();}function mu(ev){document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);if(!moved&&btn===0){var ch=document.getElementById('ch');if(mode==='place'){ch.style.left=ev.clientX+'px';ch.style.top=ev.clientY+'px';ch.classList.add('show');extractPos(ev);}}else if(moved&&btn===0){document.getElementById('ch').classList.remove('show');}}document.addEventListener('mousemove',mm);document.addEventListener('mouseup',mu);});",
  "document.body.addEventListener('mousemove',function(e){if(mode==='place'){var ch=document.getElementById('ch');ch.style.left=e.clientX+'px';ch.style.top=e.clientY+'px';}});",
  "document.getElementById('mv').addEventListener('click',function(e){if(mode==='place'&&!e.target.closest('.pin-marker')){extractPos(e);showPicker();}});",
  "function extractPos(e){var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=e.clientX-wr.left,my=e.clientY-wr.top;var img=document.getElementById('mapImg');var ix=mx/scaleM-panX/scaleM,iy=my/scaleM-panY/scaleM;var pctX=Math.round(ix/img.clientWidth*10000)/100;var pctY=Math.round(iy/img.clientHeight*10000)/100;var cv=document.getElementById('cv');if(cv)cv.textContent=pctX+', '+pctY;}",
  "document.getElementById('mv').addEventListener('wheel',function(e){e.preventDefault();var f=e.deltaY>0?0.9:1.1;zoom(f,e.clientX,e.clientY);},{passive:false});",
  "document.getElementById('mv').addEventListener('touchstart',function(e){if(e.touches.length===2){touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);touchStartScale=scaleM;}},{passive:true});",
  "document.getElementById('mv').addEventListener('touchmove',function(e){if(e.touches.length===2){e.preventDefault();var dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);var ns=touchStartScale*dist/touchStartDist;zoomTo(Math.round(ns*100));}},{passive:false});",
  "var sb=document.getElementById('sb');if(sb)sb.onclick=function(){showPicker();mode='browse';document.getElementById('ch').classList.remove('show');var btn=document.getElementById('mdBtn');if(btn)btn.textContent='[B] 浏览';};",
  "var lb=document.getElementById('lbb');if(lb){var lp=document.getElementById('lp');if(lp){lb.onclick=function(e){e.stopPropagation();lp.classList.toggle('show');if(lp.classList.contains('show')){renderLayers();}};document.addEventListener('click',function(ev){if(lp&&!lp.contains(ev.target)&&ev.target!==document.getElementById('lbb'))lp.classList.remove('show');});}}",
  "if(typeof renderMarkers==='function')renderMarkers();",
  "function toggleMenu(){var m=document.getElementById('sideMenu');if(m){m.style.display=(m.style.display==='none'||!m.style.display)?'block':'none';}}",
  // 有URL参数时不加载服务器数据，只显示跳转点
  "var us=new URLSearchParams(window.location.search);setTimeout(function(){if(us.get('x')&&us.get('y')){jumpToFromUrl();}else{loadCloudPins();}checkReviewBtn();},300);"
];

var full=code.join('\n');
var op=(full.match(/\(/g)||[]).length;
var cp=(full.match(/\)/g)||[]).length;
var ob=(full.match(/\{/g)||[]).length;
var cb=(full.match(/\}/g)||[]).length;
console.log('module2: ('+op+'='+cp+') {'+ob+'='+cb+'} '+(op===cp&&ob===cb?'OK':'FAIL'));

if(op!==cp||ob!==cb){console.log('FAIL - abort');process.exit(1);}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  c=c.replace('</script>', full+'\n</script>');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('module2 DONE');
