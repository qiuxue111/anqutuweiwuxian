var fs=require('fs');
// 模块7: 云端同步 + URL跳转（独立查看模式）
var code = [
  // 只从服务器拿数据，不读本地
  "function loadCloudPins(){supabase('pins?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d){if(d&&d.length){cloudPins=d;}supabase('map_comments?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d2){if(d2&&d2.length)cloudComments=d2;loadCloudMarkers();})['catch'](function(){loadCloudMarkers();});})['catch'](function(){});}",
  "function loadCloudMarkers(){try{if(cloudPins.length){cloudPins.forEach(function(cp){if(cp.x!==void 0){pins.push({name:cp.name,x:cp.x,y:cp.y,id:cp.id,note:cp.note||'',images:cp.images||[],comments:cp.comments||[]});}});}if(cloudComments.length){cloudComments.forEach(function(cc){mapComments.push(cc);});}renderMarkers();renderMapComments();}catch(e){}}",
  "function loadFromLocal(){try{var d=JSON.parse(localStorage.getItem('abi_'+mapNameEng+'_pins'));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;}}catch(e){}}",
  // jumpToFromUrl: 独立查看模式，只显示跳转的容器，不加载服务器数据
  "function jumpToFromUrl(){var s=new URLSearchParams(window.location.search);var x=s.get('x'),y=s.get('y');if(!x||!y)return;var xf=parseFloat(x),yf=parseFloat(y);scaleM=8;var wrap=document.querySelector('.map-wrap');if(!wrap)return;var wr=wrap.getBoundingClientRect();var img=document.getElementById('mapImg');panX=(wr.width/2)-xf/100*img.clientWidth*scaleM;panY=(wr.height/2)-yf/100*img.clientHeight*scaleM;ut();document.getElementById('zr').value=800;document.getElementById('zl').textContent='800%';var mv=document.getElementById('mv');if(!mv)return;var name=s.get('name')||'';var div=document.createElement('div');div.style.cssText='position:absolute;left:'+xf+'%;top:'+yf+'%;transform:translate(-50%,-50%);z-index:998;text-align:center;pointer-events:none;width:14px;height:14px;border:2px solid #ff3333;border-radius:50%;background:rgba(255,50,50,.08);animation:blinkBorder 1.2s ease-in-out infinite';var inner=document.createElement('div');inner.style.cssText='width:100%;height:100%;display:flex;align-items:center;justify-content:center';var ic=getIconUrl(name);if(ic){var imgE=document.createElement('img');imgE.src=ic;imgE.style.cssText='width:6px;height:6px;border-radius:1px;object-fit:cover';imgE.onerror=function(){var d=document.createElement('div');d.style.cssText='width:6px;height:6px;background:#ff4444;border-radius:50%';this.parentElement.replaceChild(d,this);};inner.appendChild(imgE);}else{var dot=document.createElement('div');dot.style.cssText='width:6px;height:6px;background:#ff4444;border-radius:50%';inner.appendChild(dot);}div.appendChild(inner);mv.appendChild(div);var style=document.createElement('style');style.textContent='@keyframes blinkBorder{0%,100%{border-color:#ff3333;box-shadow:0 0 4px rgba(255,50,50,.5)}50%{border-color:#ff8888;box-shadow:0 0 10px rgba(255,50,50,.9)}}';document.head.appendChild(style);}",
];

var full=code.join('\n');
var op=(full.match(/\(/g)||[]).length;
var cp=(full.match(/\)/g)||[]).length;
var ob=(full.match(/\{/g)||[]).length;
var cb=(full.match(/\}/g)||[]).length;
console.log('module7: ('+op+'='+cp+') {'+ob+'='+cb+'} '+(op===cp&&ob===cb?'OK':'FAIL'));
if(op!==cp||ob!==cb){console.log('FAIL - abort');process.exit(1);}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  c=c.replace('</script>', full+'\n</script>');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('module7 DONE');
