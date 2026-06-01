var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 1. 替换 THEMES 为分组版本（暗色/淡色各12个）
var oldThemesStart = c.indexOf('var THEMES={');
var oldThemesEnd = c.indexOf('};', oldThemesStart) + 2;
var oldThemes = c.substring(oldThemesStart, oldThemesEnd);

var newThemes = 
'var THEMES={\n' +
'  "暗色":{\n' +
'    "默认暗色":{"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"},\n' +
'    "暗红风暴":{"--accent":"#e74c3c","--bg-page":"#0a0a0a","--text-body":"#ccc","--card-bg":"rgba(30,10,10,0.6)","--btn-blue-text":"#e74c3c","--btn-red-text":"#ff5252","--btn-green-text":"#e74c3c","--btn-purple-text":"#e74c3c"},\n' +
'    "极地蓝":{"--accent":"#5dade2","--bg-page":"#0a0e14","--text-body":"#b0c4de","--card-bg":"rgba(10,20,35,0.6)","--btn-blue-text":"#5dade2","--btn-red-text":"#e74c3c","--btn-green-text":"#2ecc71","--btn-purple-text":"#9b59b6"},\n' +
'    "翡翠绿":{"--accent":"#2ecc71","--bg-page":"#080c08","--text-body":"#b0d0b0","--card-bg":"rgba(10,25,10,0.6)","--btn-blue-text":"#2ecc71","--btn-red-text":"#e74c3c","--btn-green-text":"#2ecc71","--btn-purple-text":"#27ae60"},\n' +
'    "蒸汽紫":{"--accent":"#b388ff","--bg-page":"#0a0810","--text-body":"#c0b0d0","--card-bg":"rgba(15,10,25,0.6)","--btn-blue-text":"#b388ff","--btn-red-text":"#e74c3c","--btn-green-text":"#69f0ae","--btn-purple-text":"#b388ff"},\n' +
'    "日落橙":{"--accent":"#ff7043","--bg-page":"#0e0804","--text-body":"#d0b090","--card-bg":"rgba(25,15,5,0.6)","--btn-blue-text":"#ff7043","--btn-red-text":"#ff5252","--btn-green-text":"#ff7043","--btn-purple-text":"#ff7043"},\n' +
'    "深海蓝":{"--accent":"#00bcd4","--bg-page":"#060a0e","--text-body":"#90a4ae","--card-bg":"rgba(5,15,25,0.6)","--btn-blue-text":"#00bcd4","--btn-red-text":"#e57373","--btn-green-text":"#4db6ac","--btn-purple-text":"#7986cb"},\n' +
'    "赛博霓虹":{"--accent":"#00e5ff","--bg-page":"#050008","--text-body":"#b0b0c0","--card-bg":"rgba(5,0,15,0.6)","--btn-blue-text":"#00e5ff","--btn-red-text":"#ff1744","--btn-green-text":"#00e676","--btn-purple-text":"#d500f9"},\n' +
'    "血月":{"--accent":"#ff1744","--bg-page":"#080000","--text-body":"#d0a0a0","--card-bg":"rgba(15,0,0,0.6)","--btn-blue-text":"#ff1744","--btn-red-text":"#ff1744","--btn-green-text":"#ff1744","--btn-purple-text":"#ff1744"},\n' +
'    "琥珀光":{"--accent":"#ffb300","--bg-page":"#0a0800","--text-body":"#d0c088","--card-bg":"rgba(20,15,0,0.6)","--btn-blue-text":"#ffb300","--btn-red-text":"#ff6f00","--btn-green-text":"#ffb300","--btn-purple-text":"#ffb300"},\n' +
'    "岩石灰":{"--accent":"#78909c","--bg-page":"#0c0e10","--text-body":"#b0b8bc","--card-bg":"rgba(15,18,20,0.6)","--btn-blue-text":"#78909c","--btn-red-text":"#e57373","--btn-green-text":"#81c784","--btn-purple-text":"#ba68c8"},\n' +
'    "暗夜紫":{"--accent":"#ce93d8","--bg-page":"#040008","--text-body":"#b0a0c0","--card-bg":"rgba(8,0,15,0.6)","--btn-blue-text":"#ce93d8","--btn-red-text":"#f48fb1","--btn-green-text":"#80cbc4","--btn-purple-text":"#ce93d8"}\n' +
'  },\n' +
'  "淡色":{\n' +
'    "纯白极简":{"--accent":"#d4a843","--bg-page":"#efe8de","--text-body":"#3d3833","--card-bg":"rgba(255,252,248,0.82)","--btn-blue-text":"#5b7fb5","--btn-red-text":"#c0392b","--btn-green-text":"#2d7d46","--btn-purple-text":"#7d4e9a"},\n' +
'    "樱花粉":{"--accent":"#e8839a","--bg-page":"#f5eae8","--text-body":"#4a3e40","--card-bg":"rgba(255,248,246,0.8)","--btn-blue-text":"#c48090","--btn-red-text":"#c0392b","--btn-green-text":"#5a8a6a","--btn-purple-text":"#a07a9a"},\n' +
'    "青草绿":{"--accent":"#5aa85a","--bg-page":"#eef2e8","--text-body":"#3a4038","--card-bg":"rgba(248,252,242,0.8)","--btn-blue-text":"#5a8a7a","--btn-red-text":"#c0392b","--btn-green-text":"#5aa85a","--btn-purple-text":"#7a6a8a"},\n' +
'    "天空蓝":{"--accent":"#4a8fc8","--bg-page":"#e6ecf0","--text-body":"#384248","--card-bg":"rgba(242,248,252,0.8)","--btn-blue-text":"#4a8fc8","--btn-red-text":"#c0392b","--btn-green-text":"#4a8f6a","--btn-purple-text":"#7a5a98"},\n' +
'    "暖阳米":{"--accent":"#c4935a","--bg-page":"#ece4d8","--text-body":"#423a33","--card-bg":"rgba(252,248,238,0.82)","--btn-blue-text":"#9a7a5a","--btn-red-text":"#b85a30","--btn-green-text":"#6a8a4a","--btn-purple-text":"#8a6a5a"},\n' +
'    "薰衣草":{"--accent":"#8a6ac8","--bg-page":"#eae6f0","--text-body":"#3a3442","--card-bg":"rgba(246,242,252,0.8)","--btn-blue-text":"#7a6aaa","--btn-red-text":"#b84a5a","--btn-green-text":"#5a8a6a","--btn-purple-text":"#8a6ac8"},\n' +
'    "马卡龙":{"--accent":"#d4a030","--bg-page":"#f0ead8","--text-body":"#403a30","--card-bg":"rgba(252,250,238,0.82)","--btn-blue-text":"#5a8ab0","--btn-red-text":"#c05a4a","--btn-green-text":"#4a9a6a","--btn-purple-text":"#8a7aa0"},\n' +
'    "奶油白":{"--accent":"#d88a8a","--bg-page":"#f0eaea","--text-body":"#423838","--card-bg":"rgba(253,250,248,0.82)","--btn-blue-text":"#8a8ac0","--btn-red-text":"#c05a5a","--btn-green-text":"#6a9a6a","--btn-purple-text":"#9a7aaa"},\n' +
'    "薄荷冰":{"--accent":"#6ab0aa","--bg-page":"#e8eeec","--text-body":"#384242","--card-bg":"rgba(242,250,248,0.8)","--btn-blue-text":"#6a9aaa","--btn-red-text":"#b05a5a","--btn-green-text":"#5a9a7a","--btn-purple-text":"#7a8a9a"},\n' +
'    "蜜桃橘":{"--accent":"#e8946a","--bg-page":"#efe6e0","--text-body":"#423a38","--card-bg":"rgba(254,248,242,0.8)","--btn-blue-text":"#c07a6a","--btn-red-text":"#b85a4a","--btn-green-text":"#6a8a5a","--btn-purple-text":"#9a7a7a"},\n' +
'    "雾霾蓝":{"--accent":"#7a909a","--bg-page":"#e2e6ea","--text-body":"#383e42","--card-bg":"rgba(244,248,250,0.8)","--btn-blue-text":"#7a909a","--btn-red-text":"#a05a5a","--btn-green-text":"#6a8a7a","--btn-purple-text":"#7a7a8a"},\n' +
'    "香槟金":{"--accent":"#b8944e","--bg-page":"#ece6da","--text-body":"#403a33","--card-bg":"rgba(252,250,240,0.82)","--btn-blue-text":"#9a7a5a","--btn-red-text":"#b86a4a","--btn-green-text":"#6a7a4a","--btn-purple-text":"#8a7a5a"}\n' +
'  }\n' +
'};';

