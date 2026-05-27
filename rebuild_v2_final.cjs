const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

var imgDir = 'G:\\暗区图片\\暗区容器\\';
var remoteBase = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/';
var files = fs.readdirSync(imgDir);

// 直接用文件原名作为类型名，建立图标映射（文件原名=类型名）
var iconMap = {};
files.forEach(function(f) {
  var base = f.replace(/\.png$/i, '');
  iconMap[base] = remoteBase + encodeURIComponent(f);
});
// 补充标准类型名（如果文件名不完全匹配）
var stdAliases = {
  '中级医疗':'中级医疗箱','高级医疗':'高级医疗箱',
  '保险':'保险箱','收银机':'收银机','滴滴保险':'滴滴保险箱','电子保险':'电子保险箱',
  '置物箱':'置物箱','黑置物箱':'黑置物箱',
  '白旅':'白色旅行箱','蓝领':'蓝色大衣','小衣服':'衣服',
  '商务旅行箱':'商务旅行箱','家用机箱':'家用机箱','军用主机':'军用主机','刮刮乐':'刮刮乐',
  '武器箱':'武器箱','木质武器箱':'木质武器箱','高级武器箱':'高级武器箱','大型武器箱':'大型武器箱',
  '高级工具箱':'高级工具箱','配件箱':'配件箱',
  '文件箱':'文件箱','小医疗':'小医疗箱'
};

// 对每个文件，按文件名（去掉扩展名）作为容器类型
// 构建 pinTypes（23个标准类型映射到文件图标）
var pinTypes = [
  {n:'普通物资箱',c:'物资',f:'置物箱'},{n:'高级物资箱',c:'物资',f:'黑置物箱'},
  {n:'子弹箱',c:'弹药',f:'子弹箱'},{n:'手雷箱',c:'弹药',f:'手雷箱'},
  {n:'医疗箱',c:'医疗',f:'中级医疗'},{n:'高级医疗箱',c:'医疗',f:'高级医疗'},
  {n:'工具箱',c:'工具',f:'工具箱'},{n:'高级工具箱',c:'工具',f:'高级工具箱'},
  {n:'文件柜',c:'文档',f:'文件箱'},{n:'文件箱',c:'文档',f:'文件箱'},{n:'家用机箱',c:'文档',f:'家用机箱'},
  {n:'大衣',c:'衣物',f:'大衣'},{n:'蓝色大衣',c:'衣物',f:'蓝领'},{n:'衣服',c:'衣物',f:'小衣服'},
  {n:'抽屉',c:'家具',f:'抽屉'},
  {n:'保险箱',c:'贵重',f:'保险'},{n:'收银机',c:'贵重',f:'收银机'},{n:'滴滴保险',c:'贵重',f:'滴滴保险'},{n:'电子保险',c:'贵重',f:'电子保险'},{n:'保险箱',c:'贵重',f:'保险'},
  {n:'旅行箱',c:'容器',f:'商务旅行箱'},{n:'白色旅行箱',c:'容器',f:'白旅'},{n:'运动包',c:'容器',f:'运动包'},{n:'商务旅行箱',c:'容器',f:'商务旅行箱'},
  {n:'专业军备箱',c:'军备',f:'军用主机'},{n:'军用主机',c:'军备',f:'军用主机'},
  {n:'大型武器箱',c:'武器',f:'大型武器箱'},{n:'中型武器箱',c:'武器',f:'中型武器箱'},{n:'木质武器箱',c:'武器',f:'木质武器箱'},{n:'武器箱',c:'武器',f:'武器箱'},{n:'高级武器箱',c:'武器',f:'高级武器箱'},
  {n:'战术配件箱',c:'配件',f:'配件箱'},{n:'配件箱',c:'配件',f:'配件箱'},
  {n:'通用钥匙',c:'钥匙',f:'刮刮乐'},{n:'刮刮乐',c:'钥匙',f:'刮刮乐'},
  {n:'密码门',c:'密室',f:'军用主机'},{n:'密室',c:'密室',f:'军用主机'},
  {n:'普通敌人',c:'敌人',f:''},{n:'精英敌人',c:'敌人',f:''},{n:'游荡者',c:'敌人',f:''},
  {n:'首领',c:'BOSS',f:''},{n:'其他',c:'其他',f:'置物箱'}
];

