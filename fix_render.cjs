const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 找到 renderMarkers 代码块并替换
var old = `function renderMarkers(){
  var mv=document.getElementById('mv');if(!mv)return;
  mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});
  pins.forEach(function(p,i){
    var el=document.createElement('div');el.className='pin-marker';
    el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';
    var ic=getIconUrl(p.name);
    if(ic){
      el.innerHTML='<img src="'+ic+'" style="width:'+(24/scaleM)+'px;height:'+(24/scaleM)+'px;border-radius:'+(6/scaleM)+'px;object-fit:cover;border:'+(2/scaleM)+'px solid rgba(255,200,50,0.6);box-shadow:0 0 '+(8/scaleM)+'px rgba(0,0,0,0.5)" onerror="this.style.display=\'none\'"><div style="width:'+(12/scaleM)+'px;height:'+(12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+(2/scaleM)+'px solid #fff;box-shadow:0 0 '+(6/scaleM)+'px rgba(0,0,0,0.5);display:none"></div>';
    } else {
      el.innerHTML='<div style="width:'+(12/scaleM)+'px;height:'+(12/scaleM)+'px;border-radius:50%;background:#ffc832;border:'+(2/scaleM)+'px solid #fff;box-shadow:0 0 '+(6/scaleM)+'px rgba(0,0,0,0.5)"></div>';
    }
    el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);
  });
}`;

// 获取当前内容
var text = c;
var startIdx = text.indexOf('function renderMarkers');
if (startIdx < 0) { console.log('renderMarkers not found!'); process.exit(1); }
// 找到下一个 function 声明位置作为结束
var endIdx = text.indexOf('\nfunction ', startIdx + 1);
if (endIdx < 0) endIdx = text.indexOf('\n//', startIdx + 1);
if (endIdx > startIdx) {
  var before = text.substring(0, startIdx);
  var after = text.substring(endIdx);
  text = before + old + after;
  fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', text);
  console.log('Replaced renderMarkers OK');
} else {
  console.log('Could not find end of renderMarkers');
}
