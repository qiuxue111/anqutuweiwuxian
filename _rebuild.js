var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// === 1. CSS 变量 ===
var cssVars = '\n/* CSS 变量 — 调色盘可自定义 */\n' +
':root{\n' +
'  --bg-page:#08080e;\n' +
'  --text-body:#ccc;\n' +
'  --accent:#ffc832;\n' +
'  --accent-rgb:255,200,50;\n' +
'  --card-bg:rgba(20,20,30,0.6);\n' +
'  --card-border:rgba(255,255,255,0.05);\n' +
'  --card-hover:rgba(255,200,50,0.08);\n' +
'  --user-bg:rgba(20,20,30,0.7);\n' +
'  --user-border:rgba(255,255,255,0.06);\n' +
'  --menu-bg:rgba(15,15,24,0.92);\n' +
'  --menu-border:rgba(255,255,255,0.06);\n' +
'  --btn-blue-bg:rgba(50,150,255,0.1);\n' +
'  --btn-blue-border:rgba(50,150,255,0.2);\n' +
'  --btn-blue-text:#4a9eff;\n' +
'  --btn-red-bg:rgba(255,100,100,0.1);\n' +
'  --btn-red-border:rgba(255,100,100,0.2);\n' +
'  --btn-red-text:#ff6b6b;\n' +
'  --btn-green-bg:rgba(100,200,100,0.1);\n' +
'  --btn-green-border:rgba(100,200,100,0.2);\n' +
'  --btn-green-text:#51cf66;\n' +
'  --btn-purple-bg:rgba(200,100,255,0.1);\n' +
'  --btn-purple-border:rgba(200,100,255,0.2);\n' +
'  --btn-purple-text:#cc5de8;\n' +
'}\n';
c = c.replace('<style>', '<style>' + cssVars);

// === 2. 替换 body ===
c = c.replace('body{background:#08080e;color:#ccc;', 'body{background:var(--bg-page);color:var(--text-body);');

