var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 找到最后一个 <script>（调色盘的）
var lastScript = c.lastIndexOf('<script>');
var before = c.substring(0, lastScript);
var scriptContent = c.substring(lastScript);
var endScript = scriptContent.indexOf('</script>') + 9;
var after = c.substring(lastScript + endScript);

// 重写调色盘的完整 JS
var fixedScript = `<script>
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
function getHexColor(key){
  var saved; try{ saved = JSON.parse(localStorage.getItem('abi_palette')); }catch(e){}
  var val = (saved && saved[key]) || colorConfig.find(function(x){return x.key===key;}).color;
  // rgba not valid for color input, default to hex
  if(val.indexOf('rgba')===0) return '#ffc832';
  return val;
}
function getActualColor(key){
  var saved; try{ saved = JSON.parse(localStorage.getItem('abi_palette')); }catch(e){}
  var item = colorConfig.find(function(x){return x.key===key;});
  return (saved && saved[key]) || item.color;
}
function loadPalette(){
  var saved; try{ saved = JSON.parse(localStorage.getItem('abi_palette')); }catch(e){}
  colorConfig.forEach(function(item){
    var val = (saved && saved[item.key]) || item.color;
    document.documentElement.style.setProperty(item.key, val);
  });
  renderPalette();
}
function renderPalette(){
  var el = document.getElementById('paletteItems');
  if(!el) return;
  el.innerHTML = colorConfig.map(function(item){
    var cur = getActualColor(item.key);
    var hex = getHexColor(item.key);
    return '<div style="display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:5px;">'+
      '<span style="font-size:0.75rem;color:#888;min-width:56px;">'+item.label+'</span>'+
      '<input type="color" value="'+hex+'" style="width:28px;height:22px;border:none;border-radius:3px;padding:0;cursor:pointer;background:transparent;" onchange="applyColor(\''+item.key+'\',this.value)" oninput="applyColor(\''+item.key+'\',this.value)">'+
      '<input type="text" value="'+cur+'" style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:4px;color:#ddd;font-size:0.7rem;padding:2px 4px;outline:none;" onchange="applyColor(\''+item.key+'\',this.value)" oninput="applyColor(\''+item.key+'\',this.value)">'+
      '</div>';
  }).join('');
}
function applyColor(key,val){
  document.documentElement.style.setProperty(key, val);
  var saved; try{ saved = JSON.parse(localStorage.getItem('abi_palette')) || {}; }catch(e){ saved = {}; }
  saved[key] = val;
  localStorage.setItem('abi_palette', JSON.stringify(saved));
  renderPalette();
}
function resetPalette(){
  localStorage.removeItem('abi_palette');
  colorConfig.forEach(function(item){ document.documentElement.style.setProperty(item.key, item.color); });
  renderPalette();
}
function togglePalette(){
  var p = document.getElementById('palettePanel');
  if(!p) return;
  p.style.display = p.style.display==='none'?'block':'none';
  if(p.style.display==='block') renderPalette();
}
function closePalette(){ var p=document.getElementById('palettePanel'); if(p)p.style.display='none'; }
document.addEventListener('DOMContentLoaded', loadPalette);
</script>`;

c = before + fixedScript + after;
fs.writeFileSync('F:/暗区突围网站/index.html', c, 'utf-8');
console.log('Fixed palette script');
