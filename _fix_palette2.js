var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 1. 移除调色盘按钮的 onclick
var btnStart = c.indexOf('<button id="paletteBtn"');
if (btnStart >= 0) {
  var btnEnd = c.indexOf('</button>', btnStart) + 9;
  var oldBtn = c.substring(btnStart, btnEnd);
  var newBtn = '<button id="paletteBtn" style="position:fixed;bottom:14px;left:14px;z-index:9999;width:36px;height:36px;border-radius:50%;background:rgba(var(--accent-rgb),0.1);border:1px solid rgba(var(--accent-rgb),0.15);color:var(--accent);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;border:none;outline:none;" title="自定义配色">\u{1F3A8}</button>';
  c = c.replace(oldBtn, newBtn);
  console.log('fixed palette button');
}

// 2. 移除调色盘面板后的 <script>
var pDelIdx = c.indexOf('<!-- 调色盘入口 -->');
if (pDelIdx < 0) pDelIdx = c.indexOf('palettePanel');
if (pDelIdx >= 0) {
  var afterPanel = c.indexOf('</div>', pDelIdx + 200);
  if (afterPanel >= 0) afterPanel = c.indexOf('</div>', afterPanel + 6);
  if (afterPanel >= 0) {
    var nextScr = c.indexOf('<script>', afterPanel);
    var nextScrEnd = c.indexOf('</script>', nextScr) + 9;
    if (nextScr >= 0 && nextScrEnd > nextScr && nextScrEnd < c.length - 100) {
      c = c.substring(0, nextScr) + c.substring(nextScrEnd);
      console.log('removed inline palette script');
    }
  }
}

// 3. 在文件最后的 </script> 前注入 palette JS
var lsEnd = c.lastIndexOf('</script>');
if (lsEnd >= 0) {
  var paletteJS = '\n' +
'// --- palette ---\n' +
'var colorConfig = [\n' +
'  {key:"--accent",label:"主色调",color:"#ffc832"},\n' +
'  {key:"--bg-page",label:"背景色",color:"#08080e"},\n' +
'  {key:"--text-body",label:"文字色",color:"#ccc"},\n' +
'  {key:"--card-bg",label:"卡片底色",color:"rgba(20,20,30,0.6)"},\n' +
'  {key:"--btn-blue-text",label:"地图按钮",color:"#4a9eff"},\n' +
'  {key:"--btn-red-text",label:"改枪按钮",color:"#ff6b6b"},\n' +
'  {key:"--btn-green-text",label:"聊天按钮",color:"#51cf66"},\n' +
'  {key:"--btn-purple-text",label:"攻略按钮",color:"#cc5de8"}\n' +
'];\n' +
'function getHexColor(k){var s;try{s=JSON.parse(localStorage.getItem("abi_palette"))}catch(e){}var i=colorConfig.find(function(x){return x.key===k;});var v=(s&&s[k])||i.color;return v.indexOf("rgba")===0?"#ffc832":v;}\n' +
'function getColor(k){var s;try{s=JSON.parse(localStorage.getItem("abi_palette"))}catch(e){}var i=colorConfig.find(function(x){return x.key===k;});return(s&&s[k])||i.color;}\n' +
'function loadPalette(){var s;try{s=JSON.parse(localStorage.getItem("abi_palette"))}catch(e){}colorConfig.forEach(function(i){var v=(s&&s[i.key])||i.color;document.documentElement.style.setProperty(i.key,v);});}\n' +
'function renderPalette(){var el=document.getElementById("paletteItems");if(!el)return;el.innerHTML=colorConfig.map(function(i){var c=getColor(i.key),h=getHexColor(i.key);return\'<div style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:5px;"><span style="font-size:0.75rem;color:#888;min-width:56px;">\'+i.label+\'</span><input type="color" value="\'+h+\'" style="width:28px;height:22px;border:none;border-radius:3px;padding:0;cursor:pointer;background:transparent;" onchange="applyColor(\\\'\'+i.key+\'\\\',this.value)" oninput="applyColor(\\\'\'+i.key+\'\\\',this.value)"><input type="text" value="\'+c+\'" style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:4px;color:#ddd;font-size:0.7rem;padding:2px 4px;outline:none;" onchange="applyColor(\\\'\'+i.key+\'\\\',this.value)" oninput="applyColor(\\\'\'+i.key+\'\\\',this.value)"></div>\';}).join("");}\n' +
'function applyColor(k,v){document.documentElement.style.setProperty(k,v);var s;try{s=JSON.parse(localStorage.getItem("abi_palette"))||{}}catch(e){s={}}s[k]=v;localStorage.setItem("abi_palette",JSON.stringify(s));renderPalette();}\n' +
'function resetPalette(){localStorage.removeItem("abi_palette");colorConfig.forEach(function(i){document.documentElement.style.setProperty(i.key,i.color);});renderPalette();}\n' +
'function togglePalette(){var p=document.getElementById("palettePanel");if(!p)return;p.style.display=p.style.display==="none"?"block":"none";if(p.style.display==="block")renderPalette();}\n' +
'function closePalette(){var p=document.getElementById("palettePanel");if(p)p.style.display="none";}\n' +
'(function(){loadPalette();var b=document.getElementById("paletteBtn");if(b)b.onclick=togglePalette;})();\n';
  c = c.substring(0, lsEnd) + paletteJS + c.substring(lsEnd);
  console.log('palette JS injected at end');
}

fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