// === 3. 替换颜色值 ===
var lines = c.split('\n');
lines = lines.map(function(line) {
  if (line.indexOf('--accent:') >= 0 || line.indexOf('--accent-rgb:') >= 0) return line;
  return line.replace(/#ffc832/g, 'var(--accent)');
});
c = lines.join('\n');
c = c.replace(/rgba\(255,200,50,(\d+\.?\d*)\)/g, 'rgba(var(--accent-rgb),$1)');
c = c.replace(/rgba\(20,20,30,0\.6\)/g,  'var(--card-bg)');
c = c.replace(/rgba\(20,20,30,0\.7\)/g,  'var(--user-bg)');
c = c.replace(/rgba\(15,15,24,0\.92\)/g, 'var(--menu-bg)');
c = c.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--card-border)');
c = c.replace(/rgba\(255,255,255,0\.06\)/g, 'var(--user-border)');
c = c.replace(/rgba\(50,150,255,0\.1\)/g,  'var(--btn-blue-bg)');
c = c.replace(/rgba\(50,150,255,0\.2\)/g,  'var(--btn-blue-border)');
c = c.replace(/#4a9eff/g, 'var(--btn-blue-text)');
c = c.replace(/rgba\(255,100,100,0\.1\)/g, 'var(--btn-red-bg)');
c = c.replace(/rgba\(255,100,100,0\.2\)/g, 'var(--btn-red-border)');
c = c.replace(/#ff6b6b/g, 'var(--btn-red-text)');
c = c.replace(/rgba\(100,200,100,0\.1\)/g, 'var(--btn-green-bg)');
c = c.replace(/rgba\(100,200,100,0\.2\)/g, 'var(--btn-green-border)');
c = c.replace(/#51cf66/g, 'var(--btn-green-text)');
c = c.replace(/rgba\(200,100,255,0\.1\)/g, 'var(--btn-purple-bg)');
c = c.replace(/rgba\(200,100,255,0\.2\)/g, 'var(--btn-purple-border)');
c = c.replace(/#cc5de8/g, 'var(--btn-purple-text)');

// === 4. 在 3x3 卡片后加地图导航 ===
var navHtml = '\n\n  <!-- 战术交互地图 -->\n' +
'  <div class="enter-fade enter-delay-10" style="margin-top:1rem;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px;">\n' +
'    <div style="color:var(--accent);font-size:1rem;font-weight:600;margin-bottom:10px;">&#x1F5FA;&#xFE0F; 战术交互地图</div>\n' +
'    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">\n';

var maps = [
  ['map-farm.html',     '\u{1F33E}', '农场'],
  ['map-beishan.html',  '\u{1F3D4}\uFE0F', '北山'],
  ['map-tvstation.html','\u{1F4FA}', '电视台'],
  ['map-armory.html',   '\u{1F52B}', '军械库'],
  ['map-valley.html',   '\u{1F3DE}\uFE0F', '山谷'],
  ['map-airport.html',  '\u2708\uFE0F', '机场']
];
maps.forEach(function(m) {
  navHtml += '      <a href="pages/' + m[0] + '" style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;text-decoration:none;transition:all 0.15s;">\n' +
    '        <span style="font-size:1.2rem;">' + m[1] + '</span>\n' +
    '        <span style="color:var(--text-body);font-size:0.9rem;">' + m[2] + '</span>\n' +
    '      </a>\n';
});
navHtml += '    </div>\n  </div>';

// 找到 3x3 卡片结尾 -> 后面的 </div>
var cardEnd = c.indexOf('<span style="color:#888;font-size:0.9rem;">\u2192</span>');
if (cardEnd >= 0) {
  var divClose1 = c.indexOf('</div>', cardEnd);
  var divClose2 = c.indexOf('</div>', divClose1 + 6);
  var divClose3 = c.indexOf('</div>', divClose2 + 6);
  c = c.substring(0, divClose3 + 6) + navHtml + c.substring(divClose3 + 6);
  console.log('map nav injected');
} else {
  console.log('card end not found, injecting after 3x3 link');
  var threeXthree = c.indexOf('3\u00D73 赛季任务一图流');
  if (threeXthree >= 0) {
    var aClose = c.indexOf('</a>', threeXthree);
    aClose = c.indexOf('</a>', aClose + 4);
    var divAfter = c.indexOf('</div>', aClose + 4);
    divAfter = c.indexOf('</div>', divAfter + 6);
    c = c.substring(0, divAfter + 6) + navHtml + c.substring(divAfter + 6);
    console.log('map nav injected (alt)');
  }
}

// === 5. 在 </body> 前注入调色盘 HTML + JS ===
// 先注入按钮和面板 HTML
var paletteUI = '\n\n<!-- palette -->\n' +
'<button id="paletteBtn" style="position:fixed;bottom:14px;left:14px;z-index:9999;width:36px;height:36px;border-radius:50%;background:rgba(var(--accent-rgb),0.1);border:1px solid rgba(var(--accent-rgb),0.15);color:var(--accent);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;border:none;outline:none;" title="自定义配色">&#x1F3A8;</button>\n' +
'<div id="palettePanel" style="display:none;position:fixed;bottom:56px;left:14px;z-index:9998;background:var(--menu-bg);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid var(--menu-border);border-radius:10px;padding:12px;min-width:220px;box-shadow:0 4px 24px rgba(0,0,0,0.5);">\n' +
'  <div style="color:var(--accent);font-size:0.85rem;font-weight:600;margin-bottom:8px;">&#x1F3A8; 自定义配色</div>\n' +
'  <div id="paletteItems" style="display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto;padding-right:4px;"></div>\n' +
'  <div style="display:flex;gap:6px;margin-top:8px;">\n' +
'    <button id="resetBtn2" style="flex:1;padding:4px 0;border-radius:5px;border:1px solid var(--menu-border);background:transparent;color:#888;font-size:0.75rem;cursor:pointer;">重置</button>\n' +
'    <button id="closeBtn2" style="flex:1;padding:4px 0;border-radius:5px;border:1px solid var(--menu-border);background:transparent;color:#888;font-size:0.75rem;cursor:pointer;">关闭</button>\n' +
'  </div>\n' +
'</div>\n';

// 再在最后的 </script> 前注入 palette JS
var lsEnd = c.lastIndexOf('</script>');
var paletteJS = '\n// palette\n' +
'(function(){\n' +
'var cc=[\n' +
'  {k:"--accent",l:"主色调",v:"#ffc832"},\n' +
'  {k:"--bg-page",l:"背景色",v:"#08080e"},\n' +
'  {k:"--text-body",l:"文字色",v:"#ccc"},\n' +
'  {k:"--card-bg",l:"卡片底色",v:"rgba(20,20,30,0.6)"},\n' +
'  {k:"--btn-blue-text",l:"地图按钮",v:"#4a9eff"},\n' +
'  {k:"--btn-red-text",l:"改枪按钮",v:"#ff6b6b"},\n' +
'  {k:"--btn-green-text",l:"聊天按钮",v:"#51cf66"},\n' +
'  {k:"--btn-purple-text",l:"攻略按钮",v:"#cc5de8"}\n' +
'];\n' +
'function ld(){\n' +
'  var s; try{ s=JSON.parse(localStorage.getItem("abi_palette")); }catch(e){}\n' +
'  cc.forEach(function(x){ var v=(s&&s[x.k])||x.v; document.documentElement.style.setProperty(x.k,v); });\n' +
'}\n' +
'function rd(){\n' +
'  var el=document.getElementById("paletteItems"); if(!el) return;\n' +
'  var s; try{ s=JSON.parse(localStorage.getItem("abi_palette")); }catch(e){}\n' +
'  el.innerHTML="";\n' +
'  cc.forEach(function(x,i){\n' +
'    var cur=(s&&s[x.k])||x.v;\n' +
'    var hex=cur.indexOf("rgba")===0?"#ffc832":cur;\n' +
'    var row=document.createElement("div"); row.style.cssText="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:5px;";\n' +
'    var lb=document.createElement("span"); lb.textContent=x.l; lb.style.cssText="font-size:0.75rem;color:#888;min-width:56px;";\n' +
'    var cp=document.createElement("input"); cp.type="color"; cp.value=hex; cp.style.cssText="width:28px;height:22px;border:none;border-radius:3px;padding:0;cursor:pointer;background:transparent;";\n' +
'    var tx=document.createElement("input"); tx.type="text"; tx.value=cur; tx.style.cssText="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:4px;color:#ddd;font-size:0.7rem;padding:2px 4px;outline:none;";\n' +
'    cp.oninput=function(){ tx.value=this.value; ap(x.k,this.value); };\n' +
'    tx.oninput=function(){ ap(x.k,this.value); if(this.value.indexOf("#")===0) cp.value=this.value; };\n' +
'    row.appendChild(lb); row.appendChild(cp); row.appendChild(tx);\n' +
'    el.appendChild(row);\n' +
'  });\n' +
'}\n' +
'function ap(k,v){ document.documentElement.style.setProperty(k,v); var s; try{ s=JSON.parse(localStorage.getItem("abi_palette"))||{}; }catch(e){ s={}; } s[k]=v; localStorage.setItem("abi_palette",JSON.stringify(s)); }\n' +
'function rs(){ localStorage.removeItem("abi_palette"); cc.forEach(function(x){ document.documentElement.style.setProperty(x.k,x.v); }); rd(); }\n' +
'function tg(){ var p=document.getElementById("palettePanel"); if(!p) return; p.style.display=p.style.display==="none"?"block":"none"; if(p.style.display==="block") rd(); }\n' +
'ld();\n' +
'var b=document.getElementById("paletteBtn"); if(b) b.onclick=tg;\n' +
'document.getElementById("resetBtn2").onclick=rs;\n' +
'document.getElementById("closeBtn2").onclick=function(){ document.getElementById("palettePanel").style.display="none"; };\n' +
'})();\n';

c = c.substring(0, lsEnd) + paletteJS + c.substring(lsEnd);
c = c.replace('</body>', paletteUI + '</body>');

fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('done, size:', c.length);
