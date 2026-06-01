var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');
var idx = c.indexOf('// 调色板标签页');
var before = c.substring(0, idx);
var after = c.substring(idx);

var sysBtnCode = 
'  // 跟随系统\n' +
'  var sysBtn=document.createElement("button");sysBtn.textContent="\\uD83D\\uDD0D 跟随系统";sysBtn.style.cssText="padding:3px 6px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.04);color:#aaa;font-size:0.68rem;cursor:pointer;transition:all 0.15s;margin-bottom:4px;";\n' +
'sysBtn.onmouseenter=function(){this.style.borderColor="var(--accent)";this.style.color="var(--accent)";};\n' +
'sysBtn.onmouseleave=function(){this.style.borderColor="rgba(255,255,255,0.06)";this.style.color="#aaa";};\n' +
'sysBtn.onclick=function(){\n' +
'  var dark=window.matchMedia("(prefers-color-scheme:dark)").matches;\n' +
'  var cat=dark?"暗色":"淡色";\n' +
'  var t=THEMES[cat][Object.keys(THEMES[cat])[0]];\n' +
'  localStorage.setItem("abi_palette",JSON.stringify(t));\n' +
'  applyAll(t);\n' +
'  renderColors();\n' +
'};\n' +
'el.appendChild(sysBtn);\n';

c = before + sysBtnCode + after;
fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
