const fs = require('fs');

// ===== ICON URLS =====
var iconUrls={
  "保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%BF%9D%E9%99%A9.png",
  "滴滴保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%BB%B4%E6%BB%B4%E4%BF%9D%E9%99%A9.png",
  "电子保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%94%B5%E5%AD%90%E4%BF%9D%E9%99%A9.png",
  "收银机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%94%B6%E9%93%B6%E6%9C%BA.png",
  "家用机箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AE%B6%E7%94%A8%E6%9C%BA%E7%AE%B1.png",
  "军用主机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%86%9B%E7%94%A8%E4%B8%BB%E6%9C%BA.png",
  "普通物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%BD%AE%E7%89%A9%E7%AE%B1.png",
  "高级物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%BB%91%E7%BD%AE%E7%89%A9%E7%AE%B1.png",
  "子弹箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AD%90%E5%BC%B9%E7%AE%B1.png",
  "手雷箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%89%8B%E9%9B%B7%E7%AE%B1.png",
  "医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E7%BA%A7%E5%8C%BB%E7%96%97.png",
  "高级医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%8C%BB%E7%96%97.png",
  "工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B7%A5%E5%85%B7%E7%AE%B1.png",
  "高级工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E7%AE%B1.png",
  "文件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%96%87%E4%BB%B6%E7%AE%B1.png",
  "大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E8%A1%A3.png",
  "蓝色大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%93%9D%E9%A2%86.png",
  "衣服":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E8%A1%A3%E6%9C%8D.png",
  "抽屉":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%8A%BD%E5%B1%89.png",
  "刮刮乐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%88%AE%E5%88%AE%E4%B9%90.png",
  "运动包":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%BF%90%E5%8A%A8%E5%8C%85.png",
  "旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png",
  "白色旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%99%BD%E6%97%85.png",
  "商务旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png",
  "大型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
  "中型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
  "木质武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%9C%A8%E8%B4%A8%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
  "武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
  "高级武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E6%AD%A6%E5%99%A8%E7%AE%B1.png",
  "配件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%85%8D%E4%BB%B6%E7%AE%B1.png",
};

// ===== BUILD FULL JS (map_core_functions.js 完整提取 + 修复乱码) =====
var code = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 1. 从原始文件中提取所有函数定义（去重）
// 先提取所有以 function 开头的行，以及 layerData/orders 等变量声明
var rawLines = code.split('\n');
var funcDefs = {};
var varDefs = [];
var currentFn = null;
var currentBlock = '';
var depth = 0;

rawLines.forEach(function(line) {
  // 跳过注释行和空行
  var trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
  
  // 检测 function 定义
  if (trimmed.startsWith('function ') || trimmed.startsWith('function(')) {
    // 先保存前一个
    if (currentFn) { funcDefs[currentFn] = currentBlock; }
    var match = trimmed.match(/function\s+(\w+)/);
    if (match) {
      currentFn = match[1];
      currentBlock = line;
    } else {
      currentFn = null;
    }
  } else if (currentFn) {
    currentBlock += '\n' + line;
  } else {
    // 检查是否是 var 声明且包含重要数据
    if (trimmed.startsWith('var ') && (trimmed.indexOf('layerData')>=0 || trimmed.indexOf('pinTypes')>=0 || trimmed.indexOf('orders')>=0 || trimmed.indexOf('cats')>=0)) {
      varDefs.push(line);
    }
  }
});

// 构建最终 JS
var finalLines = [
  // state
  "var scaleM=1,panX=0,panY=0,mode='browse',pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;",
  "var mapNameEng='MAP_ENG',mapNameCN='MAP_CN';",
  "var iconM=" + JSON.stringify(iconUrls) + ";",
  // supabase
  "function supabase(t,m,b,f){var u='https://hanrfbciinkhgcumvous.supabase.co/rest/v1/'+t;var o={method:m||'GET',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok','Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);if(f)u+='?'+f;if(localStorage.getItem('abi_token'))o.headers['Authorization']='Bearer '+localStorage.getItem('abi_token');return fetch(u,o).then(function(r){if(r.status===204)return{id:null};if(r.status>=400)throw new Error(r.status);return r.json();});}",
  "function getIconUrl(n){var u=iconM[n]||'';return u;}",
  "function loginGitHub(){var r=window.location.origin+window.location.pathname;window.location.href='https://github.com/login/oauth/authorize?client_id=Ov23liI8CLAtMEYL2fOc&redirect_uri='+encodeURIComponent(r)+'&scope=read:user';}",
];

// 添加 varDefs（替换乱码中文key为英文）
var rawMapCn = ['全部显示', '物资', '弹药', '医疗', '工具', '文档', '衣物', '家具', '贵重', '容器', '军备', '武器', '配件', '钥匙', '密室', '敌人', 'BOSS', '其他', '选择容器类型', '取消', '未选择', '匿名'];
var mapCnToEn = ['All', 'Supplies', 'Ammo', 'Medical', 'Tools', 'Docs', 'Clothes', 'Furniture', 'Valuable', 'Container', 'Military', 'Weapon', 'Parts', 'Key', 'Secret', 'Enemy', 'BOSS', 'Other', 'Pick Type', 'Cancel', '-', 'Anon'];

// 直接从原始建好的代码拿函数定义（排除编码损坏的注释行）
// 改用：从 rebuild_clean.cjs 已有内容中提取 + 补充缺失的

