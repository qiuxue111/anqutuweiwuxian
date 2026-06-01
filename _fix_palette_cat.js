var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 找到 "// 预设标签页" 到 "function saveColor" 之间的内容，替换
var idx = c.indexOf('// 预设标签页');
var endIdx = c.indexOf('function saveColor(k,v){', idx);
if (endIdx < 0) endIdx = c.indexOf('function saveColor', idx);

var before = c.substring(0, idx);
var after = c.substring(endIdx);

var newCode = 
'  }\n' +
'function renderPaletteThemes(){\n' +
'  var el=document.getElementById("paletteItems");if(!el)return;\n' +
'  var catNames=Object.keys(THEMES);\n' +
'  var curCat=localStorage.getItem("abi_palette_cat")||catNames[0];\n' +
'  var oldCatBar=el.querySelector(".palette-cat-bar");if(oldCatBar)oldCatBar.remove();\n' +
'  var oldWrap=el.querySelector(".palette-theme-wrap");if(oldWrap)oldWrap.remove();\n' +
'  var catBar=document.createElement("div");catBar.className="palette-cat-bar";catBar.style.cssText="display:flex;gap:4px;margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);";\n' +
'  var themeWrap=document.createElement("div");themeWrap.className="palette-theme-wrap";themeWrap.style.cssText="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;";\n' +
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
'        renderPaletteThemes();\n' +
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
'}\n' +
'function saveColor(k,v){';

c = before + newCode + after;
fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
