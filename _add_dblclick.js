var fs = require('fs');
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  var zfn = 'function zoom(';
  var zi = c.indexOf(zfn);
  if (zi < 0) { console.log(n + ': zoom fn not found'); return; }
  
  var bc = 0, found = false;
  for (var i = zi; i < c.length; i++) {
    if (c[i] === '{') bc++;
    if (c[i] === '}') {
      bc--;
      if (bc === 0) {
        var insert = 
'\n\n// 双击放大地图\n' +
'document.addEventListener("dblclick",function(e){\n' +
'  var wrap=document.querySelector(".map-wrap");\n' +
'  if(!wrap||!wrap.contains(e.target))return;\n' +
'  var wr=wrap.getBoundingClientRect();\n' +
'  zoom(2,e.clientX-wr.left,e.clientY-wr.top);\n' +
'});\n';
        c = c.substring(0, i + 1) + insert + c.substring(i + 1);
        fs.writeFileSync(fp, c, 'utf-8');
        console.log(n + ': dblclick added');
        found = true;
        break;
      }
    }
  }
  if (!found) console.log(n + ': FAILED');
});
