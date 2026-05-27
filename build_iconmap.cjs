const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

// 容器图片路径（本地+远程）
var localImgPath = 'G:\\暗区图片\\暗区容器\\';
var remoteBase = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/';

// 读取文件名到映射
var imgFiles = fs.readdirSync(localImgPath);
console.log('Found', imgFiles.length, 'image files');

// 建立中文名 → 文件名的映射
// 文件命名规则：`高级工具箱.png` → 容器名 `高级工具箱`
var imgMap = {};
imgFiles.forEach(function(f) {
  var name = f.replace(/\.png$/i, '');
  imgMap[name] = f;
});

// 验证常见容器类型是否都有对应图片
var containerTypes = ['普通物资箱','高级物资箱','子弹箱','医疗箱','工具箱','文件柜','大衣','抽屉','保险箱','旅行箱','运动包','专业军备箱','大型武器箱','手雷箱','战术配件箱','通用钥匙','密码门','密室','普通敌人','精英敌人','游荡者','首领','其他'];
console.log('\nContainer image mapping:');
containerTypes.forEach(function(t) {
  var found = imgMap[t] || 'MISSING';
  console.log('  ' + t + ' → ' + found);
});

// 生成 iconMap 替换
var iconMapEntries = containerTypes.map(function(t) {
  var fn = imgMap[t];
  if (fn) {
    return "'" + t + "':'" + remoteBase + encodeURIComponent(fn) + "'";
  } else {
    return "'" + t + "':''";
  }
});

var newIconMap = 'var iconM={' + iconMapEntries.join(',') + '};';
console.log('\nNew iconMap:');
console.log(newIconMap);
