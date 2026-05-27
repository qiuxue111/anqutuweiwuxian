const fs = require('fs');
var imgDir = 'G:\\暗区图片\\暗区容器\\';
var remoteBase = 'https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/';
var files = fs.readdirSync(imgDir);

// 文件名 = 容器名字，去掉扩展名
var names = files.map(function(f) { return f.replace(/\.png$/i, ''); });
console.log(names.join('\n'));
