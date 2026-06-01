var fs = require('fs');
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

// 用 function 来构建加载器 JS，避免 template literal 中的变量名冲突
function buildLoader() {
  return '(function(){' +
    'var D={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--card-border":"rgba(255,255,255,0.05)","--user-border":"rgba(255,255,255,0.06)","--menu-bg":"rgba(15,15,24,0.92)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};' +
    'var p=D;try{var s=JSON.parse(localStorage.getItem("abi_palette"));if(s&&typeof s==="object")p=s;}catch(e){}' +
    'var at=p["--accent"],bg=p["--bg-page"],tx=p["--text-body"],cd=p["--card-bg"],cb=p["--card-border"]||D["--card-border"],ub=p["--user-border"]||D["--user-border"];' +
    'var ar=parseInt(at.slice(1,3),16)+","+parseInt(at.slice(3,5),16)+","+parseInt(at.slice(5,7),16);' +
    'var st=document.createElement("style");st.id="abi-global";' +
    'st.textContent=' +
      '"html{--accent:"+at+";--bg-page:"+bg+";--text-body:"+tx+";--card-bg:"+cd+";--card-border:"+cb+";--user-border:"+ub+";--accent-rgb:"+ar+";--btn-blue-text:"+p["--btn-blue-text"]+";--btn-red-text:"+p["--btn-red-text"]+";--btn-green-text:"+p["--btn-green-text"]+";--btn-purple-text:"+p["--btn-purple-text"]+";}' +
      'body{background:"+bg+"!important;color:"+tx+"!important;}' +
      'div,section,article,aside,main,footer,header,nav,' +
      '.card,.panel,.container,.box,.map-detail,.map-section,.extract-item,.post-card,.video-card,' +
      '.navbar,.map-header,.map-card,.strategy-card,.weapon-card,.gear-card,.help-card,.review-card,' +
      '[class*="card"],[class*="panel"],[class*="container"],[class*="detail"],[class*="section"]' +
      '{background:"+cd+"!important;color:"+tx+"!important;}' +
      'h1,h2,h3,h4,h5,h6{color:"+tx+"!important;}' +
      'a{color:"+at+"!important;}' +
      '";' +
    'document.head.appendChild(st);' +
    'window.addEventListener("storage",function(e){if(e.key==="abi_palette"){location.reload();}});' +
  '})();';
}

var loaderJS = buildLoader();

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  c = c.replace('</style>', '\n' + cssVars + '</style>');

  var bodyIdx = c.lastIndexOf('</body>');
  var lastScr = c.lastIndexOf('</script>', bodyIdx);
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + loaderJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
