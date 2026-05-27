var fs=require('fs');
// 模块4: renderMarkers (图标+圆点 独立)
var code = [
  "function renderMarkers(){var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});pins.forEach(function(p,i){var el=document.createElement('div');el.className='pin-marker';el.setAttribute('data-pin-idx',i);el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';var ic=getIconUrl(p.name);if(ic){var img=document.createElement('img');img.src=ic;var s=Math.min(100,60/Math.pow(scaleM,1.176));img.style.cssText='width:'+s+'px;height:'+s+'px;border-radius:'+Math.min(10,4/Math.pow(scaleM,1.176))+'px;object-fit:cover;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';img.onerror=function(){this.style.display='none';};el.appendChild(img);var dot=document.createElement('div');var ds=Math.min(60,36/Math.pow(scaleM,1.176));dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5);display:none';el.appendChild(dot);}else{var dot=document.createElement('div');var ds=Math.min(60,36/Math.pow(scaleM,1.176));dot.style.cssText='width:'+ds+'px;height:'+ds+'px;border-radius:50%;background:#ffc832;border:'+Math.min(3,2/Math.pow(scaleM,1.176))+'px solid #fff;box-shadow:0 0 '+Math.min(12,5/Math.pow(scaleM,1.176))+'px rgba(0,0,0,0.5)';el.appendChild(dot);}el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);});setTimeout(dispatchLayerCheck,100);}"
];

var full=code.join('\n');
var op=(full.match(/\(/g)||[]).length;
var cp=(full.match(/\)/g)||[]).length;
var ob=(full.match(/\{/g)||[]).length;
var cb=(full.match(/\}/g)||[]).length;
console.log('module4: ('+op+'='+cp+') {'+ob+'='+cb+'} '+(op===cp&&ob===cb?'OK':'FAIL'));
if(op!==cp||ob!==cb){console.log('FAIL - abort');process.exit(1);}

var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  c=c.replace('</script>', full+'\n</script>');
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('module4 DONE');
