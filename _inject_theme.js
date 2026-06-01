/* ===== 自定义调色盘注入 ===== */
/* 读取 index.html，替换所有硬编码颜色为 CSS 变量 */
var fs = require('fs');
var path = 'F:/暗区突围网站/index.html';
var c = fs.readFileSync(path, 'utf-8');

/* 1. 在 <style> 开头注入 CSS 变量 */
var varBlock = `/* CSS 变量 — 调色盘可自定义 */
:root{
  --bg-page:#08080e;
  --text-body:#ccc;
  --accent:#ffc832;
  --accent-rgb:255,200,50;
  --card-bg:rgba(20,20,30,0.6);
  --card-border:rgba(255,255,255,0.05);
  --card-hover:rgba(255,200,50,0.08);
  --btn-blue-bg:rgba(50,150,255,0.1);
  --btn-blue-border:rgba(50,150,255,0.2);
  --btn-blue-text:#4a9eff;
  --btn-red-bg:rgba(255,100,100,0.1);
  --btn-red-border:rgba(255,100,100,0.2);
  --btn-red-text:#ff6b6b;
  --btn-green-bg:rgba(100,200,100,0.1);
  --btn-green-border:rgba(100,200,100,0.2);
  --btn-green-text:#51cf66;
  --btn-purple-bg:rgba(200,100,255,0.1);
  --btn-purple-border:rgba(200,100,255,0.2);
  --btn-purple-text:#cc5de8;
  --link-hover:#ffc832;
  --user-bg:rgba(20,20,30,0.7);
  --user-border:rgba(255,255,255,0.06);
  --menu-bg:rgba(15,15,24,0.92);
  --menu-border:rgba(255,255,255,0.06);
}
`;

c = c.replace('<style>/* Reset & base */', '<style>' + varBlock + '/* Reset & base */');

/* 2. 替换 body 背景和文字 */
c = c.replace('body{background:#08080e;color:#ccc;', 'body{background:var(--bg-page);color:var(--text-body);');