// 先按顺序列出需要的所有函数（按 map_core_functions.js 中的顺序）
var allFuncs = [
  'getIconUrl', 'supabase', 'loginGitHub', 'zoom', 'zoomTo', 'resetView', 'ut',
  'toggleMode', 'renderMarkers', 'showPinDetail', 'closePinDetail', 
  'savePinNote', 'renderPinImages', 'addPinImages', 'deleteCurrentPin',
  'renderPinComments', 'postPinComment', 'renderMapComments', 'postMapComment',
  'showPicker', 'placePin', 'renderLayers', 'toggleAllLayers', 'toggleLayer',
  'loadCloudPins', 'loadFromLocal', 'jumpToFromUrl'
];

// 从 map_core_functions.js 提取每个函数体（去除中文注释/乱码字符串）
var raw = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

function extractFn(name) {
  var idx = raw.indexOf('function ' + name + '(');
  if (idx < 0) idx = raw.indexOf('function ' + name + ' (');
  if (idx < 0) return null;
  var brace = raw.indexOf('{', idx);
  if (brace < 0) return null;
  var d = 1, i = brace + 1;
  while (d > 0 && i < raw.length) {
    if (raw[i] === '{') d++;
    if (raw[i] === '}') d--;
    i++;
  }
  return raw.substring(idx, i);
}

// 逐个提取
allFuncs.forEach(function(fnName) {
  var body = extractFn(fnName);
  if (body) {
    finalLines.push(body);
  } else {
    console.log('WARN: function ' + fnName + ' not found in map_core_functions.js');
  }
});

// 添加 layerData 和 orders（手写，因为原始文件乱码）
finalLines.push("var layerData={'贵重':['保险箱','滴滴保险','电子保险'],'电子':['收银机','家用机箱','军用主机'],'物资':['普通物资箱','高级物资箱'],'弹药':['子弹箱','手雷箱'],'医疗':['医疗箱','高级医疗箱'],'工具':['工具箱','高级工具箱'],'衣物':['大衣','蓝色大衣','衣服'],'家具':['抽屉','刮刮乐'],'容器':['文件箱','运动包','旅行箱','白色旅行箱','商务旅行箱'],'武器':['大型武器箱','中型武器箱','木质武器箱','武器箱','高级武器箱'],'配件':['配件箱']};");
finalLines.push("var orders=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];");

// 添加 loadCloudPins 和 init IIFE（跳过乱码注释）
// 从原始文件提取 init IIFE
var initIdx = raw.indexOf('(function init');
if (initIdx < 0) initIdx = raw.indexOf('(function(){');
if (initIdx < 0) initIdx = raw.indexOf('(function (');
console.log('init idx:', initIdx);
if (initIdx >= 0) {
  // 找到最外层闭合
  var lastParen = raw.lastIndexOf('})();');
  if (lastParen > initIdx) lastParen += 5;
  else {
    lastParen = raw.lastIndexOf('})()');
    if (lastParen > initIdx) lastParen += 4;
  }
  if (lastParen > initIdx) {
    var initBody = raw.substring(initIdx, lastParen);
    finalLines.push(initBody);
  }
}

var full = finalLines.join('\n');

// 修复乱码字符串（将原文件中的乱码中文替换为正常）
// map_core_functions.js 里的中文已经被 fix_alerts.cjs 替换为 'OK'，所以应该没有乱码了。但 renderLayers 里有
// 手工替换 renderLayers 和其他函数中的已知乱码
full = full.replace(/全部显示/g, 'All');
full = full.replace(/暂无层级数据/g, 'No data');

// 验证括号
var op = (full.match(/\(/g)||[]).length;
var cp = (full.match(/\)/g)||[]).length;
var ob = (full.match(/\{/g)||[]).length;
var cb = (full.match(/\}/g)||[]).length;
console.log('('+op+'='+cp+' '+(op===cp?'OK':'FAIL'));
console.log('{'+ob+'='+cb+' '+(ob===cb?'OK':'FAIL'));

if (op !== cp || ob !== cb) {
  console.log('BRACKET MISMATCH - writing v2 for debug');
}

// 写入 v2
fs.writeFileSync('F:\\暗区突围网站\\map_core_v2.js', full);
console.log('Written ('+full.length+' bytes)');

// 注入地图
var maps = [
  {f:'map-farm', e:'farm', c:'农场'},
  {f:'map-beishan', e:'beishan', c:'北山'},
  {f:'map-valley', e:'valley', c:'山谷'},
  {f:'map-armory', e:'armory', c:'军械库'},
  {f:'map-airport', e:'airport', c:'电视台'},
  {f:'map-tvstation', e:'tvstation', c:'阿贾克斯港口'}
];
maps.forEach(function(m){
  var fp = 'F:\\暗区突围网站\\pages\\'+m.f+'.html';
  var c = fs.readFileSync(fp, 'utf8');
  var inject = full
    .replace(/mapNameEng='MAP_ENG'/g, "mapNameEng='"+m.e+"'")
    .replace(/mapNameCN='MAP_CN'/g, "mapNameCN='"+m.c+"'");
  c = c.replace(/<script>[\s\S]*?<\/script>/, '<script>\n'+inject+'\n</script>');
  fs.writeFileSync(fp, c);
  console.log(m.f+': OK');
});
console.log('ALL DONE');
