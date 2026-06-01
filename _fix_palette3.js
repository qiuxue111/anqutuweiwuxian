var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 找到 var colorConfig 开头到下一个 </script> 之间的所有 palette 代码，全部替换为干净版本
var start = c.indexOf('// --- palette ---');
if (start < 0) {
  // 用 var colorConfig 定位
  start = c.indexOf('var colorConfig');
}
if (start < 0) {
  console.log('palette code not found!');
  process.exit(1);
}

// 找到文件末尾的 </script>
var lastScriptEnd = c.lastIndexOf('</script>');
var endPart = c.substring(start);
// 定位到这段 palette script 真正结束的位置（或者文件末尾）
// 其实我们就直接替换整个从 start 到文件末尾的内容
var before = c.substring(0, start);

var cleanJS = '\n// --- palette ---\n' +
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
'function renderPalette(){var el=document.getElementById("paletteItems");if(!el)return;el.innerHTML=colorConfig.map(function(i){var c=getColor(i.key),h=getHexColor(i.key);return\'<div style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:5px;"><span style="font-size:0.75rem;color:#888;min-width:56px;">\'+i.label+\'</span><input type="color" value="\'+h+\'" style="width:28px;height:22px;border:none;border-radius:3px;padding:0;cursor:pointer;background:transparent;"></div>\';}).join("");}\n' +
'function applyColor(k,v){document.documentElement.style.setProperty(k,v);var s;try{s=JSON.parse(localStorage.getItem("abi_palette"))||{}}catch(e){s={}}s[k]=v;localStorage.setItem("abi_palette",JSON.stringify(s));renderPalette();}\n' +
'function resetPalette(){localStorage.removeItem("abi_palette");colorConfig.forEach(function(i){document.documentElement.style.setProperty(i.key,i.color);});renderPalette();}\n' +
'function togglePalette(){var p=document.getElementById("palettePanel");if(!p)return;p.style.display=p.style.display==="none"?"block":"none";if(p.style.display==="block")renderPalette();}\n' +
'function closePalette(){var p=document.getElementById("palettePanel");if(p)p.style.display="none";}\n' +
'(function(){loadPalette();var b=document.getElementById("paletteBtn");if(b)b.onclick=togglePalette;})();\n';

c = before + cleanJS + '\n</script>\n</body>\n</html>\n';
fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