c = c.replace(oldThemes, newThemes);
console.log('replaced THEMES');

// 2. 在 renderColors 函数末尾，el.appendChild(themeRow) 之后 插入分类标签页代码
// 找到 "el.appendChild(themeRow);" 和下一个函数之间
var oldPresetSection = 
'  // 预设按钮\n' +
'  var themeRow=document.createElement("div");themeRow.style.cssText="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);";\n' +
'  Object.keys(THEMES).forEach(function(name){\n' +
'    var btn=document.createElement("button");btn.textContent=name;btn.style.cssText="padding:3px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#aaa;font-size:0.68rem;cursor:pointer;transition:all 0.15s;";\n' +
'    btn.onmouseenter=function(){this.style.borderColor="var(--accent)";this.style.color="var(--accent)";};\n' +
'    btn.onmouseleave=function(){this.style.borderColor="rgba(255,255,255,0.06)";this.style.color="#aaa";};\n' +
'    btn.onclick=function(){\n' +
'      localStorage.setItem("abi_palette",JSON.stringify(THEMES[name]));\n' +
'      applyAll(THEMES[name]);\n' +
'      renderColors();\n' +
'    };\n' +
'    themeRow.appendChild(btn);\n' +
'  });\n' +
'  el.appendChild(themeRow);\n' +
'}';