/* 3. 替换金色 accent */
c = c.replace(/#ffc832/g, 'var(--accent)');
/* 替换金色 rgba */
c = c.replace(/rgba\(255,200,50,0\.12\)/g, 'rgba(var(--accent-rgb),0.12)');
c = c.replace(/rgba\(255,200,50,0\.15\)/g, 'rgba(var(--accent-rgb),0.15)');
c = c.replace(/rgba\(255,200,50,0\.25\)/g, 'rgba(var(--accent-rgb),0.25)');
c = c.replace(/rgba\(255,200,50,0\.08\)/g, 'rgba(var(--accent-rgb),0.08)');
c = c.replace(/rgba\(255,200,50,0\.1\)/g, 'rgba(var(--accent-rgb),0.1)');
c = c.replace(/rgba\(255,200,50,0\.18\)/g, 'rgba(var(--accent-rgb),0.18)');
c = c.replace(/rgba\(255,200,50,0\.35\)/g, 'rgba(var(--accent-rgb),0.35)');
c = c.replace(/rgba\(255,200,50,0\.44\)/g, 'rgba(var(--accent-rgb),0.44)');
c = c.replace(/rgba\(255,200,50,0\.55\)/g, 'rgba(var(--accent-rgb),0.55)');

/* 4. 替换卡片背景 */
c = c.replace(/rgba\(20,20,30,0\.6\)/g, 'var(--card-bg)');
c = c.replace(/rgba\(20,20,30,0\.7\)/g, 'var(--user-bg)');
c = c.replace(/rgba\(15,15,24,0\.92\)/g, 'var(--menu-bg)');

/* 5. 替换按钮颜色 */
c = c.replace(/rgba\(50,150,255,0\.1\)/g, 'var(--btn-blue-bg)');
c = c.replace(/rgba\(50,150,255,0\.2\)/g, 'var(--btn-blue-border)');
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

/* 6. 替换卡片 border */
c = c.replace(/rgba\(255,255,255,0\.05\)/g, 'var(--card-border)');
c = c.replace(/rgba\(255,255,255,0\.06\)/g, 'var(--user-border)');

/* 7. 替换 link hover */
c = c.replace(/rgba\(255,200,50,0\.08\)/g, 'var(--card-hover)');

/* 8. 注入调色盘按钮和面板 HTML（在 </div><!-- 战术交互地图导航 --> 后面） */
var paletteHTML = `
  <!-- 调色盘入口按钮（左下角固定） -->
  <button id="paletteBtn" style="position:fixed;bottom:14px;left:14px;z-index:9999;width:36px;height:36px;border-radius:50%;background:rgba(var(--accent-rgb),0.1);border:1px solid rgba(var(--accent-rgb),0.15);color:var(--accent);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;" onclick="togglePalette()" title="自定义配色">🎨</button>

  <!-- 调色盘面板 -->
  <div id="palettePanel" style="display:none;position:fixed;bottom:56px;left:14px;z-index:9998;background:var(--menu-bg);backdrop-filter:blur(12px);border:1px solid var(--menu-border);border-radius:10px;padding:12px;min-width:220px;box-shadow:0 4px 24px rgba(0,0,0,0.5);">
    <div style="color:var(--accent);font-size:0.85rem;font-weight:600;margin-bottom:8px;">🎨 自定义配色</div>
    <div id="paletteItems" style="display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto;padding-right:4px;"></div>
    <div style="display:flex;gap:6px;margin-top:8px;">
      <button onclick="resetPalette()" style="flex:1;padding:4px 0;border-radius:5px;border:1px solid var(--menu-border);background:transparent;color:#888;font-size:0.75rem;cursor:pointer;">重置</button>
      <button onclick="closePalette()" style="flex:1;padding:4px 0;border-radius:5px;border:1px solid var(--menu-border);background:transparent;color:#888;font-size:0.75rem;cursor:pointer;">关闭</button>
    </div>
  </div>

  <script>
  /* ===== 调色盘系统 ===== */
  var colorConfig = [
    {key:'--accent',label:'主色调',color:'#ffc832'},
    {key:'--bg-page',label:'背景色',color:'#08080e'},
    {key:'--text-body',label:'文字色',color:'#ccc'},
    {key:'--card-bg',label:'卡片底色',color:'rgba(20,20,30,0.6)'},
    {key:'--btn-blue-text',label:'地图按钮',color:'#4a9eff'},
    {key:'--btn-red-text',label:'改枪按钮',color:'#ff6b6b'},
    {key:'--btn-green-text',label:'聊天按钮',color:'#51cf66'},
    {key:'--btn-purple-text',label:'攻略按钮',color:'#cc5de8'}
  ];
  function loadPalette(){
    var saved;
    try{ saved = JSON.parse(localStorage.getItem('abi_palette')); }catch(e){}
    colorConfig.forEach(function(item){
      var val = (saved && saved[item.key]) || item.color;
      document.documentElement.style.setProperty(item.key, val);
    });
    renderPalette();
  }
  function renderPalette(){
    var el = document.getElementById('paletteItems');
    if(!el) return;
    var saved;
    try{ saved = JSON.parse(localStorage.getItem('abi_palette')); }catch(e){}
    el.innerHTML = colorConfig.map(function(item){
      var current = (saved && saved[item.key]) || item.color;
      return '<div style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:5px;">'+
        '<span style="font-size:0.75rem;color:#888;min-width:56px;">'+item.label+'</span>'+
        '<input type="color" value="'+current+'" style="width:28px;height:22px;border:none;border-radius:3px;padding:0;cursor:pointer;background:transparent;" onchange="applyColor(\''+item.key+'\',this.value)" oninput="applyColor(\''+item.key+'\',this.value)">'+
        '<input type="text" value="'+current+'" style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:4px;color:#ddd;font-size:0.7rem;padding:2px 4px;outline:none;" onchange="applyColor(\''+item.key+'\',this.value)" oninput="applyColor(\''+item.key+'\',this.value)">'+
        '</div>';
    }).join('');
  }
  function applyColor(key, val){
    document.documentElement.style.setProperty(key, val);
    var saved;
    try{ saved = JSON.parse(localStorage.getItem('abi_palette')) || {}; }catch(e){ saved = {}; }
    saved[key] = val;
    localStorage.setItem('abi_palette', JSON.stringify(saved));
    renderPalette();
  }
  function resetPalette(){
    localStorage.removeItem('abi_palette');
    colorConfig.forEach(function(item){
      document.documentElement.style.setProperty(item.key, item.color);
    });
    renderPalette();
  }
  function togglePalette(){
    var p = document.getElementById('palettePanel');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
    if(p.style.display === 'block') renderPalette();
  }
  function closePalette(){
    document.getElementById('palettePanel').style.display = 'none';
  }
  document.addEventListener('DOMContentLoaded', loadPalette);
  </script>`;

/* 找最后一个 </div><!-- 战术交互地图导航 --> 的位置，在其后面插入 */
var navEnd = c.lastIndexOf('<!-- 战术交互地图导航 -->');
if(navEnd >= 0){
  // 找到该 div 的闭标签
  var closeDiv = c.indexOf('</div>', navEnd);
  if(closeDiv >= 0){
    // 这是导航 div 的闭标签，再找一个闭标签（外层容器）
    var outerClose = c.indexOf('</div>', closeDiv + 6);
    if(outerClose >= 0){
      c = c.substring(0, outerClose + 6) + paletteHTML + c.substring(outerClose + 6);
    }
  }
}

fs.writeFileSync(path, c, 'utf-8');
console.log('Done — injected theme variables + palette');
