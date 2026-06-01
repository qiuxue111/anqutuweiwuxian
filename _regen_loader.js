var fs = require('fs');

var loader = '(function(){\n' +
'var DEFAULTS={' +
'"--accent":"#ffc832",' +
'"--bg-page":"#08080e",' +
'"--text-body":"#ccc",' +
'"--card-bg":"rgba(20,20,30,0.6)",' +
'"--btn-blue-text":"#4a9eff",' +
'"--btn-red-text":"#ff6b6b",' +
'"--btn-green-text":"#51cf66",' +
'"--btn-purple-text":"#cc5de8"' +
'};\n' +
'function getVal(k){try{var p=JSON.parse(localStorage.getItem("abi_palette"));if(p&&p[k]!==undefined)return p[k];}catch(e){}return DEFAULTS[k];}\n' +
'function applyAll(t){Object.keys(t).forEach(function(k){document.documentElement.style.setProperty(k,t[k]);});}\n' +
'try{var saved=JSON.parse(localStorage.getItem("abi_palette"));if(saved&&typeof saved==="object"){applyAll(saved);}}catch(e){}\n' +
'window.addEventListener("storage",function(e){if(e.key==="abi_palette"){try{var v=JSON.parse(e.newValue);if(v&&typeof v==="object")applyAll(v);}catch(ex){}}});\n' +
'})();';

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 删除旧的加载器（最后一个 (function(){ var DEFAULTS）
  var ls = c.lastIndexOf('(function(){');
  // 检查是不是我们的加载器（前一个 } 附近）
  if (ls >= 0) {
    var before = c.substring(0, ls);
    // 找到包裹 <script> 标签
    var scrStart = c.lastIndexOf('<script>', ls);
    if (scrStart >= 0) {
      var le = c.indexOf('})();', ls) + 5;
      if (le > 5) {
        // 检查这个 IIFE 后面是否有 </script>
        var closeScr = c.indexOf('</script>', le);
        if (closeScr >= 0 && closeScr - le < 20) {
          c = c.substring(0, scrStart) + c.substring(closeScr + 9);
        } else {
          c = c.substring(0, ls) + c.substring(le);
        }
      }
    }
  }
  
  // 注入新加载器
  var lastScr = c.lastIndexOf('</script>');
  c = c.substring(0, lastScr) + '\n' + loader + '\n' + c.substring(lastScr);
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});

console.log('\nDone.');
