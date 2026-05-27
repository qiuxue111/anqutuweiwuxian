const fs = require('fs');
var dir = 'G:\\暗区图片\\暗区容器\\';
var files = fs.readdirSync(dir);
files.forEach(function(f) { console.log(f); });
