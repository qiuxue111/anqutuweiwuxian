var fs = require('fs');
var c = fs.readFileSync('F:/暗区突围网站/pages/review.html', 'utf-8');

// 找到pin创建部分的起始和结束
var pinStart = c.indexOf("// Pin - red circle + container icon");
var pinEnd = c.indexOf("};", pinStart);
if (pinEnd < 0) pinEnd = c.indexOf("});", pinStart);

console.log('pin section at', pinStart, '-', pinEnd);
console.log(c.substring(pinStart, pinEnd + 50));
