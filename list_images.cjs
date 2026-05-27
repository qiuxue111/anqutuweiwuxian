const fs = require('fs');
const dir = 'G:\\暗区图片\\暗区容器\\';
var names = fs.readdirSync(dir);
names.forEach(function(n) {
  console.log(n);
});
