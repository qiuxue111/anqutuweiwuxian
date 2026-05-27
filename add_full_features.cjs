const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];

var extraCode = `

// ===== 容器类型选择器 =====
var pinTypes = [
  {name:'普通物资箱',ic:'📦',category:'物资'},
  {name:'高级物资箱',ic:'📦✨',category:'物资'},
  {name:'子弹箱',ic:'🔫',category:'弹药'},
  {name:'医疗箱',ic:'🏥',category:'医疗'},
  {name:'工具箱',ic:'🔧',category:'工具'},
  {name:'文件柜',ic:'📋',category:'文档'},
  {name:'大衣',ic:'🧥',category:'衣物'},
  {name:'抽屉',ic:'🗄️',category:'家具'},
  {name:'保险箱',ic:'🔒',category:'贵重'},
  {name:'旅行箱',ic:'🧳',category:'容器'},
  {name:'运动包',ic:'🎒',category:'容器'},
  {name:'专业军备箱',ic:'⚔️',category:'军备'},
  {name:'大型武器箱',ic:'🔫',category:'武器'},
  {name:'手雷箱',ic:'💣',category:'弹药'},
  {name:'战术配件箱',ic:'🔩',category:'配件'},
  {name:'通用钥匙',ic:'🔑',category:'钥匙'},
  {name:'密码门',ic:'🚪',category:'密室'},
  {name:'密室',ic:'🏠',category:'密室'},
  {name:'普通敌人',ic:'👤',category:'敌人'},
  {name:'精英敌人',ic:'👑',category:'敌人'},
  {name:'游荡者',ic:'🏃',category:'敌人'},
  {name:'首领',ic:'💀',category:'BOSS'},
  {name:'其他',ic:'❓',category:'其他'}
];

var pp=null; // pending pin placement

function showPicker(){
  var op=document.getElementById('pinTypeMenu');
  if(op){op.remove();return;}
  var menu=document.createElement('div');
  menu.id='pinTypeMenu';
  menu.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(18,18,26,.97);border:1px solid #1e1e2a;border-radius:16px;padding:20px;max-height:80vh;overflow-y:auto;z-index:99999;min-width:320px;box-shadow:0 8px 40px rgba(0,0,0,.7)';
  var title=document.createElement('div');
  title.style.cssText='color:#ffc832;font-size:18px;font-weight:600;margin-bottom:12px;border-bottom:1px solid rgba(255,200,50,.15);padding-bottom:8px';
  title.textContent='选择容器类型';
  menu.appendChild(title);
  var cats={};
  pinTypes.forEach(function(t){if(!cats[t.category])cats[t.category]=[];cats[t.category].push(t);});
  var catOrder=['物资','弹药','医疗','工具','文档','衣物','家具','贵重','容器','军备','武器','配件','钥匙','密室','敌人','BOSS','其他'];
  catOrder.forEach(function(cat){
    if(!cats[cat])return;
    var sec=document.createElement('div');
    sec.style.cssText='margin-bottom:10px';
    var h=document.createElement('div');
    h.style.cssText='color:#888;font-size:12px;margin-bottom:4px;padding:0 4px';
    h.textContent=cat;
    sec.appendChild(h);
    var grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px';
    cats[cat].forEach(function(t){
      var btn=document.createElement('button');
      btn.style.cssText='padding:8px 4px;background:rgba(255,200,50,.08);border:1px solid rgba(255,200,50,.12);border-radius:8px;color:#ddd;cursor:pointer;font-size:13px;transition:all 0.15s';
      btn.innerHTML=t.ic+' '+t.name;
      btn.onmouseenter=function(){this.style.background='rgba(255,200,50,.2)';};
      btn.onmouseleave=function(){this.style.background='rgba(255,200,50,.08)';};
      btn.onclick=function(){placePin(t);menu.remove();};
      grid.appendChild(btn);
    });
    sec.appendChild(grid);
    menu.appendChild(sec);
  });
  var closeBtn=document.createElement('button');
  closeBtn.textContent='取消';
  closeBtn.style.cssText='margin-top:12px;padding:8px 16px;background:rgba(255,255,255,.05);border:1px solid #333;border-radius:8px;color:#888;cursor:pointer;font-size:14px;width:100%';
  closeBtn.onclick=function(){menu.remove();};
  menu.appendChild(closeBtn);
  document.body.appendChild(menu);
}

function chooseContainer(){
  document.getElementById('ab').click();
}

function placePin(type){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  var cv=document.getElementById('cv');
  if(!cv||cv.textContent==='未选择'){alert('请先在地图上点击选择位置');return;}
  var parts=cv.textContent.split(',');
  var x=parseFloat(parts[0]),y=parseFloat(parts[1]);
  if(isNaN(x)||isNaN(y)){alert('位置无效，请重新选择');return;}
  var pin={name:type.name,type:type.name,x:x,y:y,ic:'',note:'',images:[],comments:[],map_name:mapNameCN};
  // Map type to icon URL
  var iconMap={
    '普通物资箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/container.png',
    '高级物资箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/rare.png',
    '工具箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/toolbox.png',
    '文件柜':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/cabinet.png',
    '大衣':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/coat.png',
    '保险箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/safe.png',
    '运动包':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/bag.png',
    '旅行箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/suitcase.png',
    '手雷箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/grenade.png',
    '子弹箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/ammo.png',
    '医疗箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/medkit.png',
    '大型武器箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/weaponcase.png',
    '高级武器箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/weaponcase.png',
    '专业军备箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/equipment.png',
    '战术配件箱':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/accessory.png',
    '抽屉':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/drawer.png',
    '通用钥匙':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/key.png',
    '密码门':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/door.png',
    '密室':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/secretroom.png',
    '普通敌人':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/enemy.png',
    '精英敌人':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/elite.png',
    '游荡者':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/roamer.png',
    '首领':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/boss.png',
    '其他':'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/icons/other.png'
  };
  pin.ic=iconMap[type.name]||'';
  var uname=localStorage.getItem('abi_user')||'匿名';
  // Save to cloud
  supabase('pins','POST',pin).then(function(data){
    if(data&&data.id)pin.id=data.id;
    pins.push(pin);
    savePins();
    renderMarkers();
    document.getElementById('cv').textContent='\\u672A\\u9009\\u62E9';
    document.getElementById('ab').style.display='none';
    alert('\\u6295\\u7A3F\\u6210\\u529F\\uFF01');
  }).catch(function(err){
    // Fallback: save locally
    pins.push(pin);
    savePins();
    renderMarkers();
    document.getElementById('cv').textContent='\\u672A\\u9009\\u62E9';
    document.getElementById('ab').style.display='none';
    alert('\\u672C\\u5730\\u4FDD\\u5B58\\u6210\\u529F\\uFF08\\u4E91\\u7AEF\\u63D0\\u4EA4\\u5931\\u8D25\\uFF0C\\u7A0D\\u540E\\u91CD\\u8BD5\\uFF09');
  });
}

// ===== 图层选择 =====
var layerData = {};

function renderLayers(){
  var lp=document.getElementById('lp');
  if(!lp)return;
  var keys=Object.keys(layerData);
  if(keys.length===0){
    lp.innerHTML='<div style="color:#888;padding:20px;text-align:center;font-size:14px">\\u6682\\u65E0\\u5C42\\u7EA7\\u6570\\u636E</div>';
    return;
  }
  var html='<label class="all-label"><input type="checkbox" checked onchange="toggleAllLayers(this.checked)"> \\u5168\\u90E8\\u663E\\u793A</label>';
  keys.forEach(function(k){
    html+='<div class="ly-card"><div class="ly-card-hdr"><input type="checkbox" checked onchange="toggleLayer(\\''+k.replace(/'/g,"\\\\'")+'\\',this.checked)"> '+k+'</div>';
    (layerData[k]||[]).forEach(function(item){
      html+='<label><input type="checkbox" checked data-layer="'+k+'" data-name="'+item.replace(/"/g,'&quot;')+'" onchange="filterPins()"> <span class="ly-icon e">\\uD83D\\uDCCD</span> '+item+'</label>';
    });
    html+='</div>';
  });
  lp.innerHTML=html;
}

function toggleAllLayers(checked){
  lp.querySelectorAll('input[type=checkbox]').forEach(function(cb){cb.checked=checked;});
  filterPins();
}

function toggleLayer(name,checked){
  lp.querySelectorAll('input[data-layer="'+name.replace(/'/g,"\\\\'")+'"]').forEach(function(cb){cb.checked=checked;});
  filterPins();
}

function filterPins(){
  var mv=document.getElementById('mv');
  if(!mv)return;
  var markers=mv.querySelectorAll('.pin-marker');
  markers.forEach(function(el){el.style.display='';});
  // Simple: show all if no layers defined
}

// Init layer button
document.addEventListener('DOMContentLoaded',function(){
  var lbb=document.getElementById('lbb');
  var lp=document.getElementById('lp');
  if(lbb&&lp){
    lbb.onclick=function(e){e.stopPropagation();lp.classList.toggle('show');renderLayers();};
    document.addEventListener('click',function(e){if(!lp.contains(e.target)&&e.target!==lbb)lp.classList.remove('show');});
  }
});

// ===== 删除申请 =====
function deleteCurrentPin(){
  if(!localStorage.getItem('abi_token')){loginGitHub();return;}
  if(curPinIdx===null)return;
  var p=pins[curPinIdx];
  if(!confirm('确认提交删除申请？其他人可以对此投票，审核通过后此点位才会被移除。'))return;
  var uname=localStorage.getItem('abi_user')||'匿名';
  if(p.id){
    supabase('deletion_requests','POST',{pin_id:p.id,name:p.name,x:p.x,y:p.y,submitted_by:uname,reason:'用户提交',votes:0,voters:[]}).then(function(){
      alert('删除申请已提交，等待审核投票。');
    }).catch(function(){
      // Fallback: just remove from local
      pins.splice(curPinIdx,1);curPinIdx=null;
      savePins();renderMarkers();closePinDetail();
      alert('已从本地删除（云端同步失败，稍后重试）');
    });
  }else{
    pins.splice(curPinIdx,1);curPinIdx=null;
    savePins();renderMarkers();closePinDetail();
  }
}

// ===== 初始化 =====
function updateAuthUI(){
  var token=localStorage.getItem('abi_token');
  var un=document.getElementById('userName');
  var lb=document.getElementById('loginBtn');
  var dot=document.getElementById('loginDot');
  if(token){
    if(dot)dot.style.display='inline-block';
    if(un){un.style.display='inline';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
}

window.onload=function(){
  console.log('ONLOAD');
  loadCloudPins();
  updateAuthUI();
};
`;

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Delete old onload and duplicate code
  // Find the window.onload block added by inject_map_core.cjs
  var oldOnloadStart = c.lastIndexOf("window.onload=function(){");
  if (oldOnloadStart >= 0) {
    var oldOnloadEnd = c.indexOf("};", c.lastIndexOf("loadCloudPins()"));
    if (oldOnloadEnd < 0) oldOnloadEnd = c.indexOf('};', oldOnloadStart) + 2;
    else oldOnloadEnd += 2;
    if (oldOnloadEnd > oldOnloadStart) {
      c = c.substring(0, oldOnloadStart) + c.substring(oldOnloadEnd);
    }
  }
  
  // Remove duplicate deleteCurrentPin (the one with currentUser reference)
  var oldDeleteStart = c.indexOf("function deleteCurrentPin(){");
  if (oldDeleteStart >= 0) {
    // Find the function end - looks for the next function definition or end
    var searchEnd = c.indexOf("function ", oldDeleteStart + 10);
    if (searchEnd < 0) searchEnd = c.lastIndexOf("// ===== URL");
    if (searchEnd < 0) searchEnd = c.lastIndexOf("// ----");
    if (searchEnd < 0) searchEnd = c.lastIndexOf("function jumpToFromUrl");
    if (searchEnd > oldDeleteStart) {
      c = c.substring(0, oldDeleteStart) + c.substring(searchEnd);
    }
  }

  // Remove the ab button click handler
  c = c.replace(/document\.getElementById\('ab'\)\.click\(\);/, 'chooseContainer();');

  // Find closeScript and insert extra code before it
  var closeScript = c.lastIndexOf('</script>');
  if (closeScript >= 0) {
    // Remove duplicate old onload if any
    var extra = extraCode
      .replace(/MAP_ENG/g, name.replace('map-',''))
      .replace(/MAP_CN/g, mapNames[i]);
    
    c = c.substring(0, closeScript) + '\n// ===== Extra Features =====\n' + extra + '\n' + c.substring(closeScript);
  }
  
  // Fix ab button onclick
  c = c.replace('id="ab"', 'id="ab" onclick="showPicker()"');
  
  // Remove duplicate function definitions from previous inject
  // Remove duplicate loadCloudPins/savePins if any
  var lines = c.split('\n');
  var unique = [];
  var seen = {};
  lines.forEach(function(line) {
    var key = line.trim();
    if (key.indexOf('function ') === 0 && key.indexOf('function ') < 5) {
      if (seen[key]) return;
      seen[key] = true;
    }
    unique.push(line);
  });
  c = unique.join('\n');
  
  fs.writeFileSync(fp, c);
  console.log(name + ': features added');
});

console.log('All done');