// 构建 iconM：从 pinTypes 提取唯一的 n→f 映射
var iconM = {};
pinTypes.forEach(function(p) {
  if (p.f && iconMap[p.f]) iconM[p.n] = iconMap[p.f];
  else if (!iconM[p.n]) iconM[p.n] = '';
});
// 再补充所有文件直接作为类型
files.forEach(function(f) {
  var base = f.replace(/\.png$/i, '');
  if (!iconM[base]) iconM[base] = iconMap[base];
});

var iconMapStr = 'var iconM={' + Object.entries(iconM).map(function(e){return "'"+e[0]+"':'"+e[1]+"'";}).join(',') + '};';

// 构建 layerData：唯一分类
var layerData = {};
pinTypes.forEach(function(p) {
  if (!layerData[p.c]) layerData[p.c] = [];
  if (layerData[p.c].indexOf(p.n) < 0) layerData[p.c].push(p.n);
});
var layerDataStr = 'var layerData={' + Object.entries(layerData).map(function(e){
  return e[0]+':[' + e[1].map(function(n){return "'"+n+"'";}).join(',') + ']';
}).join(',') + '};';

console.log('iconM:', Object.keys(iconM).length, 'entries');
console.log('layerData:', Object.keys(layerData).length, 'categories');
console.log('pinTypes:', pinTypes.length, 'types');

// Build v2 block
var v2block = '\n// === v2 ===\nvar scaleM=1,panX=0,panY=0,mode="browse",pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;\nvar mapNameEng="MAP_ENG",mapNameCN="MAP_CN",cloudPins=[],cloudComments=[];\n' + iconMapStr + '\nvar pinTypes=[' + pinTypes.map(function(p){return '{n:"'+p.n+'",c:"'+p.c+'"}';}).join(',') + '];\n' + layerDataStr + '\n';

v2block += 'function zoom(f,cx,cy){if(cx===void 0||cy===void 0){scaleM*=f;if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();return;}var prev=scaleM;scaleM*=f;if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;var wrap=document.querySelector(".map-wrap");if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/prev,imgY=(my-panY)/prev;panX=mx-imgX*scaleM;panY=my-imgY*scaleM;ut();}\n';
v2block += 'function zoomTo(v,cx,cy){v=v/100;if(v<0.2)v=0.2;if(v>8)v=8;if(cx!==void 0&&cy!==void 0){var wrap=document.querySelector(".map-wrap");if(!wrap)return;var wr=wrap.getBoundingClientRect();var mx=cx-wr.left,my=cy-wr.top;var imgX=(mx-panX)/scaleM,imgY=(my-panY)/scaleM;panX=mx-imgX*v;panY=my-imgY*v;}scaleM=v;ut();}\n';
v2block += 'function resetView(){scaleM=1;panX=0;panY=0;var e=document.getElementById("mv");if(e)e.style.transform="translate(0px,0px) scale(1)";var zr=document.getElementById("zr");if(zr)zr.value=100;var zl=document.getElementById("zl");if(zl)zl.textContent="100%";}\n';
v2block += 'function ut(){var el=document.getElementById("mv");if(!el)return;el.style.transform="translate("+panX+"px,"+panY+"px) scale("+scaleM+")";var zr=document.getElementById("zr");if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById("zl");if(zl)zl.textContent=Math.round(scaleM*100)+"%";}\n';