// 提取 IFFE 最后的 })(); 之前的部分
var oldEndSection = 
'loadColors();\n' +
'document.getElementById("paletteBtn").onclick=function(){var p=document.getElementById("palettePanel");p.style.display=p.style.display==="none"?"block":"none";if(p.style.display==="block")renderColors();};\n' +
'document.getElementById("resetPaletteBtn").onclick=resetColors;\n' +
'document.getElementById("closePaletteBtn").onclick=function(){document.getElementById("palettePanel").style.display="none";};\n' +
'})();\n';

var newPresetSection = 
'  }\n' +
'  // 调色板标签页\n' +
'  var catNames=Object.keys(THEMES);\n' +
'  var curCat=localStorage.getItem("abi_palette_cat")||catNames[0];\n' +
'  var catBar=document.createElement("div");catBar.style.cssText="display:flex;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);";\n' +
'  var themeWrap=document.createElement("div");themeWrap.style.cssText="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;";\n' +
'  function renderThemes(cat){\n' +
'    themeWrap.innerHTML="";\n' +
'    var list=THEMES[cat];\n' +
'    Object.keys(list).forEach(function(name){\n' +
'      var t=list[name];\n' +
'      var preview=t["--accent"];\n' +
'      var btn=document.createElement("button");\n' +
'      var dot=document.createElement("span");dot.style.cssText="display:inline-block;width:8px;height:8px;border-radius:50%;background:"+preview+";margin-right:4px;vertical-align:middle;";\n' +
'      btn.appendChild(dot);\n' +
'      btn.appendChild(document.createTextNode(name));\n' +
'      btn.style.cssText="padding:3px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#aaa;font-size:0.68rem;cursor:pointer;transition:all 0.15s;";\n' +
'      btn.onmouseenter=function(){this.style.borderColor="var(--accent)";this.style.color="var(--accent)";};\n' +
'      btn.onmouseleave=function(){this.style.borderColor="rgba(255,255,255,0.06)";this.style.color="#aaa";};\n' +
'      btn.onclick=function(){\n' +
'        localStorage.setItem("abi_palette",JSON.stringify(t));\n' +
'        applyAll(t);\n' +
'        renderColors();\n' +
'      };\n' +
'      themeWrap.appendChild(btn);\n' +
'    });\n' +
'  }\n' +
'  catNames.forEach(function(n){\n' +
'    var tab=document.createElement("button");tab.textContent=n;tab.style.cssText="padding:2px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#888;font-size:0.68rem;cursor:pointer;transition:all 0.15s;";\n' +
'    tab.onclick=function(){\n' +
'      curCat=n;\n' +
'      localStorage.setItem("abi_palette_cat",n);\n' +
'      catBar.querySelectorAll("button").forEach(function(b){b.style.background="rgba(255,255,255,0.04)";b.style.color="#888";b.style.fontWeight="normal";});\n' +
'      this.style.background="rgba(255,200,50,0.15)";this.style.color="var(--accent)";this.style.fontWeight="600";\n' +
'      renderThemes(n);\n' +
'    };\n' +
'    catBar.appendChild(tab);\n' +
'  });\n' +
'  renderThemes(curCat);\n' +
'  catBar.querySelectorAll("button").forEach(function(b){if(b.textContent===curCat){b.style.background="rgba(255,200,50,0.15)";b.style.color="var(--accent)";b.style.fontWeight="600";}});\n' +
'  el.appendChild(catBar);\n' +
'  el.appendChild(themeWrap);\n' +
'}\n';

c = c.replace(oldPresetSection, newPresetSection);
console.log('replaced preset section');

fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
