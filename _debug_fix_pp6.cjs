var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
// Remove status:'pending' from pending_pins POST
c=c.replace(",status:'pending'}", "}");
fs.writeFileSync('F:\\暗区突围网站\\_mod03_picker.cjs',c);
console.log('DONE');