v2block += '(function(){var _d=false,_sx,_sy,_spx,_spy;document.addEventListener("mousedown",function(e){var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target)||e.target.tagName==="BUTTON"||e.target.tagName==="INPUT")return;_d=true;_sx=e.clientX;_sy=e.clientY;_spx=panX;_spy=panY;if(e.target===mv||e.target===document.getElementById("mapImg"))e.preventDefault();});document.addEventListener("mousemove",function(e){if(_d){panX=_spx+e.clientX-_sx;panY=_spy+e.clientY-_sy;ut();}});document.addEventListener("mouseup",function(){_d=false;});})();\n';
v2block += 'document.addEventListener("wheel",function(e){var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target))return;e.preventDefault();zoom(e.deltaY<0?1.1:0.9,e.clientX,e.clientY);},{passive:false});\n';
v2block += '["touchstart","touchmove","touchend"].forEach(function(ev){document.addEventListener(ev,function(e){var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target))return;if(ev==="touchstart"&&e.touches.length===1){_d=true;_sx=e.touches[0].clientX;_sy=e.touches[0].clientY;_spx=panX;_spy=panY;}else if(ev==="touchmove"&&e.touches.length===1&&_d){panX=_spx+e.touches[0].clientX-_sx;panY=_spy+e.touches[0].clientY-_sy;ut();}else if(ev==="touchstart"&&e.touches.length===2){touchStartDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);touchStartScale=scaleM;}else if(ev==="touchmove"&&e.touches.length===2){scaleM=touchStartScale*(Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY)/touchStartDist);if(scaleM<0.2)scaleM=0.2;if(scaleM>8)scaleM=8;ut();}else if(ev==="touchend"){_d=false;}});});\n';

v2block += 'function toggleMode(){mode=(mode==="browse")?"place":"browse";var btn=document.getElementById("mdBtn");if(btn)btn.textContent=(mode==="place")?"\\uD83D\\uDCCD \\u653E\\u7F6E":"\\uD83D\\uDC41\\uFE0F \\u6D4F\\u89C8";var ch=document.getElementById("ch");if(ch)ch.classList.toggle("show",mode==="place");document.getElementById("cv").textContent="\\u672A\\u9009\\u62E9";document.getElementById("ab").style.display="none";}\n';

v2block += 'document.addEventListener("click",function(e){if(mode!=="place")return;var mv=document.getElementById("mv");if(!mv||!mv.contains(e.target)||e.target===document.getElementById("mdBtn"))return;var wrap=document.querySelector(".map-wrap");if(!wrap)return;var wr=wrap.getBoundingClientRect();var x=((e.clientX-wr.left)/wr.width*100).toFixed(2);var y=((e.clientY-wr.top)/wr.height*100).toFixed(2);document.getElementById("cv").textContent=x+"%, "+y+"%";document.getElementById("ab").style.display="inline-block";document.getElementById("ch").classList.remove("show");});\n';

v2block += 'function loadCloudPins(){var a=[];a.push(supabase("pins","GET",null,"map_name=eq."+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudPins=d;cloudPins.forEach(function(p){delete p.created_at;});}}));a.push(supabase("map_comments","GET",null,"map_name=eq."+encodeURIComponent(mapNameCN)).then(function(d){if(d&&d.length){cloudComments=d;cloudComments.forEach(function(c){delete c.id;delete c.created_at;});}}));Promise.all(a).then(function(){pins=cloudPins.slice();mapComments=cloudComments.slice();localStorage.setItem("abi_"+mapNameEng+"_pins",JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();renderMapComments();jumpToFromUrl();}).catch(function(){try{var d=JSON.parse(localStorage.getItem("abi_"+mapNameEng+"_pins"));if(d){if(d.pins)pins=d.pins;if(d.mapComments)mapComments=d.mapComments;renderMarkers();renderMapComments();jumpToFromUrl();}}catch(e){}});}\n';

v2block += "function renderMarkers(){var mv=document.getElementById('mv');if(!mv)return;mv.querySelectorAll('.pin-marker').forEach(function(el){el.remove();});pins.forEach(function(p,i){var el=document.createElement('div');el.className='pin-marker';el.style.cssText='position:absolute;left:'+p.x+'%;top:'+p.y+'%;transform:translate(-50%,-50%);cursor:pointer;z-index:100;';var ic=p.ic||'';if(ic)el.innerHTML='<img src=\"'+ic+'\" style=\"width:32px;height:32px;border-radius:6px;object-fit:cover;border:2px solid rgba(255,200,50,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.5)\" onerror=\"this.style.display=\"none\"\"><div style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"></div>';else el.innerHTML='<div style=\"width:12px;height:12px;border-radius:50%;background:#ffc832;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5)\"></div>';el.onclick=function(e){e.stopPropagation();showPinDetail(i);};mv.appendChild(el);});}\n";

