const fs = require('fs');
var imgDir = 'G:\\暗区图片\\暗区容器\\';
var remoteBase = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/';
var files = fs.readdirSync(imgDir);

var fileToUrl = {};
files.forEach(function(f) {
  var base = f.replace(/\.png$/i, '');
  fileToUrl[base] = remoteBase + encodeURIComponent(f);
});

// 分类顺序
var catsOrder = ['贵重','电子','物资','弹药','医疗','工具','文档','衣物','家具','容器','军备','武器','配件'];

var types = [
  // 贵重（放最上面）
  {n:'保险箱', c:'贵重', icon:'保险'},
  {n:'滴滴保险', c:'贵重', icon:'滴滴保险'},
  {n:'电子保险', c:'贵重', icon:'电子保险'},

  // 电子（家用机箱+军用主机+收银机）
  {n:'收银机', c:'电子', icon:'收银机'},
  {n:'家用机箱', c:'电子', icon:'家用机箱'},
  {n:'军用主机', c:'电子', icon:'军用主机'},

  // 物资
  {n:'普通物资箱', c:'物资', icon:'置物箱'},
  {n:'高级物资箱', c:'物资', icon:'黑置物箱'},

  // 弹药
  {n:'子弹箱', c:'弹药', icon:'子弹箱'},
  {n:'手雷箱', c:'弹药', icon:'手雷箱'},

  // 医疗
  {n:'医疗箱', c:'医疗', icon:'中级医疗'},
  {n:'高级医疗箱', c:'医疗', icon:'高级医疗'},

  // 工具
  {n:'工具箱', c:'工具', icon:'工具箱'},
  {n:'高级工具箱', c:'工具', icon:'高级工具箱'},

  // 文档
  {n:'文件箱', c:'文档', icon:'文件箱'},

  // 衣物
  {n:'大衣', c:'衣物', icon:'大衣'},
  {n:'蓝色大衣', c:'衣物', icon:'蓝领'},
  {n:'衣服', c:'衣物', icon:'小衣服'},

  // 家具
  {n:'抽屉', c:'家具', icon:'抽屉'},
  {n:'刮刮乐', c:'家具', icon:'刮刮乐'},

  // 容器（文件箱+运动包+旅行箱+商务旅行箱+白旅）
  {n:'文件箱', c:'容器', icon:'文件箱'},
  {n:'运动包', c:'容器', icon:'运动包'},
  {n:'旅行箱', c:'容器', icon:'商务旅行箱'},
  {n:'白色旅行箱', c:'容器', icon:'白旅'},
  {n:'商务旅行箱', c:'容器', icon:'商务旅行箱'},

  // 军备
  // (空的)

  // 武器
  {n:'大型武器箱', c:'武器', icon:'大型武器箱'},
  {n:'中型武器箱', c:'武器', icon:'中型武器箱'},
  {n:'木质武器箱', c:'武器', icon:'木质武器箱'},
  {n:'武器箱', c:'武器', icon:'武器箱'},
  {n:'高级武器箱', c:'武器', icon:'高级武器箱'},

  // 配件
  {n:'配件箱', c:'配件', icon:'配件箱'},
];

// 构建 iconM
var iconM = {};
types.forEach(function(t) {
  if (fileToUrl[t.icon]) iconM[t.n] = fileToUrl[t.icon];
  else iconM[t.n] = '';
});

// 构建 pinTypes
var pinTypes = types.map(function(t) { return {n:t.n, c:t.c}; });

// 构建 layerData
var layerData = {};
catsOrder.forEach(function(cat) {
  var items = types.filter(function(t) { return t.c === cat; }).map(function(t) { return t.n; });
  if (items.length) layerData[cat] = items;
});

console.log('分类:');
catsOrder.forEach(function(cat) {
  if (layerData[cat]) console.log('  ' + cat + ': ' + layerData[cat].join(', '));
});
console.log('\n总数: ' + types.length + ' 个类型');
console.log('All have icons: ' + Object.values(iconM).every(function(v){return !!v;}));

// 注意：文件箱同时出现在文档和容器，但 pinTypes 里只能有一个 c
// 让文件箱的 c 用 '容器'，文档里加一个不同的类型
// 但文档里只有文件箱... 用户没给文档其他选项，那文档分类就不显示了？
// 看看用户意图：文件箱放容器了，那文档分类就应该删掉
// 更新 catsOrder
catsOrder = ['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];

// 重新构建 layerData（文档分类删掉）
var layerData2 = {};
catsOrder.forEach(function(cat) {
  var items = types.filter(function(t) { return t.c === cat; }).map(function(t) { return t.n; });
  if (items.length) layerData2[cat] = items;
});

console.log('\n最终分类:');
catsOrder.forEach(function(cat) {
  if (layerData2[cat]) console.log('  ' + cat + ': ' + layerData2[cat].join(', '));
});

// 修改 pinTypes 中文件箱的 c 改为 '容器'
pinTypes.forEach(function(t) {
  if (t.n === '文件箱') t.c = '容器';
});

// Generate JS
var js = '';
js += '// === map core v2 ===\n';
js += 'var scaleM=1,panX=0,panY=0,mode="browse",pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;\n';
js += 'var mapNameEng="MAP_ENG",mapNameCN="MAP_CN",cloudPins=[],cloudComments=[];\n';

js += 'var iconM={\n';
Object.keys(iconM).forEach(function(k) {
  js += '  "' + k + '":"' + iconM[k] + '",\n';
});
js += '};\n';

js += 'var pinTypes=[\n';
pinTypes.forEach(function(p) {
  js += '  {n:"' + p.n + '",c:"' + p.c + '"},\n';
});
js += '];\n';

js += 'var layerData={\n';
catsOrder.forEach(function(cat) {
  if (layerData2[cat]) js += '  "' + cat + '":[' + layerData2[cat].map(function(n){return '"' + n + '"';}).join(',') + '],\n';
});
js += '};\n';

js += '\n';
var funcs = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8').toString();
funcs = funcs.replace(
  "var order=['贵重','物资','弹药','医疗','工具','文档','衣物','家具','容器','军备','武器','配件'];",
  "var order=['贵重','电子','物资','弹药','医疗','工具','衣物','家具','容器','武器','配件'];"
);
js += funcs;

fs.writeFileSync('F:\\暗区突围网站\\map_core_v2.js', js);
console.log('\nGenerated map_core_v2.js (' + js.length + ' bytes)');
