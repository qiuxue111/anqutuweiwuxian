const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-beishan','map-valley','map-armory','map-airport','map-tvstation'];

maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');

  // 1. Fix zoom function
  var oldZoom = 'function zoom(f){scale*=f;if(scale<0.2)scale=0.2;if(scale>8)scale=8;updateTransform();}';
  var newZoom = 'function zoom(f,cx,cy){var el=document.getElementById("mv");if(!el)return;if(cx===undefined||cy===undefined){scale*=f;}else{scale*=f;var ix=(cx-panX)/scale*f;var iy=(cy-panY)/scale*f;panX=cx-ix;panY=cy-iy;}if(scale<0.2)scale=0.2;if(scale>8)scale=8;updateTransform();}';
  if (c.indexOf(oldZoom) >= 0) {
    c = c.replace(oldZoom, newZoom);
  }

  // 2. Fix zoomTo function
  var oldZoomTo = 'function zoomTo(v){v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;scale=v;updateTransform();}';
  var newZoomTo = 'function zoomTo(v,cx,cy){v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;if(cx!==undefined&&cy!==undefined){var el=document.getElementById("mv");if(el){var ratio=v/scale;var ix=(cx-panX)/v*ratio;var iy=(cy-panY)/v*ratio;panX=cx-ix;panY=cy-iy;}}scale=v;updateTransform();}';
  if (c.indexOf(oldZoomTo) >= 0) {
    c = c.replace(oldZoomTo, newZoomTo);
  }

  // 3. Fix wheel event
  var oldWheel = 'document.addEventListener("wheel",function(e){var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target))return;e.preventDefault();zoom(e.deltaY<0?1.1:0.9);},{passive:false});';
  var newWheel = 'document.addEventListener("wheel",function(e){var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target))return;e.preventDefault();var rect=mv.getBoundingClientRect();zoom(e.deltaY<0?1.1:0.9,e.clientX-rect.left,e.clientY-rect.top);},{passive:false});';
  if (c.indexOf(oldWheel) >= 0) {
    c = c.replace(oldWheel, newWheel);
  }

  // 4. Fix zoom controls HTML (- button, slider, + button)
  var oldCtrl = '<button onclick="zoom(0.85)">-</button>\n    <input type="range" id="zr" min="20" max="800" value="100" oninput="zoomTo(+this.value)">\n    <button onclick="zoom(1.18)">+</button>';
  var newCtrl = '<button onclick="var r=document.getElementById(\'mv\');if(r){var b=r.getBoundingClientRect();zoom(0.85,b.width/2,b.height/2);}">-</button>\n    <input type="range" id="zr" min="20" max="800" value="100" oninput="var r=document.getElementById(\'mv\');if(r){var b=r.getBoundingClientRect();zoomTo(+this.value,b.width/2,b.height/2);}">\n    <button onclick="var r=document.getElementById(\'mv\');if(r){var b=r.getBoundingClientRect();zoom(1.18,b.width/2,b.height/2);}">+</button>';
  if (c.indexOf(oldCtrl) >= 0) {
    c = c.replace(oldCtrl, newCtrl);
  }

  fs.writeFileSync(fp, c);
  console.log(name + ': fixed');
});

console.log('All done');
