const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 找到 renderMarkers 并整块替换
var start = c.indexOf('function renderMarkers()');
var end = c.indexOf('\nfunction ', start + 1);
if (end < 0) end = c.length;

var newMarkers = `
function renderMarkers(){
  var mv=document.getElementById('mv');if(!mv)return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=getIconUrl(p.name);
    if(ic){
      el.innerHTML='<img src="'+ic+'" style="width:'+Math.max(12,24/scaleM)+'px;height:'+Math.max(12,24/scaleM)+'px;border-radius:'+Math.max(3,6/scaleM)+'px;object-fit:cover;border:'+Math.max(1,2/scaleM)+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+Math.max(4,8/scaleM)+'px rgba(0,0,0,0.5)" onerror="this.style.display=\\"none\\""><div style="width:'+Math.max(8,12/scaleM)+'px;height:'+Math.max(8,12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+Math.max(1,2/scaleM)+'px solid #fff;box-shadow:0 0 '+Math.max(3,6/scaleM)+'px rgba(0,0,0,0.5);display:none"></div>';
    } else {
      el.innerHTML='<div style="width:'+Math.max(8,12/scaleM)+'px;height:'+Math.max(8,12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+Math.max(1,2/scaleM)+'px solid #fff;box-shadow:0 0 '+Math.max(3,6/scaleM)+'px rgba(0,0,0,0.5)"></div>';
    }
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);
  });
}`;

c = c.substring(0, start) + newMarkers + c.substring(end);
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Replaced renderMarkers clean');