// showPicker with icons for each button
v2block += 'function showPicker(){var op=document.getElementById("pinTypeMenu");if(op){op.remove();return;}var menu=document.createElement("div");menu.id="pinTypeMenu";menu.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.97);border:1px solid #1e1e2a;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;z-index:99999;min-width:380px;box-shadow:0 8px 40px rgba(0,0,0,.7)";var ti=document.createElement("div");ti.style.cssText="color:#ffc832;font-size:18px;font-weight:600;margin-bottom:12px;border-bottom:1px solid rgba(255,200,50,.15);padding-bottom:8px";ti.textContent="选择容器类型";menu.appendChild(ti);var cats={};pinTypes.forEach(function(t){if(!cats[t.c])cats[t.c]=[];cats[t.c].push(t);});var order=["物资","弹药","医疗","工具","文档","衣物","家具","贵重","容器","军备","武器","配件","钥匙","密室","敌人","BOSS","其他"];order.forEach(function(cat){if(!cats[cat])return;var s=document.createElement("div");s.style.cssText="margin-bottom:10px";var h=document.createElement("div");h.style.cssText="color:#888;font-size:12px;margin-bottom:4px;padding:0 4px";h.textContent=cat;s.appendChild(h);var g=document.createElement("div");g.style.cssText="display:grid;grid-template-columns:repeat(4,1fr);gap:6px";cats[cat].forEach(function(t){var b=document.createElement("button");b.style.cssText="padding:6px 4px;background:rgba(255,200,50,.08);border:1px solid rgba(255,200,50,.12);border-radius:8px;color:#ddd;cursor:pointer;font-size:11px;display:flex;flex-direction:column;align-items:center;gap:4px";var img=document.createElement("img");img.src=iconM[t.n]||"";img.style.cssText="width:32px;height:32px;border-radius:4px;object-fit:cover";img.onerror=function(){this.style.display="none";};b.appendChild(img);var span=document.createElement("span");span.textContent=t.n;b.appendChild(span);b.onmouseenter=function(){this.style.background="rgba(255,200,50,.2)";};b.onmouseleave=function(){this.style.background="rgba(255,200,50,.08)";};b.onclick=function(){placePin(t);menu.remove();};g.appendChild(b);});s.appendChild(g);menu.appendChild(s);});var cb=document.createElement("button");cb.textContent="取消";cb.style.cssText="margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%";cb.onclick=function(){menu.remove();};menu.appendChild(cb);document.body.appendChild(menu);}\n';

v2block += 'function placePin(tp){if(!localStorage.getItem("abi_token")){loginGitHub();return;}var cv=document.getElementById("cv");if(!cv||cv.textContent==="未选择"){alert("请先在地图上点击选择位置");return;}var parts=cv.textContent.split(",");var x=parseFloat(parts[0]);var y=parseFloat(parts[1]);if(isNaN(x)||isNaN(y)){alert("位置无效");return;}var ic=iconM[tp.n]||"";var pin={name:tp.n,type:tp.n,x:x,y:y,ic:ic,note:"",images:[],comments:[],map_name:mapNameCN};supabase("pins","POST",pin).then(function(data){if(data&&data.id)pin.id=data.id;pins.push(pin);localStorage.setItem("abi_"+mapNameEng+"_pins",JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();cv.textContent="未选择";document.getElementById("ab").style.display="none";alert("投稿成功！");}).catch(function(){pins.push(pin);localStorage.setItem("abi_"+mapNameEng+"_pins",JSON.stringify({pins:pins,mapComments:mapComments}));renderMarkers();cv.textContent="未选择";document.getElementById("ab").style.display="none";alert("本地保存成功");});}\n';

