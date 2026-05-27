var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
var mapEngs={'map-farm':'farm','map-beishan':'beishan','map-valley':'valley','map-armory':'armory','map-airport':'airport','map-tvstation':'tvstation'};
var mapCNs={'map-farm':'农场','map-beishan':'北山','map-valley':'河谷','map-armory':'军港','map-airport':'电视台','map-tvstation':'电视台'};

// 地图依赖数据
var iconUrls={"保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%BF%9D%E9%99%A9.png","滴滴保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%BB%B4%E6%BB%B4%E4%BF%9D%E9%99%A9.png","电子保险":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%94%B5%E5%AD%90%E4%BF%9D%E9%99%A9.png","收银机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%94%B6%E9%93%B6%E6%9C%BA.png","家用机箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AE%B6%E7%94%A8%E6%9C%BA%E7%AE%B1.png","军用主机":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%86%9B%E7%94%A8%E4%B8%BB%E6%9C%BA.png","普通物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%BD%AE%E7%89%A9%E7%AE%B1.png","高级物资箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%BB%91%E7%BD%AE%E7%89%A9%E7%AE%B1.png","子弹箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%AD%90%E5%BC%B9%E7%AE%B1.png","手雷箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%89%8B%E9%9B%B7%E7%AE%B1.png","医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E7%BA%A7%E5%8C%BB%E7%96%97.png","高级医疗箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%8C%BB%E7%96%97.png","工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B7%A5%E5%85%B7%E7%AE%B1.png","高级工具箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E5%B7%A5%E5%85%B7%E7%AE%B1.png","文件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%96%87%E4%BB%B6%E7%AE%B1.png","大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E8%A1%A3.png","蓝色大衣":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%93%9D%E9%A2%86.png","衣服":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%B0%8F%E8%A1%A3%E6%9C%8D.png","抽屉":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%8A%BD%E5%B1%89.png","刮刮乐":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%88%AE%E5%88%AE%E4%B9%90.png","运动包":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E8%BF%90%E5%8A%A8%E5%8C%85.png","旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png","白色旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E7%99%BD%E6%97%85.png","商务旅行箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%95%86%E5%8A%A1%E6%97%85%E8%A1%8C%E7%AE%B1.png","大型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E5%A4%A7%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png","中型武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%B8%AD%E5%9E%8B%E6%AD%A6%E5%99%A8%E7%AE%B1.png","木质武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%9C%A8%E8%B4%A8%E6%AD%A6%E5%99%A8%E7%AE%B1.png","武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E6%AD%A6%E5%99%A8%E7%AE%B1.png","高级武器箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%AB%98%E7%BA%A7%E6%AD%A6%E5%99%A8%E7%AE%B1.png","配件箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E9%85%8D%E4%BB%B6%E7%AE%B1.png"};
var layerData={'贵重':['保险箱','滴滴保险','电子保险'],'电子':['收银机','家用机箱','军用主机'],'物资':['普通物资箱','高级物资箱'],'弹药':['子弹箱','手雷箱'],'医疗':['医疗箱','高级医疗箱'],'工具':['工具箱','高级工具箱'],'衣物':['大衣','蓝色大衣','衣服'],'家具':['抽屉','刮刮乐'],'容器':['文件箱','运动包','旅行箱','白色旅行箱','商务旅行箱'],'武器':['大型武器箱','中型武器箱','木质武器箱','武器箱','高级武器箱'],'配件':['配件箱']};
var orders=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];

// 读每个模块的 code 数组（要求文件用 commonjs 导出 code 变量）
var engineCode = null;
function loadEngine() {
  delete require.cache[require.resolve('./_mod_engine.cjs')];
  try { return require('./_mod_engine.cjs'); } catch(e) { return null; }
}
function codeFromModule(src) {
  // 用 new Function + 字符串拼接来加载 code 数组
  var fn = new Function('require', 'exports', 'module', '__filename', '__dirname',
    src + '\n;return module.exports;');
  var mod = { exports: {} };
  fn(require, mod.exports, mod, '', '');
  return mod.exports;
}

var modulesCode = {};
['mod01_basics','mod02_events','mod03_picker','mod04_markers','mod05_details','mod06_layers','mod07_cloud'].forEach(function(mn) {
  var src = fs.readFileSync('F:\\暗区突围网站\\_'+mn+'.cjs', 'utf8');
  // patch 导出：把最后一段 inject 代码替换为 module.exports = code;
  var patched = src;
  // 找到 "];" 结束
  var closeBracket = src.lastIndexOf('];\n');
  if (closeBracket < 0) closeBracket = src.indexOf('];\n');
  if (closeBracket < 0) { console.log(mn+': cannot find code array'); return; }
  patched = src.substring(0, closeBracket + 2) + '\nmodule.exports = code;\n';
  // 跳过 require('fs') / var maps =
  var code = codeFromModule(patched);
  if (code && Array.isArray(code)) {
    modulesCode[mn] = code.slice(); // copy
    console.log(mn+':', code.length, 'lines');
  } else {
    console.log(mn+': FAILED');
  }
});

// 生成代码：拼接所有模块，替换占位符
maps.forEach(function(m) {
  var eng = mapEngs[m];
  var cn = mapCNs[m];
  
  var lines = [];
  Object.keys(modulesCode).forEach(function(mn) {
    modulesCode[mn].forEach(function(line) {
      lines.push(line
        .replace(/MAP_ENG/g, eng)
        .replace(/MAP_CN/g, cn)
        .replace(/ICON_URLS/g, JSON.stringify(iconUrls))
        .replace(/LAYER_DATA/g, JSON.stringify(layerData))
        .replace(/ORDERS/g, JSON.stringify(orders))
      );
    });
  });
  
  var code = lines.join('\n');
  
  var fp = 'F:\\暗区突围网站\\pages\\'+m+'.html';
  var c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/<script>[\s\S]*?<\/script>/g, '');
  c = c.replace('</body>', '<script>\n'+code+'\n</script>\n</body>');
  fs.writeFileSync(fp, c);
  console.log(m+': INJECTED ('+code.length+' bytes)');
});

// 语法验证
var vc = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var ms = vc.match(/<script>([\s\S]*?)<\/script>/g);
var vall = ms ? ms.map(function(m){ return m.replace('<script>','').replace('</script>',''); }).join('\n') : '';

var checks=['loginGitHub','checkReviewBtn','jumpToFromUrl','getIconUrl','supabase','placePin','renderMarkers','deleteCurrentPin','loadCloudPins','toggleMenu','renderLayers'];
checks.forEach(function(f){
  var count = (vall.split(f).length - 1);
  console.log(f+':', count, count > 1 ? '⚠' : '', count === 0 ? '❌' : '');
});

var bra = (vall.match(/\{/g)||[]).length;
var brc = (vall.match(/\}/g)||[]).length;
console.log('Braces: {', bra, '=', brc, '- diff:', bra-brc);
var pa = (vall.match(/\(/g)||[]).length;
var pc = (vall.match(/\)/g)||[]).length;
console.log('Parens: (', pa, '=', pc, '- diff:', pa-pc);

try { new Function(vall); console.log('✅ FULL PARSE OK!'); }
catch(e) { console.log('❌ PARSE ERROR:', e.message); }
