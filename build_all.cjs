const fs = require('fs');
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

// ===================== DATA LAYER =====================
var dataLayer = `
var iconM={
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
var pinTypes=[
  {n:"保险箱",c:"贵重"},{n:"滴滴保险",c:"贵重"},{n:"电子保险",c:"贵重"},
  {n:"收银机",c:"电子"},{n:"家用机箱",c:"电子"},{n:"军用主机",c:"电子"},
  {n:"普通物资箱",c:"物资"},{n:"高级物资箱",c:"物资"},
  {n:"子弹箱",c:"弹药"},{n:"手雷箱",c:"弹药"},
  {n:"医疗箱",c:"医疗"},{n:"高级医疗箱",c:"医疗"},
  {n:"工具箱",c:"工具"},{n:"高级工具箱",c:"工具"},
  {n:"文件箱",c:"容器"},{n:"大衣",c:"衣物"},{n:"蓝色大衣",c:"衣物"},{n:"衣服",c:"衣物"},
  {n:"抽屉",c:"家具"},{n:"刮刮乐",c:"家具"},
  {n:"文件箱",c:"容器"},{n:"运动包",c:"容器"},{n:"旅行箱",c:"容器"},{n:"白色旅行箱",c:"容器"},{n:"商务旅行箱",c:"容器"},
  {n:"大型武器箱",c:"武器"},{n:"中型武器箱",c:"武器"},{n:"木质武器箱",c:"武器"},{n:"武器箱",c:"武器"},{n:"高级武器箱",c:"武器"},
  {n:"配件箱",c:"配件"},
];
var layerData={
  "贵重":["保险箱","滴滴保险","电子保险"],
  "电子":["收银机","家用机箱","军用主机"],
  "物资":["普通物资箱","高级物资箱"],
  "弹药":["子弹箱","手雷箱"],
  "医疗":["医疗箱","高级医疗箱"],
  "工具":["工具箱","高级工具箱"],
  "衣物":["大衣","蓝色大衣","衣服"],
  "家具":["抽屉","刮刮乐"],
  "容器":["文件箱","运动包","旅行箱","白色旅行箱","商务旅行箱"],
  "武器":["大型武器箱","中型武器箱","木质武器箱","武器箱","高级武器箱"],
  "配件":["配件箱"],
};
`;

// ===================== CORE JS =====================
var coreJS = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 去掉 dataLayer 部分（如果有的话）
var firstFn = coreJS.indexOf('function supabase');
if (firstFn < 0) firstFn = coreJS.indexOf('function getIconUrl');
coreJS = coreJS.substring(firstFn);

// 合并
var fullJS = dataLayer + '\n' + coreJS;

// 也加上 var 声明
fullJS = 'var scaleM=1,panX=0,panY=0,mode="browse",pins=[],mapComments=[],curPinIdx=null,touchStartDist=0,touchStartScale=1;\nvar mapNameEng="MAP_ENG",mapNameCN="MAP_CN",cloudPins=[],cloudComments=[];\n' + fullJS;

// 验证
var op = (fullJS.match(/\(/g)||[]).length;
var cp = (fullJS.match(/\)/g)||[]).length;
var ob = (fullJS.match(/\{/g)||[]).length;
var cb = (fullJS.match(/\}/g)||[]).length;
console.log('Full JS:');
console.log('  (' + op + '=' + cp + ' ' + (op===cp?'OK':'MISMATCH'));
console.log('  {' + ob + '=' + cb + ' ' + (ob===cb?'OK':'MISMATCH'));

if (op !== cp || ob !== cb) {
  console.log('ERROR: bracket mismatch, aborting!');
  process.exit(1);
}

// 写入 map_core_v2.js
fs.writeFileSync('F:\\暗区突围网站\\map_core_v2.js', fullJS);
console.log('Written map_core_v2.js (' + fullJS.length + ' bytes)');

// 注入到所有地图
maps.forEach(function(name, i) {
  var fp = 'F:\\暗区突围网站\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var final = fullJS
    .replace(/mapNameEng="MAP_ENG"/g, 'mapNameEng="' + mapEng[i] + '"')
    .replace(/mapNameCN="MAP_CN"/g, 'mapNameCN="' + mapNames[i] + '"');
  c = c.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + final + '\n</script>');
  fs.writeFileSync(fp, c);
  console.log(name + ': OK');
});
console.log('All done');