// renderLayers with actual icons
v2block += 'function renderLayers(){var lp=document.getElementById("lp");if(!lp)return;var keys=Object.keys(layerData);if(keys.length===0){lp.innerHTML="<div style=\\"color:#888;padding:20px;text-align:center;font-size:14px\\">暂无层级数据</div>";return;}var html="<label class=\\"all-label\\"><input type=\\"checkbox\\" checked onchange=\\"toggleAllLayers(this.checked)\\""> 全部显示</label>";keys.forEach(function(k){html+="<div class=\\"ly-card\\"><div class=\\"ly-card-hdr\\"><input type=\\"checkbox\\" checked onchange=\\"toggleLayer(\\""+k+"\\",this.checked)\\"> "+k+"</div>"+(layerData[k]||[]).map(function(item){var ic=iconM[item]||"";if(ic)return "<label><input type=\\"checkbox\\" checked data-layer=\\""+k+"\\"><img src=\\""+ic+"\\" style=\\"width:20px;height:20px;border-radius:3px;object-fit:cover;vertical-align:middle;margin-right:4px;display:inline\\" onerror=\\"this.style.display=\\'none\\'\\">"+item+"</label>"; else return "<label><input type=\\"checkbox\\" checked data-layer=\\""+k+"\\">\\uD83D\\uDCCD "+item+"</label>";}).join("")+"</div>";});lp.innerHTML=html;}\n';
v2block += 'function toggleAllLayers(c){var lp=document.getElementById("lp");if(lp)lp.querySelectorAll("input[type=checkbox]").forEach(function(cb){cb.checked=c;});}\nfunction toggleLayer(n,c){var lp=document.getElementById("lp");if(lp)lp.querySelectorAll("input[data-layer=\\""+n+"\\"]").forEach(function(cb){cb.checked=c;});}\n';

v2block += 'function jumpToFromUrl(){var s=new URLSearchParams(window.location.search);var x=s.get("x"),y=s.get("y"),name=s.get("name"),type=s.get("type"),ic=s.get("ic");if(!x||!y)return;var xf=parseFloat(x),yf=parseFloat(y);scaleM=8;var wrap=document.querySelector(".map-wrap");if(!wrap)return;panX=(wrap.clientWidth/2)-xf/100*document.getElementById("mapImg").clientWidth*scaleM;panY=(wrap.clientHeight/2)-yf/100*document.getElementById("mapImg").clientHeight*scaleM;ut();document.getElementById("zr").value=800;document.getElementById("zl").textContent="800%";var mv=document.getElementById("mv");if(!mv)return;var el=document.createElement("div");el.style.cssText="position:absolute;left:"+xf+"%;top:"+yf+"%;transform:translate(-50%,-50%);width:"+(24/scaleM)+"px;height:"+(24/scaleM)+"px;z-index:999;pointer-events:none;background:#ff4444;border:"+(3/scaleM)+"px solid #fff;border-radius:50%;box-shadow:0 0 "+(12/scaleM)+"px rgba(255,0,0,.6)";mv.appendChild(el);for(var i=0;i<pins.length;i++){if(Math.abs(pins[i].x-xf)+Math.abs(pins[i].y-yf)<3){showPinDetail(i);return;}}document.getElementById("cv").textContent=x+"%, "+y+"%";document.getElementById("ab").style.display="inline-block";}\n';

v2block += '(function init(){document.getElementById("mdBtn").addEventListener("click",toggleMode);var b=document.getElementById("lbb");var lp=document.getElementById("lp");if(b&&lp){b.onclick=function(e){e.stopPropagation();lp.classList.toggle("show");if(lp.classList.contains("show"))renderLayers();};document.addEventListener("click",function(e){if(lp&&!lp.contains(e.target)&&e.target!==b)lp.classList.remove("show");});}setTimeout(loadCloudPins,300);})();\n';

console.log('v2block length:', v2block.length);

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var final = v2block
    .replace(/mapNameEng="MAP_ENG"/g, 'mapNameEng="' + mapEng[i] + '"')
    .replace(/mapNameCN="MAP_CN"/g, 'mapNameCN="' + mapNames[i] + '"');
  c = c.replace(/<script>([\s\S]*?)<\/script>/, '<script>' + final + '</script>');
  fs.writeFileSync(fp, c);
  var c2 = fs.readFileSync(fp, 'utf8');
  var m = c2.match(/<script>([\s\S]*?)<\/script>/);
  try { new Function(m[1]); console.log(name + ': VALID'); }
  catch(e) { console.log(name + ': ERROR - ' + e.message.substring(0,60)); }
});
console.log('Done');
