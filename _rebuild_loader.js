var fs = require('fs');
var files = ['3x3','gear','help','maps','review','strategy','weapons','map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 找到旧的加载器 (function(){...})() 并替换
  var ls = c.lastIndexOf('(function(){');
  var le = c.lastIndexOf('})();') + 5;
  if (ls < 0 || le < 0) {
    console.log(n + ': no loader found');
    return;
  }
  
  var newLoader = 
'(function(){' +
'var w=window.name||"";' +
'var p;' +
'try{p=JSON.parse(w)}catch(e){}' +
'if(!p||!p["--accent"]){try{p=JSON.parse(localStorage.getItem("abi_palette"))}catch(e){}}' +
'if(!p||!p["--accent"])p={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)",' +
'"--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};' +
'var at=p["--accent"],bg=p["--bg-page"],tx=p["--text-body"],cd=p["--card-bg"];' +
'var ar=parseInt(at.slice(1,3),16)+","+parseInt(at.slice(3,5),16)+","+parseInt(at.slice(5,7),16);' +
'var css=["--bg-page","--text-body","--accent","--accent-rgb","--card-bg","--card-border","--user-border","--menu-bg",' +
'"--btn-blue-text","--btn-red-text","--btn-green-text","--btn-purple-text"];' +
'var vals=[bg,tx,at,ar,cd,p["--card-border"],p["--user-border"],p["--menu-bg"],' +
'p["--btn-blue-text"],p["--btn-red-text"],p["--btn-green-text"],p["--btn-purple-text"]];' +
'for(var i=0;i<css.length;i++){if(vals[i])document.documentElement.style.setProperty(css[i],vals[i]);}' +
'document.body.style.background=bg;document.body.style.color=tx;})()';
  
  c = c.substring(0, ls) + newLoader + c.substring(le);
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
